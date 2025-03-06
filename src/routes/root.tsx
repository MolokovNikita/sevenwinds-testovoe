import Dashboard from "../Dashboard.tsx";
import ErrorPage from "../pages/ErrorPage/error-page.tsx";
import { createBrowserRouter } from "react-router-dom";
export default createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
]);
