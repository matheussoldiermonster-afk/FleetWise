import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { useSnackbar } from "notistack";

import StatBox from "../StatBox";
import ExportButtons from "../ExportButtons";
import api from "../../../services/api";

function formatCurrency(value) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PersonalUsageTab({ report, loading, onCostPerKmSaved }) {
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setRate(report?.costPerKm ?? "");
    setEditing(true);
  }

  async function handleSaveRate() {
    if (!rate || Number(rate) <= 0) {
      enqueueSnackbar("Informe um valor de R$/km válido.", { variant: "error" });
      return;
    }

    setSaving(true);
    try {
      await api.put("/companies/me", { costPerKm: Number(rate) });
      enqueueSnackbar("Tarifa por km salva com sucesso!", { variant: "success" });
      setEditing(false);
      onCostPerKmSaved();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Erro ao salvar tarifa.", {
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          🚘 Relatório de Uso Particular
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Mostra quanto cada técnico usou os veículos da empresa fora do horário/trabalho, e uma
          estimativa de valor a descontar conforme a política da empresa.
        </Typography>

        <Alert
          severity={report?.costPerKm ? "info" : "warning"}
          sx={{ mb: 2 }}
        >
          {editing ? (
            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                type="number"
                label="R$ por km"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                sx={{ maxWidth: 160 }}
                autoFocus
              />
              <Button variant="contained" onClick={handleSaveRate} disabled={saving}>
                Salvar tarifa
              </Button>
              <Button onClick={() => setEditing(false)} disabled={saving}>
                Cancelar
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Typography variant="body2">
                {report?.costPerKm
                  ? `Tarifa atual: R$ ${report.costPerKm.toLocaleString("pt-BR")} por km`
                  : "Você ainda não configurou a tarifa (R$/km) para calcular o valor estimado."}
              </Typography>
              <Button size="small" variant="outlined" onClick={startEditing}>
                {report?.costPerKm ? "Editar tarifa" : "Configurar tarifa"}
              </Button>
            </Box>
          )}
        </Alert>

        {!report || report.items.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum uso particular registrado no período.
          </Typography>
        ) : (
          (() => {
            const summary = [
              { label: "Tarifa configurada (R$/km)", value: report.costPerKm ?? "Não configurada" },
              { label: "Total KM particular", value: report.totalPersonalKm },
              {
                label: "Total estimado a descontar",
                value: report.totalEstimatedCost !== null ? formatCurrency(report.totalEstimatedCost) : "-",
              },
            ];

            const table = {
              columns: ["Veículo", "Técnico", "KM Particular", "Valor estimado (R$)"],
              rows: report.items.map((i) => [
                i.vehicle,
                i.technician,
                i.personalKm,
                i.estimatedCost ?? "-",
              ]),
            };

            return (
              <>
                <ExportButtons title="Relatorio de Uso Particular" summary={summary} table={table} />

                <Grid container spacing={2} mb={3}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <StatBox label="Total KM particular" value={report.totalPersonalKm} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <StatBox
                      label="Total estimado"
                      value={
                        report.totalEstimatedCost !== null
                          ? formatCurrency(report.totalEstimatedCost)
                          : "Configure a tarifa"
                      }
                      highlight
                    />
                  </Grid>
                </Grid>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Veículo</TableCell>
                      <TableCell>Técnico</TableCell>
                      <TableCell align="right">KM Particular</TableCell>
                      <TableCell align="right">Valor estimado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.vehicle}</TableCell>
                        <TableCell>{item.technician}</TableCell>
                        <TableCell align="right">{item.personalKm} km</TableCell>
                        <TableCell align="right">
                          {item.estimatedCost !== null ? formatCurrency(item.estimatedCost) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            );
          })()
        )}
      </CardContent>
    </Card>
  );
}

export default PersonalUsageTab;
