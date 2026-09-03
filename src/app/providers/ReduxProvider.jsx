import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { injectStore } from "@/services/axiosInstance";

// Inject store into axios so auth tokens attach to every request.
injectStore(store);

export const ReduxProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
