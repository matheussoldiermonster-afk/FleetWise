const fuelingService = require("../services/fuelingService");

async function create(req, res) {

  try {

    const fueling = await fuelingService.createFueling(req.body);

    return res.status(201).json(fueling);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

}

module.exports = {
  create,
};