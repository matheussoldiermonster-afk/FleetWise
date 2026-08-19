import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

import Vehicles from "../pages/Vehicles/Vehicles";
import Technicians from "../pages/Technicians/Technicians";
import Fuelings from "../pages/Fuelings/Fuelings";
import Reports from "../pages/Reports/Reports";
import Maintenances from "../pages/Maintenances/Maintenances";

import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Veículos */}
        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <Vehicles />
            </PrivateRoute>
          }
        />

        {/* Técnicos */}
        <Route
          path="/technicians"
          element={
            <PrivateRoute>
              <Technicians />
            </PrivateRoute>
          }
        />

        {/* Viagens */}

        {/* Abastecimentos */}
        <Route
          path="/fuelings"
          element={
            <PrivateRoute>
              <Fuelings />
            </PrivateRoute>
          }
        />

        {/* Manutenções */}
        <Route
          path="/maintenances"
          element={
            <PrivateRoute>
              <Maintenances />
            </PrivateRoute>
          }
        />

        {/* Relatórios */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Qualquer rota inválida */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;