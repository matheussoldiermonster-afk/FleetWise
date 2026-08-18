import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import ExportButtons from "../ExportButtons";

function ConsumptionTab({ report, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report || report.results.length === 0) {
    return (
      <Typography color="text.secondary">
        Nenhum dado de consumo encontrado para o período (é preciso ter abastecimento e viagem cadastrados).
      </Typography>
    );
  }

  const table = {
    columns: ["Veículo", "Consumo real (km/L)", "Consumo esperado (km/L)", "Desvio (%)"],
    rows: report.results.map((r) => [
      r.vehicle,
      r.actualConsumption,
      r.expectedConsumption ?? "-",
      r.deviationPercent ?? "-",
    ]),
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          ⛽ Relatório de Consumo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Compara o consumo real (KM rodados ÷ litros abastecidos) com o consumo esperado cadastrado no veículo.
        </Typography>

        <ExportButtons title="Relatorio de Consumo" table={table} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Veículo</TableCell>
              <TableCell align="right">Consumo real (km/L)</TableCell>
              <TableCell align="right">Esperado (km/L)</TableCell>
              <TableCell align="right">Desvio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.results.map((r) => (
              <TableRow key={r.vehicle}>
                <TableCell>{r.vehicle}</TableCell>
                <TableCell align="right">{r.actualConsumption}</TableCell>
                <TableCell align="right">{r.expectedConsumption ?? "-"}</TableCell>
                <TableCell align="right">
                  {r.deviationPercent !== null ? (
                    <Chip
                      size="small"
                      label={`${r.deviationPercent > 0 ? "+" : ""}${r.deviationPercent}%`}
                      color={r.outOfExpected ? "error" : "success"}
                      variant={r.outOfExpected ? "filled" : "outlined"}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ConsumptionTab;
