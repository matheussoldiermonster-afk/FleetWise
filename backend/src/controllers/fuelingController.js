const FuelingService = require("../services/fuelingService");

async function create(req, res) {
  try {
    const fueling = await FuelingService.createFueling(
      req.body,
      req.user.companyId
    );

    return res.status(201).json(fueling);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao cadastrar abastecimento.",
    });
  }
}

async function index(req, res) {
  try {
    const fuelings = await FuelingService.getFuelings(req.user.companyId);

    return res.json(fuelings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao listar abastecimentos.",
    });
  }
}

async function show(req, res) {
  try {
    const fueling = await FuelingService.getFuelingById(
      req.params.id,
      req.user.companyId
    );

    return res.json(fueling);
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      message: error.message || "Abastecimento não encontrado.",
    });
  }
}

async function update(req, res) {
  try {
    const fueling = await FuelingService.updateFueling(
      req.params.id,
      req.body,
      req.user.companyId
    );

    return res.json(fueling);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao atualizar abastecimento.",
    });
  }
}

async function remove(req, res) {
  try {
    await FuelingService.deleteFueling(req.params.id, req.user.companyId);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao remover abastecimento.",
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