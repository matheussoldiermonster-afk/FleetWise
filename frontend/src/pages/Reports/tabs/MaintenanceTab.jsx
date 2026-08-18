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

function MaintenanceTab({ report, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report || report.items.length === 0) {
    return (
      <Typography color="text.secondary">
        Nenhuma manutenção cadastrada ainda.
      </Typography>
    );
  }

  const table = {
    columns: ["Veículo", "KM Atual", "Tipo", "Vence em (KM)", "Restam (KM)"],
    rows: report.items.map((i) => [
      i.vehicle,
      i.currentKm,
      i.type,
      i.nextKm,
      i.remaining,
    ]),
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          🛠 Relatório de Manutenção
        </Typography>

        <ExportButtons title="Relatorio de Manutencao" table={table} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Veículo</TableCell>
              <TableCell align="right">KM Atual</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Vence em</TableCell>
              <TableCell align="right">Restam</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.items.map((item, index) => (
              <TableRow
                key={index}
                sx={item.critical ? { backgroundColor: "error.main", opacity: 0.9 } : undefined}
              >
                <TableCell sx={item.critical ? { color: "#FFF" } : undefined}>
                  {item.vehicle}
                </TableCell>
                <TableCell align="right" sx={item.critical ? { color: "#FFF" } : undefined}>
                  {item.currentKm}
                </TableCell>
                <TableCell sx={item.critical ? { color: "#FFF" } : undefined}>
                  {item.type}
                </TableCell>
                <TableCell align="right" sx={item.critical ? { color: "#FFF" } : undefined}>
                  {item.nextKm} km
                </TableCell>
                <TableCell align="right">
                  <Chip
                    size="small"
                    label={
                      item.remaining <= 0
                        ? `Venceu há ${Math.abs(item.remaining)} km`
                        : `${item.remaining} km`
                    }
                    color={item.critical ? "error" : "success"}
                    variant={item.critical ? "filled" : "outlined"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default MaintenanceTab;
