const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendPasswordResetEmail(to, resetLink) {
  if (!isEmailConfigured()) {
    // Modo desenvolvimento: sem SMTP configurado no .env, não dá pra
    // enviar e-mail de verdade. Para não travar o fluxo, o link é
    // apenas exibido no console do servidor.
    console.log("\n===== E-MAIL DE RECUPERAÇÃO DE SENHA (modo dev) =====");
    console.log(`Para: ${to}`);
    console.log(`Link: ${resetLink}`);
    console.log(
      "Configure SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS no .env para enviar e-mails de verdade."
    );
    console.log("======================================================\n");
    return;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Redefinição de senha - FleetWise",
    html: `
      <p>Você solicitou a redefinição da sua senha no FleetWise.</p>
      <p><a href="${resetLink}">Clique aqui para criar uma nova senha</a></p>
      <p>Esse link expira em 1 hora. Se você não pediu isso, pode ignorar este e-mail.</p>
    `,
  });
}

module.exports = {
  sendPasswordResetEmail,
};
