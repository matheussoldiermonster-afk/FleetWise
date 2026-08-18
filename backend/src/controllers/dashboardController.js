const dashboardService = require("../services/dashboardService");

async function index(req, res) {
  try {
    const data = await dashboardService.getDashboard(req.user.companyId);

    return res.json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar dashboard",
    });
  }
}

async function stats(req, res) {
  try {
    const data = await dashboardService.getStats(req.user.companyId);

    return res.json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar estatísticas do dashboard.",
    });
  }
}

module.exports = {
  index,
  stats,
};