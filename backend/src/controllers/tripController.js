const tripService = require("../services/tripService");

async function create(req, res) {
  try {
    const trip = await tripService.createTrip(req.body, req.user.companyId);

    return res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
}

async function index(req, res) {
  try {
    const trips = await tripService.getTrips(req.user.companyId);

    return res.json(trips);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const trip = await tripService.updateTrip(
      req.params.id,
      req.body,
      req.user.companyId
    );

    return res.json(trip);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    await tripService.deleteTrip(req.params.id, req.user.companyId);

    return res.json({
      message: "Viagem removida com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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
