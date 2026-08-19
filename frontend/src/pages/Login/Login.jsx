import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Link,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useSnackbar } from "notistack";

import Button from "../../components/ui/Button";

// Foto real de frota (Unsplash, uso livre) — se preferir, troque essa URL
// por uma imagem própria da empresa hospedada em /public.
const COVER_IMAGE_URL =
  "https://images.unsplash.com/photo-1578894513086-5a61a815a341?auto=format&fit=crop&w=1600&q=80";

function Login() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await login(form.email, form.password);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      enqueueSnackbar(
        error.response?.data?.message || "Erro ao realizar login.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Capa de fundo — só aparece em telas médias/grandes */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          position: "relative",
          backgroundImage: `url(${COVER_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          alignItems: "flex-end",
          p: 6,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.85) 100%)",
          }}
        />

        <Box sx={{ position: "relative", color: "#FFF" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DirectionsCarIcon />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              FleetWise
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" maxWidth={480}>
            Sua frota, sob controle total.
          </Typography>

          <Typography color="rgba(255,255,255,0.8)" mt={1.5} maxWidth={440}>
            Veículos, abastecimentos, viagens e manutenções em um só lugar —
            com relatórios que mostram exatamente pra onde vai o dinheiro da
            sua frota.
          </Typography>
        </Box>
      </Box>

      {/* Formulário */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 460px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 360 }}>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
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

            <Typography variant="h4" fontWeight="bold">
              FleetWise
            </Typography>
          </Box>

          <Typography variant="h5" 
          fontWeight="bold">
            Bem-vindo de volta
          </Typography>

          <Typography color="text.secondary" mt={0.5} mb={4}>
            Entre para gerenciar sua frota
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              fullWidth
              type="email"
              name="email"
              label="E-mail"
              value={form.email}
              onChange={handleChange}
              required
              ImputLabelProps={{
                sx:{
                  fontWeight: 700,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📧</InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              name="password"
              label="Senha"
              value={form.password}
              onChange={handleChange}
              required
              ImputLabelProps={{
                sx:{
                  fontWeight: 700,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">🔒</InputAdornment>
                ),
              }}
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Typography textAlign="center">
              <Link component={RouterLink} to="/forgot-password">
                Esqueceu sua senha?
              </Link>
            </Typography>

            <Typography textAlign="center">
              Não tem conta?{" "}
              <Link component={RouterLink} to="/register">
                Criar conta
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
