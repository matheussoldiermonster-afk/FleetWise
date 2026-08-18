const prisma = require("../config/prisma");

async function getDashboard(companyId) {
  const [
    totalVehicles,
    totalTechnicians,
    fuelings,
  ] = await Promise.all([
    prisma.vehicle.count({
      where: { companyId },
    }),
    prisma.technician.count({
      where: { companyId },
    }),

    prisma.fueling.findMany({
      where: {
        vehicle: { companyId },
      },
      orderBy: {
        date: "desc",
      },
      include: {
        vehicle: true,
      },
    }),
  ]);

  const totalFuelings = fuelings.length;

  const totalFuelCost = fuelings.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  );

  const totalLiters = fuelings.reduce(
    (sum, item) => sum + Number(item.liters),
    0
  );

  const averageFuelPrice =
    totalLiters > 0
      ? totalFuelCost / totalLiters
      : 0;

  return {
    totalVehicles,
    totalTechnicians,
    totalFuelings,
    totalFuelCost,
    averageFuelPrice,
    recentFuelings: fuelings.slice(0, 5),
  };
}

const MAINTENANCE_LABELS = {
  OIL_CHANGE: "Troca de óleo",
  OIL_FILTER: "Filtro de óleo",
  AIR_FILTER: "Filtro de ar",
  FUEL_FILTER: "Filtro de combustível",
  BRAKE_PADS: "Pastilhas de freio",
  BRAKE_DISC: "Disco de freio",
  TIRES: "Pneus",
  BATTERY: "Bateria",
  BELT: "Correia",
  INSPECTION: "Revisão",
  INSURANCE: "Seguro",
  LICENSING: "Licenciamento",
  OTHER: "Manutenção",
};

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MAINTENANCE_THRESHOLD_KM = 500;

function percentChange(current, previous) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function buildLastMonths(count) {
  const now = new Date();
  const months = [];

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ date, label: MONTH_LABELS[date.getMonth()] });
  }

  return months;
}

function isSameMonth(dateValue, refDate) {
  const date = new Date(dateValue);
  return (
    date.getFullYear() === refDate.getFullYear() &&
    date.getMonth() === refDate.getMonth()
  );
}

function maintenanceLabel(type) {
  return MAINTENANCE_LABELS[type] || "Manutenção";
}

function formatRelativeDate(dateValue) {
  const date = new Date(dateValue);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === now.toDateString()) {
    return `Hoje • ${time}`;
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return `Ontem • ${time}`;
  }

  return `${date.toLocaleDateString("pt-BR")} • ${time}`;
}

