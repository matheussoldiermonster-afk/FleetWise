const express = require("express");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.get("/general", reportController.general);
router.get("/vehicle/:vehicleId", reportController.vehicle);
router.get("/technician/:technicianId", reportController.technician);
router.get("/financial", reportController.financial);
router.get("/personal-usage", reportController.personalUsage);
router.get("/maintenance", reportController.maintenance);
router.get("/expense-ranking", reportController.expenseRanking);
router.get("/consumption", reportController.consumption);
router.get("/executive-summary", reportController.executiveSummary);
router.get("/reimbursement-balance/:vehicleId", reportController.reimbursementBalance);

module.exports = router;
