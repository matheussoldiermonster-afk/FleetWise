const express = require("express");
const companyController = require("../controllers/companyController");
const authMiddleware = require("../auth/authMiddleware");
const { authRateLimiter, validate, schemas } = require("../middlewares/security");

const router = express.Router();

// Criação da empresa + primeiro usuário (público, é o "sign up")
router.post(
  "/",
  authRateLimiter,
  validate(schemas.createCompany),
  companyController.create
);

// Configurações da MINHA empresa (precisa estar logado)
router.get("/me", authMiddleware, companyController.me);
router.put("/me", authMiddleware, companyController.updateSettings);

module.exports = router;