const express = require("express");

const companyRoutes = require("./companyRoutes");
const userRoutes = require("./userRoutes");
const technicianRoutes = require("./technicianRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const fuelingRoutes = require("./fuelingRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.use("/companies", companyRoutes);
router.use("/users", userRoutes);
router.use("/technicians", technicianRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/fuelings", fuelingRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;