import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Futuramente vamos conectar isso à API
      // Exemplo:
      //
      // await api.post("/auth/reset-password", {
      //   token,
      //   password,
      // });

      console.log("Token:", token);
      console.log("Nova senha:", password);

      setSuccess("Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Não foi possível redefinir a senha.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Redefinir senha
        </h2>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Digite sua nova senha abaixo.
        </p>

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#c62828",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#e5f7e5",
              color: "#2e7d32",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Nova senha</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Confirmar nova senha</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente sua senha"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              background: "#1976d2",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Redefinir senha
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            border: "none",
            background: "transparent",
            color: "#1976d2",
            cursor: "pointer",
          }}
        >
          Voltar para o login
        </button>
      </div>
    </div>
  );
}