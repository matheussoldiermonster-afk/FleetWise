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
  Alert,
} from "@mui/material";

import StatBox from "../StatBox";
import ExportButtons from "../ExportButtons";

function formatDate(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ReimbursementTab({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  report,
  loading,
}) {
  const reimbursableVehicles = vehicles.filter((v) => v.reimbursable);

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          🔁 Saldo de KM (Carro Particular Reembolsado)
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Cada abastecimento reembolsado vira um crédito de km (litros × KM/L informado). O KM
          particular do dia a dia consome esse crédito. Saldo negativo indica que o técnico rodou
          mais particular do que o combustível reembolsado cobriu.
        </Typography>

        {reimbursableVehicles.length === 0 ? (
          <Alert severity="info">
            Nenhum veículo está marcado como "carro particular reembolsável" ainda. Marque essa
            opção na edição do veículo para usar esse relatório.
          </Alert>
        ) : (
          <>
            <TextField
              select
              size="small"
              label="Selecione o veículo"
              value={selectedVehicleId}
              onChange={(e) => onSelectVehicle(e.target.value)}
              sx={{ minWidth: 280, mb: 3 }}
            >
              {reimbursableVehicles.map((v) => (
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
                Selecione um veículo para ver o saldo.
              </Typography>
            ) : (
              (() => {
                const summary = [
                  { label: "KM Trabalho no período", value: report.totalWorkKm },
                  { label: "KM Particular no período", value: report.totalPersonalKm },
                  { label: "KM de crédito gerado", value: report.totalCreditKm },
                  { label: "Valor do KM Particular", value: formatCurrency(report.totalPersonalValue) },
                  { label: "Saldo final", value: report.finalBalance },
                ];

                const table = {
                  columns: ["Data", "KM Trabalho", "KM Particular", "Crédito gerado", "Valor Particular (R$)", "Saldo acumulado"],
                  rows: report.ledger.map((d) => [
                    formatDate(d.date),
                    d.workKm,
                    d.personalKm,
                    d.creditKm,
                    d.personalValue ?? "-",
                    d.balance,
                  ]),
                };

                return (
                  <>
                    <ExportButtons
                      title={`Saldo KM - ${report.vehicle.plate}`}
                      summary={summary}
                      table={table}
                    />

                    <Grid container spacing={2} mb={3}>
                      <Grid size={{ xs: 6, sm: 2.4 }}>
                        <StatBox label="KM Trabalho" value={report.totalWorkKm} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2.4 }}>
                        <StatBox label="KM Particular" value={report.totalPersonalKm} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2.4 }}>
                        <StatBox label="Crédito gerado" value={report.totalCreditKm} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 2.4 }}>
                        <StatBox
                          label="Valor Particular"
                          value={formatCurrency(report.totalPersonalValue)}
                          highlight
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2.4 }}>
                        <StatBox
                          label="Saldo final"
                          value={`${report.finalBalance} km`}
                          highlight={report.finalBalance >= 0}
                          danger={report.finalBalance < 0}
                        />
                      </Grid>
                    </Grid>

                    {report.ledger.length === 0 ? (
                      <Typography color="text.secondary">
                        Nenhum abastecimento reembolsado ou viagem registrada no período.
                      </Typography>
                    ) : (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell align="right">KM Trabalho</TableCell>
                            <TableCell align="right">KM Particular</TableCell>
                            <TableCell align="right">Crédito gerado</TableCell>
                            <TableCell align="right">Valor Particular</TableCell>
                            <TableCell align="right">Saldo acumulado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {report.ledger.map((d) => (
                            <TableRow key={d.date}>
                              <TableCell>{formatDate(d.date)}</TableCell>
                              <TableCell align="right">{d.workKm} km</TableCell>
                              <TableCell align="right">{d.personalKm} km</TableCell>
                              <TableCell align="right">
                                {d.creditKm > 0 ? `+${d.creditKm} km` : "-"}
                              </TableCell>
                              <TableCell align="right">
                                {d.personalValue !== null ? formatCurrency(d.personalValue) : "-"}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  fontWeight: "bold",
                                  color: d.balance < 0 ? "error.main" : "success.main",
                                }}
                              >
                                {d.balance} km
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                );
              })()
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ReimbursementTab;
