const prisma = require("../config/prisma");

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

const FUEL_LABELS = {
  GASOLINE: "Gasolina",
  ETHANOL: "Etanol",
  DIESEL: "Diesel",
  FLEX: "Flex",
  ELECTRIC: "Elétrico",
};

const MAINTENANCE_THRESHOLD_KM = 500;

function maintenanceLabel(type) {
  return MAINTENANCE_LABELS[type] || "Manutenção";
}

function fuelLabel(type) {
  return FUEL_LABELS[type] || type;
}

function buildPeriod(startDate, endDate) {
  const now = new Date();

  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);

  const end = endDate
    ? new Date(endDate)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  if (endDate && end.getHours() === 0 && end.getMinutes() === 0) {
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

function round(value, digits = 2) {
  return Number((value || 0).toFixed(digits));
}

// ---------------------------------------------------------------------
// 1. Relatório Geral
// ---------------------------------------------------------------------
async function getGeneralReport(companyId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const vehicleFilter = filters.vehicleId
    ? { id: Number(filters.vehicleId) }
    : {};

  const [vehiclesCount, techniciansCount] = await Promise.all([
    prisma.vehicle.count({ where: { companyId, ...vehicleFilter } }),
    prisma.technician.count({
      where: {
        companyId,
        ...(filters.technicianId ? { id: Number(filters.technicianId) } : {}),
      },
    }),
  ]);

  const fuelings = await prisma.fueling.findMany({
    where: {
      vehicle: { companyId, ...vehicleFilter },
      date: { gte: start, lte: end },
      ...(filters.fuelType && { fuelType: filters.fuelType }),
    },
    include: { vehicle: true },
  });

  const trips = await prisma.trip.findMany({
    where: {
      vehicle: { companyId, ...vehicleFilter },
      createdAt: { gte: start, lte: end },
      ...(filters.technicianId && {
        technicianId: Number(filters.technicianId),
      }),
    },
  });

  const totalLiters = fuelings.reduce((sum, f) => sum + Number(f.liters), 0);
  const totalSpent = fuelings.reduce((sum, f) => sum + Number(f.totalValue), 0);
  const workKm = trips.reduce((sum, t) => sum + Number(t.workKm), 0);
  const personalKm = trips.reduce((sum, t) => sum + Number(t.personalKm), 0);
  const totalKm = workKm + personalKm;

  return {
    period: { start, end },
    vehiclesCount,
    techniciansCount,
    fuelingsCount: fuelings.length,
    tripsCount: trips.length,
    totalLiters: round(totalLiters),
    totalSpent: round(totalSpent),
    totalKm: round(totalKm),
    workKm: round(workKm),
    personalKm: round(personalKm),
    averageConsumption: totalLiters > 0 ? round(totalKm / totalLiters) : null,
  };
}

// ---------------------------------------------------------------------
// 2. Relatório por Veículo
// ---------------------------------------------------------------------
async function getVehicleReport(companyId, vehicleId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  const fuelings = await prisma.fueling.findMany({
    where: {
      vehicleId: vehicle.id,
      date: { gte: start, lte: end },
    },
    orderBy: { date: "asc" },
  });

  const trips = await prisma.trip.findMany({
    where: {
      vehicleId: vehicle.id,
      createdAt: { gte: start, lte: end },
    },
    include: { technician: true },
    orderBy: { createdAt: "asc" },
  });

  const totalLiters = fuelings.reduce((sum, f) => sum + Number(f.liters), 0);
  const totalSpent = fuelings.reduce((sum, f) => sum + Number(f.totalValue), 0);
  const workKm = trips.reduce((sum, t) => sum + Number(t.workKm), 0);
  const personalKm = trips.reduce((sum, t) => sum + Number(t.personalKm), 0);
  const totalKm = workKm + personalKm;

  const history = trips.map((t) => ({
    date: t.createdAt,
    technician: t.technician?.name || "-",
    initialKm: t.initialKm,
    finalKm: t.finalKm,
    km: round(Number(t.workKm)),
    personalKmDetected: round(Number(t.personalKm)),
  }));

  return {
    period: { start, end },
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      currentKm: vehicle.currentKm,
    },
    fuelingsCount: fuelings.length,
    tripsCount: trips.length,
    totalLiters: round(totalLiters),
    totalSpent: round(totalSpent),
    workKm: round(workKm),
    personalKm: round(personalKm),
    totalKm: round(totalKm),
    averageConsumption: totalLiters > 0 ? round(totalKm / totalLiters) : null,
    history,
  };
}

