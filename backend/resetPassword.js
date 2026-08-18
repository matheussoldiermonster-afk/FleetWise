const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

async function main() {
  const hash = await bcrypt.hash("123456", 10);

  await prisma.user.update({
    where: {
      email: "seuemail@email.com",
    },
    data: {
      password: hash,
    },
  });

  console.log("Senha alterada com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());