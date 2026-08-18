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

async function getOwnedMaintenance(id, companyId) {
  const maintenance = await prisma.maintenance.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true },
  });

  if (!maintenance || maintenance.vehicle.companyId !== companyId) {
    throw new Error("Manutenção não encontrada.");
  }

  return maintenance;
}

async function createMaintenance(data, companyId) {
  await assertVehicleBelongsToCompany(data.vehicleId, companyId);

  return prisma.maintenance.create({
    data: {
      type: data.type,
      currentKm: Number(data.currentKm),
      nextKm: Number(data.nextKm),
      description: data.description,
      vehicleId: Number(data.vehicleId),
    },
    include: {
      vehicle: true,
    },
  });
}

async function getMaintenances(companyId) {
  return prisma.maintenance.findMany({
    where: {
      vehicle: {
        companyId,
      },
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      performedAt: "desc",
    },
  });
}

async function getMaintenanceById(id, companyId) {
  return getOwnedMaintenance(id, companyId);
}

async function updateMaintenance(id, data, companyId) {
  await getOwnedMaintenance(id, companyId);
  await assertVehicleBelongsToCompany(data.vehicleId, companyId);

  return prisma.maintenance.update({
    where: {
      id: Number(id),
    },
    data: {
      type: data.type,
      currentKm: Number(data.currentKm),
      nextKm: Number(data.nextKm),
      description: data.description,
      vehicleId: Number(data.vehicleId),
    },
  });
}

async function deleteMaintenance(id, companyId) {
  await getOwnedMaintenance(id, companyId);

  return prisma.maintenance.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  createMaintenance,
  getMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};
