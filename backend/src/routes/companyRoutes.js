const express = require("express");
const companyController = require("../controllers/companyController");
const authMiddleware = require("../auth/authMiddleware");

const router = express.Router();

// Criação da empresa + primeiro usuário (público, é o "sign up")
router.post("/", companyController.create);

// Configurações da MINHA empresa (precisa estar logado)
router.get("/me", authMiddleware, companyController.me);
router.put("/me", authMiddleware, companyController.updateSettings);

module.exports = router;