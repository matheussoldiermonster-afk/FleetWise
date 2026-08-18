import { Card, CardContent, Typography, Grid, Box, CircularProgress } from "@mui/material";

import StatBox from "../StatBox";
import ExportButtons from "../ExportButtons";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function GeneralTab({ report, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return <Typography color="text.secondary">Nenhum dado encontrado.</Typography>;
  }

  const summary = [
    { label: "Veículos cadastrados", value: report.vehiclesCount },
    { label: "Técnicos cadastrados", value: report.techniciansCount },
    { label: "Abastecimentos", value: report.fuelingsCount },
    { label: "Viagens", value: report.tripsCount },
    { label: "Total abastecido (L)", value: report.totalLiters },
    { label: "Valor gasto", value: formatCurrency(report.totalSpent) },
    { label: "KM rodados", value: report.totalKm },
    { label: "KM Trabalho", value: report.workKm },
    { label: "KM Particular", value: report.personalKm },
    {
      label: "Consumo médio (km/L)",
      value: report.averageConsumption ?? "Sem dados",
    },
  ];

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Relatório Geral da Frota
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Período: {formatDate(report.period.start)} até {formatDate(report.period.end)}
        </Typography>

        <ExportButtons
          title="Relatorio Geral da Frota"
          subtitle={`Periodo: ${formatDate(report.period.start)} ate ${formatDate(report.period.end)}`}
          summary={summary}
        />

        <Grid container spacing={2}>
          {summary.map((item) => (
            <Grid key={item.label} size={{ xs: 6, sm: 4, md: 3 }}>
              <StatBox label={item.label} value={item.value} highlight={item.label === "Valor gasto"} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default GeneralTab;
