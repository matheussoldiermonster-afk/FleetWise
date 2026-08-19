/**
 * Arquivo único com as 3 camadas de segurança do backend:
 *   1. CORS restrito ao domínio do frontend
 *   2. Rate limiting (protege login/reset contra força bruta)
 *   3. Validação de entrada com zod (protege TODAS as rotas de
 *      criação/edição contra dados malformados antes de chegarem no banco)
 */

const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

// ---------------------------------------------------------------------
// 1. CORS
// ---------------------------------------------------------------------
// Em produção, defina FRONTEND_URL no .env com a URL real do frontend
// (ex: https://app.suaempresa.com). Sem essa variável, cai no padrão
// do Vite em desenvolvimento (localhost:5173/5174).
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requisições sem "origin" (ex: Postman, curl, apps mobile) são
    // permitidas — a restrição de CORS é uma proteção de navegador.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origem não permitida por CORS."));
  },
};

const corsMiddleware = cors(corsOptions);

// ---------------------------------------------------------------------
// 2. Rate limiting
// ---------------------------------------------------------------------
// Limite rígido para login/esqueci-senha: evita tentativas ilimitadas
// de adivinhar senha ou "spammar" e-mails de redefinição.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  },
});

// Limite geral, mais folgado, pra API como um todo.
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas requisições. Aguarde um momento e tente novamente.",
  },
});

// ---------------------------------------------------------------------
// 3. Validação de entrada (zod)
// ---------------------------------------------------------------------
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.errors[0];

      return res.status(400).json({
        message: firstError?.message || "Dados inválidos.",
      });
    }

    // Substitui req.body pelos dados já validados/normalizados.
    req.body = result.data;
    next();
  };
}

const schemas = {
  login: z.object({
    email: z.string().trim().email("E-mail inválido."),
    password: z.string().min(1, "Senha é obrigatória."),
  }),

  register: z.object({
    name: z.string().trim().min(2, "Nome é obrigatório."),
    email: z.string().trim().email("E-mail inválido."),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  }),

  forgotPassword: z.object({
    email: z.string().trim().email("E-mail inválido."),
  }),

  resetPassword: z.object({
    token: z.string().min(1, "Token é obrigatório."),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  }),

  createCompany: z.object({
    name: z.string().trim().min(2, "Nome da empresa é obrigatório."),
    cnpj: z.string().trim().optional().nullable(),
    email: z.string().trim().email("E-mail da empresa inválido.").optional().nullable(),
    phone: z.string().trim().optional().nullable(),
    ownerName: z.string().trim().min(2, "Nome do responsável é obrigatório."),
    ownerEmail: z.string().trim().email("E-mail do responsável inválido."),
    ownerPassword: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  }),

  vehicle: z
    .object({
      brand: z.string().trim().min(1, "Marca é obrigatória."),
      model: z.string().trim().min(1, "Modelo é obrigatório."),
      year: z.coerce.number().int().min(1900, "Ano inválido.").max(2100, "Ano inválido."),
      plate: z.string().trim().min(1, "Placa é obrigatória."),
      fuelType: z.enum(["GASOLINE", "ETHANOL", "DIESEL", "FLEX", "ELECTRIC"], {
        errorMap: () => ({ message: "Tipo de combustível inválido." }),
      }),
      averageConsumption: z.coerce.number().positive("Consumo médio precisa ser maior que zero."),
      currentKm: z.coerce.number().min(0, "KM atual não pode ser negativo."),
      reimbursable: z.boolean().optional(),
    })
    .passthrough(),

  technician: z
    .object({
      name: z.string().trim().min(1, "Nome é obrigatório."),
      phone: z.string().trim().optional().nullable(),
      role: z.string().trim().optional().nullable(),
    })
    .passthrough(),

  trip: z
    .object({
      vehicleId: z.coerce.number().int().positive("Selecione um veículo."),
      technicianId: z.coerce.number().int().positive("Selecione um técnico."),
      startKm: z.coerce.number().min(0, "KM Inicial é obrigatório."),
      endKm: z.coerce.number().min(0, "KM Final é obrigatório."),
      breakStartKm: z.coerce.number().min(0).optional(),
      breakEndKm: z.coerce.number().min(0).optional(),
      initialTime: z.string().optional().nullable(),
      breakStartTime: z.string().optional().nullable(),
      breakEndTime: z.string().optional().nullable(),
      finalTime: z.string().optional().nullable(),
      client: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      purpose: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
    })
    .passthrough(),

  fueling: z
    .object({
      vehicleId: z.coerce.number().int().positive("Selecione um veículo."),
      date: z.string().min(1, "Data é obrigatória."),
      odometer: z.coerce.number().min(0, "Hodômetro inválido."),
      liters: z.coerce.number().positive("Litros precisa ser maior que zero."),
      totalValue: z.coerce.number().positive("Valor precisa ser maior que zero."),
      fuelType: z.enum(["GASOLINE", "ETHANOL", "DIESEL", "FLEX", "ELECTRIC"], {
        errorMap: () => ({ message: "Tipo de combustível inválido." }),
      }),
      gasStation: z.string().optional().nullable(),
      responsible: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
      consumptionRate: z.coerce.number().positive().optional().nullable(),
    })
    .passthrough(),

  maintenance: z
    .object({
      vehicleId: z.coerce.number().int().positive("Selecione um veículo."),
      type: z.string().min(1, "Tipo de manutenção é obrigatório."),
      currentKm: z.coerce.number().min(0, "KM atual inválido."),
      nextKm: z.coerce.number().min(0, "KM da próxima manutenção inválido."),
      description: z.string().optional().nullable(),
    })
    .passthrough(),
};

module.exports = {
  corsMiddleware,
  authRateLimiter,
  generalRateLimiter,
  validate,
  schemas,
};
