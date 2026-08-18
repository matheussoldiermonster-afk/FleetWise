const companyService = require("../services/companyService");

async function create(req, res) {
  try {
    const result = await companyService.createCompany(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const company = await companyService.getCompanyById(req.user.companyId);

    return res.json(company);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

async function updateSettings(req, res) {
  try {
    const company = await companyService.updateSettings(
      req.user.companyId,
      req.body
    );

    return res.json(company);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  me,
  updateSettings,
};