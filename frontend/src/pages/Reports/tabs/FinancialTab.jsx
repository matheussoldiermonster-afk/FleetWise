import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import StatBox from "../StatBox";
import ExportButtons from "../ExportButtons";

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function FinancialTab({ report, loading }) {
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

  const maxMonthly = Math.max(1, ...report.monthlyChart.map((m) => m.value));

  const summary = report.breakdown.map((b) => ({
    label: b.type,
    value: formatCurrency(b.value),
  }));
  summary.push({ label: "Total", value: formatCurrency(report.totalSpent) });

  const table = {
    columns: ["Combustível", "Valor gasto (R$)"],
    rows: report.breakdown.map((b) => [b.type, b.value]),
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          💰 Relatório Financeiro
        </Typography>

        <ExportButtons title="Relatorio Financeiro" summary={summary} table={table} />

        <Grid container spacing={2} mb={3}>
          {report.breakdown.map((item) => (
            <Grid key={item.type} size={{ xs: 6, sm: 3 }}>
              <StatBox label={item.type} value={formatCurrency(item.value)} />
            </Grid>
          ))}
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatBox label="Total" value={formatCurrency(report.totalSpent)} highlight />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Gastos nos últimos 6 meses
        </Typography>

        <Box display="flex" alignItems="flex-end" gap={2} height={140} px={1}>
          {report.monthlyChart.map((m) => (
            <Box key={m.month} display="flex" flexDirection="column" alignItems="center" flex={1}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 40,
                  height: `${(m.value / maxMonthly) * 100}px`,
                  backgroundColor: "primary.main",
                  borderRadius: "6px 6px 0 0",
                  minHeight: 4,
                }}
              />
              <Typography variant="caption" color="text.secondary" mt={0.5}>
                {m.month}
              </Typography>
            </Box>
          ))}
        </Box>

        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Combustível</TableCell>
              <TableCell align="right">Valor gasto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.breakdown.map((b) => (
              <TableRow key={b.type}>
                <TableCell>{b.type}</TableCell>
                <TableCell align="right">{formatCurrency(b.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default FinancialTab;
