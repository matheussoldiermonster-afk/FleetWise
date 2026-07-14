const dashboardService = require("../services/dashboardService");

async function index(req, res) {
  try {
    const dashboard = await dashboardService.getDashboard();

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  index,
};