const vehicleService = require("../services/vehicleService");

async function create(req, res) {
  try {
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
    const vehicles = await vehicleService.getVehicles();

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  index,
};