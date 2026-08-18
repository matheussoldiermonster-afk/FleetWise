const notificationService = require("../services/notificationService");

async function index(req, res) {
  try {
    const data = await notificationService.getNotifications(req.user.companyId);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao carregar notificações.",
    });
  }
}

async function dismiss(req, res) {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    await notificationService.dismissNotification(
      req.user.companyId,
      key,
      Number(value)
    );

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao dispensar notificação.",
    });
  }
}

module.exports = {
  index,
  dismiss,
};