// ---------------------------------------------------------------------
// 3. Relatório por Técnico
// ---------------------------------------------------------------------
async function getTechnicianReport(companyId, technicianId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const technician = await prisma.technician.findUnique({
    where: { id: Number(technicianId) },
  });

  if (!technician || technician.companyId !== companyId) {
    throw new Error("Técnico não encontrado.");
  }

  const trips = await prisma.trip.findMany({
    where: {
      technicianId: technician.id,
      createdAt: { gte: start, lte: end },
    },
    include: { vehicle: true },
  });

  const workKm = trips.reduce((sum, t) => sum + Number(t.workKm), 0);
  const personalKm = trips.reduce((sum, t) => sum + Number(t.personalKm), 0);

  const vehiclesUsed = [
    ...new Map(
      trips.map((t) => [
        t.vehicleId,
        `${t.vehicle.model} - ${t.vehicle.plate}`,
      ])
    ).values(),
  ];

  return {
    period: { start, end },
    technician: {
      id: technician.id,
      name: technician.name,
    },
    tripsCount: trips.length,
    workKm: round(workKm),
    personalKm: round(personalKm),
    vehiclesUsed,
    note:
      "Abastecimentos não são vinculados diretamente ao técnico no sistema hoje (o campo 'responsável' do abastecimento é só um texto livre), então não entram nesse relatório.",
  };
}

// ---------------------------------------------------------------------
// 4. Relatório Financeiro
// ---------------------------------------------------------------------
async function getFinancialReport(companyId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const fuelings = await prisma.fueling.findMany({
    where: {
      vehicle: { companyId },
      date: { gte: start, lte: end },
    },
  });

  const byFuelType = {};
  fuelings.forEach((f) => {
    const label = fuelLabel(f.fuelType);
    byFuelType[label] = (byFuelType[label] || 0) + Number(f.totalValue);
  });

  const breakdown = Object.entries(byFuelType).map(([type, value]) => ({
    type,
    value: round(value),
  }));

  const totalSpent = fuelings.reduce((sum, f) => sum + Number(f.totalValue), 0);

  // Últimos 6 meses (gráfico)
  const monthLabels = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const now = new Date();
  const allFuelings = await prisma.fueling.findMany({
    where: { vehicle: { companyId } },
  });

  const monthlyChart = [];
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = allFuelings
      .filter((f) => {
        const d = new Date(f.date);
        return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
      })
      .reduce((sum, f) => sum + Number(f.totalValue), 0);

    monthlyChart.push({ month: monthLabels[ref.getMonth()], value: round(value) });
  }

  return {
    period: { start, end },
    totalSpent: round(totalSpent),
    breakdown,
    monthlyChart,
  };
}

