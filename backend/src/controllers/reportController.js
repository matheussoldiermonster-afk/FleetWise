const reportService = require("../services/reportService");

function handle(fn) {
  return async (req, res) => {
    try {
      const data = await fn(req);
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message || "Erro ao gerar relatório.",
      });
    }
  };
}

module.exports = {
  general: handle((req) =>
    reportService.getGeneralReport(req.user.companyId, req.query)
  ),

  vehicle: handle((req) =>
    reportService.getVehicleReport(
      req.user.companyId,
      req.params.vehicleId,
      req.query
    )
  ),

  technician: handle((req) =>
    reportService.getTechnicianReport(
      req.user.companyId,
      req.params.technicianId,
      req.query
    )
  ),

  financial: handle((req) =>
    reportService.getFinancialReport(req.user.companyId, req.query)
  ),

  personalUsage: handle((req) =>
    reportService.getPersonalUsageReport(req.user.companyId, req.query)
  ),

  maintenance: handle((req) =>
    reportService.getMaintenanceReport(req.user.companyId)
  ),

  expenseRanking: handle((req) =>
    reportService.getExpenseRanking(req.user.companyId, req.query)
  ),

  consumption: handle((req) =>
    reportService.getConsumptionReport(req.user.companyId, req.query)
  ),

  executiveSummary: handle((req) =>
    reportService.getExecutiveSummary(req.user.companyId, req.query)
  ),

  reimbursementBalance: handle((req) =>
    reportService.getReimbursementBalance(
      req.user.companyId,
      req.params.vehicleId,
      req.query
    )
  ),
};
