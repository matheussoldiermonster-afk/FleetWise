import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">FleetWise</h2>

      <nav>
  <Link to="/dashboard">📊 Dashboard</Link>

  <Link to="/vehicles">🚗 Veículos</Link>

  <Link to="/technicians">👷 Técnicos</Link>

  <Link to="/fuelings">⛽ Abastecimentos</Link>

  <Link to="/companies">🏢 Empresas</Link>

  <Link to="/reports">📈 Relatórios</Link>
</nav>
    </aside>
  );
}

export default Sidebar;