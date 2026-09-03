import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./Layout/RootLayout";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import Analytics from "./Pages/Analytics";
import BudgetForm from "./Pages/BudgetForm";
import Profile from "./Pages/Profile";
import Errorpage from "./Pages/Errorpage";
import { BudgetDataProvider } from "./context/BudgetContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Errorpage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },

      {
        path: "budgets",
        element: <BudgetForm />,
      },

      {
        path: "analytics",
        element: <Analytics />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return (
    <BudgetDataProvider>
      <RouterProvider router={router} />
    </BudgetDataProvider>
  );
}

export default App;
