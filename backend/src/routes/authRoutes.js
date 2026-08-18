const express = require("express");

const controller = require("../controllers/authController");
const authMiddleware = require("../auth/authMiddleware");

const router = express.Router();

// Convidar um colega para a MINHA empresa (precisa estar logado)
router.post("/register", authMiddleware, controller.register);

router.post("/login", controller.login);

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;