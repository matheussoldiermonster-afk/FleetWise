import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/cards/StatCard";

function Dashboard() {
  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: "30px",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <StatCard
          title="Veículos"
          value="12"
          color="#2563EB"
        />

        <StatCard
          title="Técnicos"
          value="8"
          color="#22C55E"
        />

        <StatCard
          title="Abastecimentos"
          value="164"
          color="#F97316"
        />

        <StatCard
          title="Gasto do Mês"
          value="R$ 12.420"
          color="#EF4444"
        />
      </div>
    </MainLayout>
  );
}

export default Dashboard;