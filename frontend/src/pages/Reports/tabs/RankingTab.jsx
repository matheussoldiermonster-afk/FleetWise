import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import ExportButtons from "../ExportButtons";

const MEDALS = ["🥇", "🥈", "🥉"];

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function RankingTab({ report, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report || report.ranking.length === 0) {
    return <Typography color="text.secondary">Nenhum dado encontrado.</Typography>;
  }

  const table = {
    columns: ["Posição", "Veículo", "Total gasto (R$)"],
    rows: report.ranking.map((r, i) => [i + 1, r.vehicle, r.total]),
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          🏆 Ranking de Gastos
        </Typography>

        <ExportButtons title="Ranking de Gastos" table={table} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Posição</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell align="right">Total gasto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.ranking.map((item, index) => (
              <TableRow key={item.vehicle}>
                <TableCell>{MEDALS[index] || index + 1}</TableCell>
                <TableCell>{item.vehicle}</TableCell>
                <TableCell align="right">{formatCurrency(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default RankingTab;
