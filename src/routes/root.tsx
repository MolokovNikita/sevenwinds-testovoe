import Dashboard from "../pages/Dashboard/Dashboard.tsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.tsx";
import { createBrowserRouter } from "react-router-dom";
export default createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
]);
