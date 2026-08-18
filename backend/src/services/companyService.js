const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("../auth/jwt");

async function createCompany(data) {
  if (!data.ownerName || !data.ownerEmail || !data.ownerPassword) {
    throw new Error(
      "Informe nome, e-mail e senha do usuário responsável pela empresa."
    );
  }

  const emailInUse = await prisma.user.findUnique({
    where: { email: data.ownerEmail },
  });

  if (emailInUse) {
    throw new Error("E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(data.ownerPassword, 10);

  const { company, user } = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
      },
    });

    const user = await tx.user.create({
      data: {
        name: data.ownerName,
        email: data.ownerEmail,
        password: passwordHash,
        companyId: company.id,
      },
    });

    return { company, user };
  });

  const token = jwt.generateToken(user);

  return {
    company,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
    },
    token,
  };
}

async function getCompanyById(id) {
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    throw new Error("Empresa não encontrada.");
  }

  return company;
}

async function updateSettings(id, data) {
  return prisma.company.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.cnpj !== undefined && { cnpj: data.cnpj }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.costPerKm !== undefined && {
        costPerKm:
          data.costPerKm === null ? null : Number(data.costPerKm),
      }),
    },
  });
}

module.exports = {
  createCompany,
  getCompanyById,
  updateSettings,
};