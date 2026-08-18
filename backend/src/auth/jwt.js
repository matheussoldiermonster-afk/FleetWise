const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error(
    "JWT_SECRET não definido no .env. Defina essa variável antes de iniciar o servidor."
  );
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      companyId: user.companyId,
      email: user.email,
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};