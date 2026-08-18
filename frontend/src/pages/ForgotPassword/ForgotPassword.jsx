import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      /*
       * FUTURA CONEXÃO COM A API
       *
       * const response = await api.post("/auth/forgot-password", {
       *   email,
       * });
       */

      // Temporário enquanto a API ainda não está pronta
      console.log("Solicitação de recuperação para:", email);

      setSuccess(
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
      );

      setEmail("");
    } catch (err) {
      setError(
        "Não foi possível solicitar a recuperação da senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Esqueci minha senha
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Informe o e-mail cadastrado para receber as instruções de recuperação
          da sua senha.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.3,
              fontWeight: "bold",
            }}
          >
            {loading ? "Enviando..." : "Enviar instruções"}
          </Button>
        </Box>

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Voltar para o login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}