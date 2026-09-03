import { RouterProvider } from "react-router-dom";
import { ReduxProvider } from "./providers/ReduxProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { router } from "@/routes";

export const App = () => (
  <ReduxProvider>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </ReduxProvider>
);
