const prisma = require("../config/prisma");

async function createFueling(data) {

  const pricePerLiter = data.totalPrice / data.liters;

  return prisma.fueling.create({
    data: {
      liters: data.liters,
      totalPrice: data.totalPrice,
      pricePerLiter,
      odometer: data.odometer,
      usageType: data.usageType,
      notes: data.notes,
      technicianId: data.technicianId,
      vehicleId: data.vehicleId,
    },
  });

}

module.exports = {
  createFueling,
};