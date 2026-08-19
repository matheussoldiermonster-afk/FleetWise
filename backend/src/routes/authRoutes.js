const express = require("express");

const controller = require("../controllers/authController");
const authMiddleware = require("../auth/authMiddleware");
const { authRateLimiter, validate, schemas } = require("../middlewares/security");

const router = express.Router();

// Convidar um colega para a MINHA empresa (precisa estar logado)
router.post("/register", authMiddleware, validate(schemas.register), controller.register);

router.post("/login", authRateLimiter, validate(schemas.login), controller.login);

router.post(
  "/forgot-password",
  authRateLimiter,
  validate(schemas.forgotPassword),
  controller.forgotPassword
);
router.post(
  "/reset-password",
  authRateLimiter,
  validate(schemas.resetPassword),
  controller.resetPassword
);

module.exports = router;