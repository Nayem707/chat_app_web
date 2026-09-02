import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "@/app/store";
import { router } from "@/routes";

export const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
