const technicianService = require("../services/technicianService");

async function create(req, res) {
  try {
    req.body.companyId = req.user.companyId;

    const technician = await technicianService.createTechnician(req.body);

    res.status(201).json(technician);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function index(req, res) {
  try {
    const technicians = await technicianService.getTechnicians(
      req.user.companyId
    );

    res.json(technicians);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const technician = await technicianService.updateTechnician(
      Number(req.params.id),
      req.user.companyId,
      req.body
    );

    res.json(technician);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    await technicianService.deleteTechnician(
      Number(req.params.id),
      req.user.companyId
    );

    res.json({
      message: "Técnico removido com sucesso.",
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
  update,
  remove,
};