const technicianService = require("../services/technicianService");

async function create(req, res) {
  try {
    const technician = await technicianService.createTechnician(req.body);
    return res.status(201).json(technician);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  create
};