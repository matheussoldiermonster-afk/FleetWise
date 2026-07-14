const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

async function createUser(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      companyId: data.companyId
    }
  });
}

module.exports = {
  createUser
};