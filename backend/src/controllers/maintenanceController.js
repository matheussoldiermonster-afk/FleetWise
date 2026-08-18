const maintenanceService = require("../services/maintenanceService");

async function create(req, res) {
  try {
    const maintenance = await maintenanceService.createMaintenance(
      req.body,
      req.user.companyId
    );

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function index(req, res) {
  try {
    const maintenances = await maintenanceService.getMaintenances(
      req.user.companyId
    );

    res.json(maintenances);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function show(req, res) {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(
      Number(req.params.id),
      req.user.companyId
    );

    res.json(maintenance);
  } catch (error) {
    res.status(404).json({
      message: error.message || "Manutenção não encontrada.",
    });
  }
}

async function update(req, res) {
  try {
    const maintenance = await maintenanceService.updateMaintenance(
      Number(req.params.id),
      req.body,
      req.user.companyId
    );

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    await maintenanceService.deleteMaintenance(
      Number(req.params.id),
      req.user.companyId
    );

    res.json({
      message: "Manutenção removida com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  index,
  show,
  update,
  remove,
};