async function getStats(companyId) {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [vehicles, technicians, fuelings, trips] = await Promise.all([
    prisma.vehicle.findMany({
      where: { companyId },
      include: { maintenances: { orderBy: { performedAt: "desc" } } },
    }),
    prisma.technician.findMany({ where: { companyId } }),
    prisma.fueling.findMany({
      where: { vehicle: { companyId } },
      include: { vehicle: true },
    }),
    prisma.trip.findMany({
      where: { vehicle: { companyId } },
      include: { vehicle: true, technician: true },
    }),
  ]);

  // --- Totais gerais ---
  const totalSpent = fuelings.reduce((sum, f) => sum + Number(f.totalValue), 0);
  const totalLiters = fuelings.reduce((sum, f) => sum + Number(f.liters), 0);
  const totalKm = trips.reduce(
    (sum, t) => sum + (Number(t.finalKm) - Number(t.initialKm)),
    0
  );

  // --- Gastos por veículo (barras + pizza) ---
  const spentByVehicle = {};
  fuelings.forEach((f) => {
    const label = `${f.vehicle.model} - ${f.vehicle.plate}`;
    spentByVehicle[label] = (spentByVehicle[label] || 0) + Number(f.totalValue);
  });

  const chart = Object.entries(spentByVehicle).map(([name, valor]) => ({
    name,
    valor: Number(valor.toFixed(2)),
  }));

  const pieData = chart.map(({ name, valor }) => ({ name, value: valor }));

  // --- Gastos mensais (últimos 6 meses) ---
  const monthlyExpenses = buildLastMonths(6).map(({ date, label }) => {
    const value = fuelings
      .filter((f) => isSameMonth(f.date, date))
      .reduce((sum, f) => sum + Number(f.totalValue), 0);

    return { month: label, value: Number(value.toFixed(2)) };
  });

  // --- Tendências (mês atual x mês anterior) ---
  const inRange = (dateValue, start, end) => {
    const d = new Date(dateValue);
    return d >= start && (!end || d < end);
  };

  const fuelingsThisMonth = fuelings.filter((f) => inRange(f.date, startOfThisMonth));
  const fuelingsLastMonth = fuelings.filter((f) =>
    inRange(f.date, startOfLastMonth, startOfThisMonth)
  );

  const tripsThisMonth = trips.filter((t) => inRange(t.createdAt, startOfThisMonth));
  const tripsLastMonth = trips.filter((t) =>
    inRange(t.createdAt, startOfLastMonth, startOfThisMonth)
  );

  const sum = (list, field) => list.reduce((s, item) => s + Number(item[field]), 0);
  const sumKm = (list) =>
    list.reduce((s, t) => s + (Number(t.finalKm) - Number(t.initialKm)), 0);

  const vehiclesBeforeThisMonth = vehicles.filter((v) =>
    new Date(v.createdAt) < startOfThisMonth
  ).length;
  const techniciansBeforeThisMonth = technicians.filter((t) =>
    new Date(t.createdAt) < startOfThisMonth
  ).length;

  const trends = {
    vehicles: percentChange(vehicles.length, vehiclesBeforeThisMonth),
    technicians: percentChange(technicians.length, techniciansBeforeThisMonth),
    fuelings: percentChange(fuelingsThisMonth.length, fuelingsLastMonth.length),
    totalSpent: percentChange(
      sum(fuelingsThisMonth, "totalValue"),
      sum(fuelingsLastMonth, "totalValue")
    ),
    totalLiters: percentChange(
      sum(fuelingsThisMonth, "liters"),
      sum(fuelingsLastMonth, "liters")
    ),
    totalKm: percentChange(sumKm(tripsThisMonth), sumKm(tripsLastMonth)),
  };

  // --- Alertas de manutenção (km restante até o próximo serviço) ---
  const alerts = [];
  vehicles.forEach((vehicle) => {
    const latestByType = {};
    vehicle.maintenances.forEach((m) => {
      if (!latestByType[m.type]) {
        latestByType[m.type] = m;
      }
    });

    Object.values(latestByType).forEach((m) => {
      const remaining = Number(m.nextKm) - Number(vehicle.currentKm);

      if (remaining <= MAINTENANCE_THRESHOLD_KM) {
        alerts.push({
          title: maintenanceLabel(m.type),
          description: `${vehicle.model} - ${vehicle.plate} - ${
            remaining <= 0
              ? `venceu há ${Math.abs(Math.round(remaining))} km`
              : `vencerá em ${Math.round(remaining)} km`
          }`,
          remaining,
        });
      }
    });
  });
  alerts.sort((a, b) => a.remaining - b.remaining);

  // --- Atividades recentes ---
  const events = [
    ...fuelings.map((f) => ({
      title: `⛽ Abastecimento - ${f.vehicle.model} (${f.vehicle.plate})`,
      date: f.date,
    })),
    ...trips.map((t) => ({
      title: `🚗 Viagem - ${t.vehicle.model} (${t.vehicle.plate})`,
      date: t.createdAt,
    })),
    ...vehicles.flatMap((v) =>
      v.maintenances.map((m) => ({
        title: `🛠 ${maintenanceLabel(m.type)} - ${v.model} (${v.plate})`,
        date: m.performedAt,
      }))
    ),
    ...technicians.map((t) => ({
      title: `👷 Novo técnico cadastrado: ${t.name}`,
      date: t.createdAt,
    })),
  ];

  const activities = events
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)
    .map((e) => ({ title: e.title, date: formatRelativeDate(e.date) }));

  return {
    vehicles: vehicles.length,
    technicians: technicians.length,
    fuelings: fuelings.length,
    totalSpent,
    totalLiters,
    totalKm,
    chart,
    pieData,
    monthlyExpenses,
    trends,
    alerts: alerts.slice(0, 8),
    activities,
  };
}

module.exports = {
  getDashboard,
  getStats,
};