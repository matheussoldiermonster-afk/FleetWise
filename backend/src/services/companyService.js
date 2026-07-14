const prisma = require("../config/prisma");

async function createCompany(data) {
  const company = await prisma.company.create({
    data: {
      name: data.name,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
    },
  });

  return company;
}

module.exports = {
  createCompany,
};