import { RouterProvider } from "react-router-dom";
import { ReduxProvider } from "./providers/ReduxProvider";
import { router } from "@/routes";

export const App = () => (
  <ReduxProvider>
    <RouterProvider router={router} />
  </ReduxProvider>
);
