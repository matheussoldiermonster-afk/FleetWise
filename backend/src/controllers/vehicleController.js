const vehicleService = require("../services/vehicleService");

async function create(req, res) {
  try {
    req.body.companyId = req.user.companyId;

    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function index(req, res) {
  try {
    const vehicles = await vehicleService.getVehicles(
      req.user.companyId
    );

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const vehicle = await vehicleService.updateVehicle(
      Number(req.params.id),
      req.user.companyId,
      req.body
    );

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    await vehicleService.deleteVehicle(
      Number(req.params.id),
      req.user.companyId
    );

    res.json({
      message: "Veículo removido com sucesso.",
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