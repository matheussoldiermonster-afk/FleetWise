const prisma = require("../config/prisma");

async function createVehicle(data) {
  return prisma.vehicle.create({
    data: {
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      plate: data.plate.toUpperCase(),
      fuelType: data.fuelType,
      averageConsumption: Number(data.averageConsumption),
      currentKm: Number(data.currentKm),
      companyId: Number(data.companyId),
      reimbursable: Boolean(data.reimbursable),
    },
  });
}

async function getVehicles(companyId) {
  return prisma.vehicle.findMany({
    where: {
      companyId,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function getVehicleById(id, companyId) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id,
    },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    return null;
  }

  return vehicle;
}

async function updateVehicle(id, companyId, data) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id,
    },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  return prisma.vehicle.update({
    where: {
      id,
    },
    data: {
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      plate: data.plate.toUpperCase(),
      fuelType: data.fuelType,
      averageConsumption: Number(data.averageConsumption),
      currentKm: Number(data.currentKm),
      reimbursable: Boolean(data.reimbursable),
    },
  });
}

async function deleteVehicle(id, companyId) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id,
    },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  try {
    return await prisma.vehicle.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error.code === "P2003") {
      throw new Error(
        "Não é possível excluir este veículo: existem abastecimentos, viagens ou manutenções vinculadas a ele."
      );
    }

    throw error;
  }
}

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};