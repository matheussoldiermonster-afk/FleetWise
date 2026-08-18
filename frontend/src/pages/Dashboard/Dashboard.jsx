import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import BarChartDashboard from "../../components/charts/BarChartDashboard";
import api from "../../services/api";
import LineChartDashboard from "../../components/dashboard/LineChartDashboard";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import AlertCard from "../../components/dashboard/AlertCard";
import PieChartDashboard from "../../components/dashboard/PieChartDashboard";
import RecentActivity from "../../components/dashboard/RecentActivity";

function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    technicians: 0,
    fuelings: 0,
    totalSpent: 0,
    totalLiters: 0,
    totalKm: 0,
    chart: [],
    pieData: [],
    monthlyExpenses: [],
    trends: {
      vehicles: 0,
      technicians: 0,
      fuelings: 0,
      totalSpent: 0,
      totalLiters: 0,
      totalKm: 0,
    },
    alerts: [],
    activities: [],
  });

  async function loadStats() {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      title: "Veículos",
      value: stats.vehicles,
      icon: "🚗",
      color: "#16A34A",
      trend: stats.trends.vehicles,
    },
    {
      title: "Técnicos",
      value: stats.technicians,
      icon: "👷",
      color: "#2563EB",
      trend: stats.trends.technicians,
    },
    {
      title: "Abastecimentos",
      value: stats.fuelings,
      icon: "⛽",
      color: "#F97316",
      trend: stats.trends.fuelings,
    },
    {
      title: "Gasto Total",
      value: `R$ ${Number(stats.totalSpent).toFixed(2)}`,
      icon: "💰",
      color: "#DC2626",
      trend: stats.trends.totalSpent,
    },
    {
      title: "Litros",
      value: Number(stats.totalLiters).toFixed(2),
      icon: "🛢️",
      color: "#7C3AED",
      trend: stats.trends.totalLiters,
    },
    {
      title: "KM Rodados",
      value: Number(stats.totalKm).toFixed(2),
      icon: "🛣️",
      color: "#0891B2",
      trend: stats.trends.totalKm,
    },
  ];

return (
  <MainLayout>
    <Box mb={4}>
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>

      <Typography color="text.secondary">
        Visão geral da frota
      </Typography>
    </Box>

    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, lg: 4 }}
        >
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
          />
        </Grid>
      ))}
    </Grid>

    <DashboardGrid
  left={
    <LineChartDashboard
      title="📈 Gastos Mensais"
      data={stats.monthlyExpenses}
    />
  }
  right={
    <AlertCard alerts={stats.alerts} />
  }
/>

<DashboardGrid
  left={
    <PieChartDashboard
      data={stats.pieData}
    />
  }
  right={
    <RecentActivity
      activities={stats.activities}
    />
  }
/>

<Paper
  elevation={2}
  sx={{
    mt: 3,
    p: 3,
    borderRadius: 4,
  }}
>
  <BarChartDashboard
    title="🚗 Gastos por Veículo"
    data={stats.chart}
    dataKey="valor"
    color="#16A34A"
  />
</Paper>
  </MainLayout>
);
}

export default Dashboard;