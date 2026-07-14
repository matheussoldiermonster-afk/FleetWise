const prisma = require("../config/prisma");

async function getDashboard() {
  const companies = await prisma.company.count();
  const technicians = await prisma.technician.count();
  const vehicles = await prisma.vehicle.count();
  const fuelings = await prisma.fueling.count();

  const totalSpent = await prisma.fueling.aggregate({
    _sum: {
      price: true,
    },
  });

  return {
    companies,
    technicians,
    vehicles,
    fuelings,
    totalSpent: totalSpent._sum.price || 0,
  };
}

module.exports = {
  getDashboard,
};