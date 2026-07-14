const companyService = require("../services/companyService");

async function create(req, res) {
  try {
    const company = await companyService.createCompany(req.body);

    return res.status(201).json(company);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
};