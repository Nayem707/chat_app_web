/**
 * Converts any Axios error into a consistent normalized shape.
 * Use the `isNormalized` flag to prevent re-processing already-normalized errors.
 */
export const normalizeApiError = (error) => {
  if (error?.isNormalized) return error;

  const status = error.response?.status ?? 0;
  const body = error.response?.data ?? {};

  let message;
  if (error.code === "ECONNABORTED") {
    message = "Request timed out. Please try again.";
  } else if (!error.response) {
    message = "Network error. Check your connection and try again.";
  } else {
    const serverMessage = body.error || body.message;
    switch (status) {
      case 400:
        message = serverMessage || "Bad request.";
        break;
      case 401:
        message = serverMessage || "Session expired. Please sign in again.";
        break;
      case 403:
        message = serverMessage || "You do not have permission to do that.";
        break;
      case 404:
        message = serverMessage || "The requested resource was not found.";
        break;
      case 422:
        message = serverMessage || "Validation failed.";
        break;
      case 429:
        message = serverMessage || "Too many requests. Please slow down.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = serverMessage || "An unexpected error occurred.";
    }
  }

  return {
    isNormalized: true,
    success: false,
    message,
    statusCode: status,
    // Preserve structured field-level validation details when present.
    errors: body.details ?? body.errors ?? [],
  };
};
