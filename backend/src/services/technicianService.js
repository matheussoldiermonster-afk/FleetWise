const prisma = require("../config/prisma");

async function createTechnician(data) {
  return prisma.technician.create({
    data: {
      name: data.name,
      phone: data.phone,
      role: data.role,
      companyId: Number(data.companyId),
    },
  });
}

async function getTechnicians(companyId) {
  return prisma.technician.findMany({
    where: {
      companyId,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function getTechnicianById(id) {
  return prisma.technician.findUnique({
    where: {
      id,
    },
  });
}

async function updateTechnician(id, companyId, data) {
  const technician = await prisma.technician.findUnique({
    where: {
      id,
    },
  });

  if (!technician || technician.companyId !== companyId) {
    throw new Error("Técnico não encontrado.");
  }

  return prisma.technician.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      phone: data.phone,
      role: data.role,
    },
  });
}

async function deleteTechnician(id, companyId) {
  const technician = await prisma.technician.findUnique({
    where: {
      id,
    },
  });

  if (!technician || technician.companyId !== companyId) {
    throw new Error("Técnico não encontrado.");
  }

  try {
    return await prisma.technician.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error.code === "P2003") {
      throw new Error(
        "Não é possível excluir este técnico: existem viagens ou manutenções vinculadas a ele."
      );
    }

    throw error;
  }
}

module.exports = {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
};