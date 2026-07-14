import "./Login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-card">

        <h1>FleetWise</h1>

        <p>Gestão Inteligente de Frotas</p>

        <form>

          <input
            type="email"
            placeholder="E-mail"
          />

          <input
            type="password"
            placeholder="Senha"
          />

          <button>
            Entrar
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;