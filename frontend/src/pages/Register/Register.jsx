import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { useSnackbar } from "notistack";

import Button from "../../components/ui/Button";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function formatCpf(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCnpj(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function Register() {
  const { loginWithToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [personType, setPersonType] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    document: "", // CPF ou CNPJ, dependendo do personType
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleDocumentChange(e) {
    const formatted =
      personType === "INDIVIDUAL"
        ? formatCpf(e.target.value)
        : formatCnpj(e.target.value);

    setForm({ ...form, document: formatted });
  }

  function handlePersonTypeChange(e, value) {
    if (!value) return;
    setPersonType(value);
    setForm({ ...form, document: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        personType,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        ownerPassword: form.ownerPassword,
        ...(personType === "INDIVIDUAL"
          ? { cpf: form.document }
          : { name: form.name, cnpj: form.document }),
      };

      const response = await api.post("/companies", payload);

      const { token, user } = response.data;
      loginWithToken(token, user);

      enqueueSnackbar("Conta criada com sucesso! Bem-vindo ao FleetWise.", {
        variant: "success",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao criar conta.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #F8FAFC 0%, #DCFCE7 100%)",
        p: 2,
      }}
    >
      <Card elevation={6} sx={{ width: "100%", maxWidth: 460, borderRadius: 5, my: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "primary.main",
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <DirectionsCarIcon fontSize="large" />
            </Box>

            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Criar conta no FleetWise
            </Typography>

            <Typography color="text.secondary" mt={0.5} textAlign="center">
              Gerencie sua frota em minutos.
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={personType}
            exclusive
            onChange={handlePersonTypeChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="INDIVIDUAL">
              <PersonIcon sx={{ mr: 1 }} fontSize="small" />
              Pessoa Física
            </ToggleButton>
            <ToggleButton value="COMPANY">
              <BusinessIcon sx={{ mr: 1 }} fontSize="small" />
              Pessoa Jurídica
            </ToggleButton>
          </ToggleButtonGroup>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {personType === "COMPANY" && (
              <TextField
                fullWidth
                label="Nome da empresa (Razão Social)"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <TextField
              fullWidth
              label={personType === "INDIVIDUAL" ? "CPF" : "CNPJ"}
              value={form.document}
              onChange={handleDocumentChange}
              required
              placeholder={
                personType === "INDIVIDUAL" ? "000.000.000-00" : "00.000.000/0000-00"
              }
            />

            <TextField
              fullWidth
              label={personType === "INDIVIDUAL" ? "Seu nome completo" : "Nome do responsável"}
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              type="email"
              label="E-mail"
              name="ownerEmail"
              value={form.ownerEmail}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📧</InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Senha"
              name="ownerPassword"
              value={form.ownerPassword}
              onChange={handleChange}
              required
              helperText="Pelo menos 6 caracteres"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🔒</InputAdornment>
                ),
              }}
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </Box>

          <Typography textAlign="center" mt={3}>
            Já tem conta?{" "}
            <Link component={RouterLink} to="/login">
              Entrar
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