// ---------------------------------------------------------------------
// 5. Relatório de Uso Particular
// ---------------------------------------------------------------------
async function getPersonalUsageReport(companyId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const company = await prisma.company.findUnique({ where: { id: companyId } });

  const trips = await prisma.trip.findMany({
    where: {
      vehicle: { companyId },
      createdAt: { gte: start, lte: end },
      personalKm: { gt: 0 },
      ...(filters.vehicleId && { vehicleId: Number(filters.vehicleId) }),
      ...(filters.technicianId && {
        technicianId: Number(filters.technicianId),
      }),
    },
    include: { vehicle: true, technician: true },
  });

  const costPerKm = company?.costPerKm ?? null;

  const grouped = {};
  trips.forEach((t) => {
    const key = `${t.vehicleId}-${t.technicianId}`;
    if (!grouped[key]) {
      grouped[key] = {
        vehicle: `${t.vehicle.model} - ${t.vehicle.plate}`,
        technician: t.technician.name,
        personalKm: 0,
      };
    }
    grouped[key].personalKm += Number(t.personalKm);
  });

  const items = Object.values(grouped)
    .map((item) => ({
      ...item,
      personalKm: round(item.personalKm),
      estimatedCost:
        costPerKm !== null ? round(item.personalKm * costPerKm) : null,
    }))
    .sort((a, b) => b.personalKm - a.personalKm);

  return {
    period: { start, end },
    costPerKm,
    totalPersonalKm: round(items.reduce((s, i) => s + i.personalKm, 0)),
    totalEstimatedCost:
      costPerKm !== null
        ? round(items.reduce((s, i) => s + (i.estimatedCost || 0), 0))
        : null,
    items,
  };
}

// ---------------------------------------------------------------------
// 6. Relatório de Manutenção
// ---------------------------------------------------------------------
async function getMaintenanceReport(companyId) {
  const vehicles = await prisma.vehicle.findMany({
    where: { companyId },
    include: { maintenances: { orderBy: { performedAt: "desc" } } },
  });

  const items = [];

  vehicles.forEach((vehicle) => {
    const latestByType = {};
    vehicle.maintenances.forEach((m) => {
      if (!latestByType[m.type]) latestByType[m.type] = m;
    });

    Object.values(latestByType).forEach((m) => {
      const remaining = Number(m.nextKm) - Number(vehicle.currentKm);

      items.push({
        vehicleId: vehicle.id,
        vehicle: `${vehicle.model} - ${vehicle.plate}`,
        currentKm: vehicle.currentKm,
        maintenanceType: m.type,
        type: maintenanceLabel(m.type),
        nextKm: m.nextKm,
        remaining: round(remaining),
        critical: remaining <= MAINTENANCE_THRESHOLD_KM,
      });
    });
  });

  items.sort((a, b) => a.remaining - b.remaining);

  return { items };
}

// ---------------------------------------------------------------------
// 7. Ranking de Gastos
// ---------------------------------------------------------------------
async function getExpenseRanking(companyId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const fuelings = await prisma.fueling.findMany({
    where: {
      vehicle: { companyId },
      date: { gte: start, lte: end },
    },
    include: { vehicle: true },
  });

  const spentByVehicle = {};
  fuelings.forEach((f) => {
    const key = `${f.vehicle.model} - ${f.vehicle.plate}`;
    spentByVehicle[key] = (spentByVehicle[key] || 0) + Number(f.totalValue);
  });

  const ranking = Object.entries(spentByVehicle)
    .map(([vehicle, total]) => ({ vehicle, total: round(total) }))
    .sort((a, b) => b.total - a.total);

  return { period: { start, end }, ranking };
}

// ---------------------------------------------------------------------
// 8. Relatório de Consumo
// ---------------------------------------------------------------------
async function getConsumptionReport(companyId, filters = {}) {
  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const vehicles = await prisma.vehicle.findMany({ where: { companyId } });

  const results = [];

  for (const vehicle of vehicles) {
    const [fuelings, trips] = await Promise.all([
      prisma.fueling.findMany({
        where: { vehicleId: vehicle.id, date: { gte: start, lte: end } },
      }),
      prisma.trip.findMany({
        where: { vehicleId: vehicle.id, createdAt: { gte: start, lte: end } },
      }),
    ]);

    const totalLiters = fuelings.reduce((s, f) => s + Number(f.liters), 0);
    const totalKm = trips.reduce(
      (s, t) => s + Number(t.workKm) + Number(t.personalKm),
      0
    );

    if (totalLiters === 0) continue;

    const actual = round(totalKm / totalLiters);
    const expected = vehicle.averageConsumption;
    const deviation = expected ? round(((actual - expected) / expected) * 100) : null;

    results.push({
      vehicle: `${vehicle.model} - ${vehicle.plate}`,
      actualConsumption: actual,
      expectedConsumption: expected,
      deviationPercent: deviation,
      outOfExpected: deviation !== null && Math.abs(deviation) > 15,
    });
  }

  results.sort((a, b) => b.actualConsumption - a.actualConsumption);

  return { period: { start, end }, results };
}

