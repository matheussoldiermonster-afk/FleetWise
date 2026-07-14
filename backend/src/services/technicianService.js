const prisma = require("../config/prisma");

async function createTechnician(data) {
  return prisma.technician.create({
    data: {
      name: data.name,
      phone: data.phone,
      role: data.role,
      companyId: data.companyId
    }
  });
}

module.exports = {
  createTechnician
};