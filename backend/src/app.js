const express = require("express");

const { corsMiddleware, generalRateLimiter } = require("./middlewares/security");

const vehicleRoutes = require("./routes/vehicleRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const fuelingRoutes = require("./routes/fuelingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./auth/authMiddleware");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const companyRoutes = require("./routes/companyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Necessário para o rate limiting funcionar corretamente atrás de um
// proxy reverso (Render, Railway, Vercel, Nginx etc.) — sem isso, todos
// os usuários são enxergados como um IP só depois do deploy.
app.set("trust proxy", 1);

app.use(corsMiddleware);
app.use(generalRateLimiter);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API FleetWise funcionando 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

app.use("/api/vehicles", authMiddleware, vehicleRoutes);
app.use("/api/technicians", authMiddleware, technicianRoutes);
app.use("/api/fuelings", authMiddleware, fuelingRoutes);
app.use("/api/trips", authMiddleware, tripRoutes);
app.use("/api/maintenances", authMiddleware, maintenanceRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);
app.use("/api/notifications", authMiddleware, notificationRoutes);

module.exports = app;