// ---------------------------------------------------------------------
// 9. Resumo Executivo
// ---------------------------------------------------------------------
async function getExecutiveSummary(companyId, filters = {}) {
  const [general, ranking, maintenance] = await Promise.all([
    getGeneralReport(companyId, filters),
    getExpenseRanking(companyId, filters),
    getMaintenanceReport(companyId),
  ]);

  const topVehicle = ranking.ranking[0];
  const topVehicleShare =
    topVehicle && general.totalSpent > 0
      ? round((topVehicle.total / general.totalSpent) * 100, 1)
      : null;

  const criticalMaintenances = maintenance.items.filter((m) => m.critical);

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const costPerKm = company?.costPerKm ?? null;
  const personalEstimate =
    costPerKm !== null ? round(general.personalKm * costPerKm) : null;

  const monthName = new Date(general.period.start).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  let text = `Durante o período analisado (${monthName}), a frota percorreu ${general.totalKm.toLocaleString(
    "pt-BR"
  )} km, consumiu ${general.totalLiters.toLocaleString(
    "pt-BR"
  )} litros de combustível e gerou um custo total de ${general.totalSpent.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" }
  )}.`;

  if (topVehicle) {
    text += ` O veículo com maior custo operacional foi o ${topVehicle.vehicle}, responsável por ${topVehicleShare}% das despesas com combustível.`;
  }

  text += ` Foram registrados ${general.personalKm.toLocaleString(
    "pt-BR"
  )} km de uso particular`;

  text +=
    personalEstimate !== null
      ? `, correspondendo a uma estimativa de ${personalEstimate.toLocaleString(
          "pt-BR",
          { style: "currency", currency: "BRL" }
        )} em custos.`
      : " (configure a tarifa por km da empresa para estimar o custo desse uso).";

  if (criticalMaintenances.length > 0) {
    text += ` Além disso, ${criticalMaintenances.length} veículo${
      criticalMaintenances.length > 1 ? "s estão" : " está"
    } próximo${
      criticalMaintenances.length > 1 ? "s" : ""
    } da manutenção preventiva e merece${
      criticalMaintenances.length > 1 ? "m" : ""
    } atenção.`;
  }

  return { period: general.period, text, general, topVehicle, criticalMaintenances };
}

