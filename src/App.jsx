import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "@/app/store";
import { router } from "@/routes";
import { injectStore } from "@/services/axiosInstance";

// Inject the store reference so axiosInstance can read auth tokens
// without creating a circular dependency (store → apiSlice → axiosInstance → store).
injectStore(store);

export const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
