import { BrowserRouter, Routes, Route } from "react-router-dom";

function Login() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
        fontFamily: "Arial",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        FleetWise 🚗
      </h1>

      <p style={{ fontSize: "18px", color: "#94A3B8" }}>
        Sistema Inteligente de Gestão de Frotas
      </p>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;