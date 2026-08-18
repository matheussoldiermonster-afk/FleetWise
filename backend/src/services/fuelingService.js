const prisma = require("../config/prisma");

async function assertVehicleBelongsToCompany(vehicleId, companyId) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  return vehicle;
}

async function getOwnedFueling(id, companyId) {
  const fueling = await prisma.fueling.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true },
  });

  if (!fueling || fueling.vehicle.companyId !== companyId) {
    throw new Error("Abastecimento não encontrado.");
  }

  return fueling;
}

async function createFueling(data, companyId) {
  await assertVehicleBelongsToCompany(data.vehicleId, companyId);

  const fueling = await prisma.fueling.create({
    data: {
      vehicleId: Number(data.vehicleId),
      date: new Date(data.date),
      odometer: Number(data.odometer),
      liters: Number(data.liters),
      totalValue: Number(data.totalValue),
      fuelType: data.fuelType,
      gasStation: data.gasStation,
      responsible: data.responsible,
      notes: data.notes,
      consumptionRate:
        data.consumptionRate !== undefined && data.consumptionRate !== null
          ? Number(data.consumptionRate)
          : null,
    },
  });

  await prisma.vehicle.update({
    where: {
      id: Number(data.vehicleId),
    },
    data: {
      currentKm: Number(data.odometer),
    },
  });

  return fueling;
}

async function getFuelings(companyId) {
  return prisma.fueling.findMany({
    where: {
      vehicle: { companyId },
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

async function getFuelingById(id, companyId) {
  return getOwnedFueling(id, companyId);
}

async function updateFueling(id, data, companyId) {
  await getOwnedFueling(id, companyId);
  await assertVehicleBelongsToCompany(data.vehicleId, companyId);

  const fueling = await prisma.fueling.update({
    where: {
      id: Number(id),
    },
    data: {
      vehicleId: Number(data.vehicleId),
      date: new Date(data.date),
      odometer: Number(data.odometer),
      liters: Number(data.liters),
      totalValue: Number(data.totalValue),
      fuelType: data.fuelType,
      gasStation: data.gasStation,
      responsible: data.responsible,
      notes: data.notes,
      consumptionRate:
        data.consumptionRate !== undefined && data.consumptionRate !== null
          ? Number(data.consumptionRate)
          : null,
    },
  });

  await prisma.vehicle.update({
    where: {
      id: Number(data.vehicleId),
    },
    data: {
      currentKm: Number(data.odometer),
    },
  });

  return fueling;
}

async function deleteFueling(id, companyId) {
  await getOwnedFueling(id, companyId);

  return prisma.fueling.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  createFueling,
  getFuelings,
  getFuelingById,
  updateFueling,
  deleteFueling,
};