// ---------------------------------------------------------------------
// 10. Saldo de KM (carro particular reembolsado por combustível)
// ---------------------------------------------------------------------
async function getReimbursementBalance(companyId, vehicleId, filters = {}) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  if (!vehicle.reimbursable) {
    throw new Error(
      "Este veículo não está marcado como 'carro particular reembolsável'."
    );
  }

  const { start, end } = buildPeriod(filters.startDate, filters.endDate);

  const [trips, fuelings] = await Promise.all([
    prisma.trip.findMany({
      where: {
        vehicleId: vehicle.id,
        createdAt: { gte: start, lte: end },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.fueling.findMany({
      where: {
        vehicleId: vehicle.id,
        date: { gte: start, lte: end },
        consumptionRate: { not: null },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  const dayKey = (value) => new Date(value).toISOString().slice(0, 10);

  const days = {};

  trips.forEach((t) => {
    const key = dayKey(t.createdAt);
    if (!days[key]) {
      days[key] = { date: key, workKm: 0, personalKm: 0, creditKm: 0 };
    }
    days[key].workKm += Number(t.workKm);
    days[key].personalKm += Number(t.personalKm);
  });

  fuelings.forEach((f) => {
    const key = dayKey(f.date);
    if (!days[key]) {
      days[key] = { date: key, workKm: 0, personalKm: 0, creditKm: 0 };
    }
    days[key].creditKm += Number(f.liters) * Number(f.consumptionRate);

    // Preço/litro e KM/L do abastecimento (usado pra valorar o particular).
    // Se houver mais de um abastecimento no mesmo dia, fica o último.
    days[key].pricePerLiter = Number(f.totalValue) / Number(f.liters);
    days[key].consumptionRate = Number(f.consumptionRate);
  });

  const sortedDays = Object.values(days).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  let runningBalance = 0;

  // Preço/litro e KM/L "vigentes": ficam valendo pros dias seguintes até
  // o próximo abastecimento informar um novo valor.
  let currentPricePerLiter = null;
  let currentConsumptionRate = null;

  const ledger = sortedDays.map((d) => {
    if (d.pricePerLiter !== undefined) {
      currentPricePerLiter = d.pricePerLiter;
      currentConsumptionRate = d.consumptionRate;
    }

    runningBalance = round(runningBalance + d.creditKm - d.personalKm);

    const pricePerKm =
      currentPricePerLiter && currentConsumptionRate
        ? Number((currentPricePerLiter / currentConsumptionRate).toFixed(4))
        : null;

    const personalValue =
      pricePerKm !== null ? round(pricePerKm * d.personalKm) : null;

    return {
      date: d.date,
      workKm: round(d.workKm),
      personalKm: round(d.personalKm),
      creditKm: round(d.creditKm),
      balance: runningBalance,
      pricePerKm,
      personalValue,
    };
  });

  return {
    period: { start, end },
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
    },
    totalWorkKm: round(sortedDays.reduce((s, d) => s + d.workKm, 0)),
    totalPersonalKm: round(sortedDays.reduce((s, d) => s + d.personalKm, 0)),
    totalCreditKm: round(sortedDays.reduce((s, d) => s + d.creditKm, 0)),
    totalPersonalValue: round(
      ledger.reduce((s, d) => s + (d.personalValue || 0), 0)
    ),
    finalBalance: ledger.length ? ledger[ledger.length - 1].balance : 0,
    ledger,
  };
}

// ---------------------------------------------------------------------
// Alertas de saldo negativo (uso em notificações)
// ---------------------------------------------------------------------
async function getNegativeBalanceAlerts(companyId) {
  const vehicles = await prisma.vehicle.findMany({
    where: { companyId, reimbursable: true },
  });

  const alerts = [];

  for (const vehicle of vehicles) {
    const [trips, fuelings] = await Promise.all([
      prisma.trip.findMany({ where: { vehicleId: vehicle.id } }),
      prisma.fueling.findMany({
        where: { vehicleId: vehicle.id, consumptionRate: { not: null } },
      }),
    ]);

    const totalPersonal = trips.reduce((s, t) => s + Number(t.personalKm), 0);
    const totalCredit = fuelings.reduce(
      (s, f) => s + Number(f.liters) * Number(f.consumptionRate),
      0
    );
    const balance = round(totalCredit - totalPersonal);

    if (balance < 0) {
      alerts.push({
        vehicle: `${vehicle.model} - ${vehicle.plate}`,
        vehicleId: vehicle.id,
        balance,
      });
    }
  }

  return alerts;
}

module.exports = {
  getGeneralReport,
  getVehicleReport,
  getTechnicianReport,
  getFinancialReport,
  getPersonalUsageReport,
  getMaintenanceReport,
  getExpenseRanking,
  getConsumptionReport,
  getExecutiveSummary,
  getReimbursementBalance,
  getNegativeBalanceAlerts,
};
