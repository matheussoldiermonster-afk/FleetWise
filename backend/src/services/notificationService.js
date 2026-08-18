const prisma = require("../config/prisma");
const reportService = require("./reportService");

async function buildAlerts(companyId) {
  const [maintenance, balanceAlerts] = await Promise.all([
    reportService.getMaintenanceReport(companyId),
    reportService.getNegativeBalanceAlerts(companyId),
  ]);

  const maintenanceItems = maintenance.items
    .filter((item) => item.critical)
    .map((item) => ({
      type: "maintenance",
      title: `${item.type} - ${item.vehicle}`,
      description:
        item.remaining <= 0
          ? `Venceu há ${Math.abs(item.remaining)} km`
          : `Faltam ${item.remaining} km`,
      link: "/maintenances",
      key: `maintenance:${item.vehicleId}:${item.maintenanceType}`,
      value: item.remaining,
    }));

  const balanceItems = balanceAlerts.map((alert) => ({
    type: "balance",
    title: `Saldo negativo - ${alert.vehicle}`,
    description: `Saldo atual: ${alert.balance} km`,
    link: "/reports",
    key: `balance:${alert.vehicleId}`,
    value: alert.balance,
  }));

  return [...maintenanceItems, ...balanceItems];
}

async function getNotifications(companyId) {
  const [alerts, dismissals] = await Promise.all([
    buildAlerts(companyId),
    prisma.notificationDismissal.findMany({ where: { companyId } }),
  ]);

  const dismissedMap = new Map(dismissals.map((d) => [d.key, d.value]));

  // Só fica escondida se a situação continuar EXATAMENTE igual a quando
  // foi dispensada. Se o valor mudou (piorou, melhorou, ou foi resolvida
  // e surgiu de novo), o alerta reaparece.
  const items = alerts.filter((alert) => dismissedMap.get(alert.key) !== alert.value);

  return {
    count: items.length,
    items,
  };
}

async function dismissNotification(companyId, key, value) {
  return prisma.notificationDismissal.upsert({
    where: {
      companyId_key: { companyId, key },
    },
    update: { value },
    create: { companyId, key, value },
  });
}

module.exports = {
  getNotifications,
  dismissNotification,
};
