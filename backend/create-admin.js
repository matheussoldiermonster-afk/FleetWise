const prisma = require("./src/config/prisma");
const bcrypt = require("bcrypt");

async function main() {
  const password = 123456;

  const passwordHash = await bcrypt.hash(password, 10);

  const company = await prisma.company.create({
    data: {
      name: "FleetWise Demo",
      email: "matt@fleetwise.com",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Matheus",
      email: "matt@fleetwise.com",
      password: passwordHash,
      companyId: company.id,
    },
  });

  console.log("Empresa criada:", company.id);
  console.log("Usuário criado:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());