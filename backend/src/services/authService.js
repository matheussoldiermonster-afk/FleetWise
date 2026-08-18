const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("../auth/jwt");
const emailService = require("./emailService");

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function register(data, companyId) {
  const userExists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userExists) {
    throw new Error("E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      companyId,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function login(data) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const token = jwt.generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
    },
    token,
  };
}

async function requestPasswordReset(email, appUrl) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Resposta sempre genérica, mesmo se o e-mail não existir —
  // evita que alguém descubra quais e-mails estão cadastrados.
  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashToken(rawToken),
      resetTokenExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

  await emailService.sendPasswordResetEmail(user.email, resetLink);
}

async function resetPassword(rawToken, newPassword) {
  const hashedToken = hashToken(rawToken);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Link de redefinição inválido ou expirado.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
}

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
};