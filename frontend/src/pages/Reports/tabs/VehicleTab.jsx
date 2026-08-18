import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
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

function formatDate(value) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function VehicleTab({ vehicles, selectedVehicleId, onSelectVehicle, report, loading }) {
  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          🚗 Relatório por Veículo
        </Typography>

        <TextField
          select
          size="small"
          label="Selecione o veículo"
          value={selectedVehicleId}
          onChange={(e) => onSelectVehicle(e.target.value)}
          sx={{ minWidth: 280, mb: 3 }}
        >
          {vehicles.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.model} - {v.plate}
            </MenuItem>
          ))}
        </TextField>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : !report ? (
          <Typography color="text.secondary">
            Selecione um veículo para ver o relatório.
          </Typography>
        ) : (
          <>
            {(() => {
              const summary = [
                { label: "Placa", value: report.vehicle.plate },
                { label: "Marca/Modelo", value: `${report.vehicle.brand} ${report.vehicle.model} ${report.vehicle.year}` },
                { label: "KM Atual", value: report.vehicle.currentKm },
                { label: "Abastecimentos", value: report.fuelingsCount },
                { label: "Viagens", value: report.tripsCount },
                { label: "Litros", value: report.totalLiters },
                { label: "Valor gasto", value: formatCurrency(report.totalSpent) },
                { label: "KM Trabalho", value: report.workKm },
                { label: "KM Particular", value: report.personalKm },
                { label: "Consumo médio", value: report.averageConsumption ?? "Sem dados" },
              ];

              const table = {
                columns: ["Data", "Técnico", "KM Inicial", "KM Final", "KM Trabalho", "KM Particular detectado"],
                rows: report.history.map((h) => [
                  formatDate(h.date),
                  h.technician,
                  h.initialKm,
                  h.finalKm,
                  h.km,
                  h.personalKmDetected,
                ]),
              };

              return (
                <>
                  <ExportButtons
                    title={`Relatorio - ${report.vehicle.plate}`}
                    summary={summary}
                    table={table}
                  />

                  <Grid container spacing={2} mb={3}>
                    {summary.map((item) => (
                      <Grid key={item.label} size={{ xs: 6, sm: 4, md: 3 }}>
                        <StatBox
                          label={item.label}
                          value={item.value}
                          highlight={item.label === "Valor gasto"}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Histórico de viagens
                  </Typography>

                  {report.history.length === 0 ? (
                    <Typography color="text.secondary">
                      Nenhuma viagem registrada no período.
                    </Typography>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Técnico</TableCell>
                          <TableCell align="right">KM Inicial → Final</TableCell>
                          <TableCell align="right">KM Trabalho</TableCell>
                          <TableCell align="right">KM Particular detectado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.history.map((h, i) => (
                          <TableRow key={i}>
                            <TableCell>{formatDate(h.date)}</TableCell>
                            <TableCell>{h.technician}</TableCell>
                            <TableCell align="right">
                              {h.initialKm} → {h.finalKm}
                            </TableCell>
                            <TableCell align="right">{h.km} km</TableCell>
                            <TableCell align="right">
                              {h.personalKmDetected > 0 ? `${h.personalKmDetected} km` : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              );
            })()}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default VehicleTab;
