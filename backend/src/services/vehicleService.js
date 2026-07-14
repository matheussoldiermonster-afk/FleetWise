const prisma = require("../config/prisma");

async function createVehicle(data) {
  return prisma.vehicle.create({
    data: {
      brand: data.brand,
      model: data.model,
      year: data.year,
      plate: data.plate.toUpperCase(),
      fuelType: data.fuelType,
      averageConsumption: data.averageConsumption,
      currentKm: data.currentKm,
      companyId: data.companyId,
    },
  });
}

async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: {
      id: "desc",
    },
  });
}

module.exports = {
  createVehicle,
  getVehicles,
};