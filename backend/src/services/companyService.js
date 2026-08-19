const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("../auth/jwt");
const { onlyDigits, isValidCPF, isValidCNPJ } = require("../utils/documentValidators");

async function createCompany(data) {
  if (!data.ownerName || !data.ownerEmail || !data.ownerPassword) {
    throw new Error(
      "Informe nome, e-mail e senha do usuário responsável."
    );
  }

  const personType = data.personType === "INDIVIDUAL" ? "INDIVIDUAL" : "COMPANY";

  let cpf = null;
  let cnpj = null;
  let name = data.name;

  if (personType === "INDIVIDUAL") {
    if (!isValidCPF(data.cpf)) {
      throw new Error("CPF inválido.");
    }

    cpf = onlyDigits(data.cpf);
    // Pessoa física não precisa digitar "razão social" — usa o próprio nome.
    name = name || data.ownerName;

    const cpfInUse = await prisma.company.findUnique({ where: { cpf } });
    if (cpfInUse) {
      throw new Error("Já existe uma conta cadastrada com esse CPF.");
    }
  } else {
    if (!name) {
      throw new Error("Informe o nome/razão social da empresa.");
    }

    if (!isValidCNPJ(data.cnpj)) {
      throw new Error("CNPJ inválido.");
    }

    cnpj = onlyDigits(data.cnpj);

    const cnpjInUse = await prisma.company.findUnique({ where: { cnpj } });
    if (cnpjInUse) {
      throw new Error("Já existe uma empresa cadastrada com esse CNPJ.");
    }
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
        name,
        personType,
        cpf,
        cnpj,
        email: data.email || null,
        phone: data.phone || null,
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