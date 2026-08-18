const authService = require("../services/authService");

async function register(req, res) {
  try {
    const user = await authService.register(req.body, req.user.companyId);

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const token = await authService.login(req.body);

    return res.json(token);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const appUrl =
      process.env.FRONTEND_URL || req.get("origin") || "http://localhost:5173";

    await authService.requestPasswordReset(req.body.email, appUrl);

    // Resposta sempre igual, exista ou não o e-mail — evita
    // que alguém descubra quais e-mails estão cadastrados.
    return res.json({
      message:
        "Se esse e-mail estiver cadastrado, enviamos um link de redefinição de senha.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao solicitar redefinição de senha.",
    });
  }
}

async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);

    return res.json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};