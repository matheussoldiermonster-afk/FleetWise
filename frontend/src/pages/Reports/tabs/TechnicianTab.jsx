import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";

import StatBox from "../StatBox";
import ExportButtons from "../ExportButtons";

function TechnicianTab({ technicians, selectedTechnicianId, onSelectTechnician, report, loading }) {
  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          👷 Relatório por Técnico
        </Typography>

        <TextField
          select
          size="small"
          label="Selecione o técnico"
          value={selectedTechnicianId}
          onChange={(e) => onSelectTechnician(e.target.value)}
          sx={{ minWidth: 280, mb: 3 }}
        >
          {technicians.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : !report ? (
          <Typography color="text.secondary">
            Selecione um técnico para ver o relatório.
          </Typography>
        ) : (
          (() => {
            const summary = [
              { label: "Técnico", value: report.technician.name },
              { label: "Viagens", value: report.tripsCount },
              { label: "KM Trabalho", value: report.workKm },
              { label: "KM Particular", value: report.personalKm },
              { label: "Veículos utilizados", value: report.vehiclesUsed.join(", ") || "-" },
            ];

            return (
              <>
                <ExportButtons title={`Relatorio - ${report.technician.name}`} summary={summary} />

                <Grid container spacing={2} mb={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatBox label="Viagens" value={report.tripsCount} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatBox label="KM Trabalho" value={report.workKm} highlight />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatBox label="KM Particular" value={report.personalKm} />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Veículos utilizados
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {report.vehiclesUsed.length === 0 ? (
                    <Typography color="text.secondary">Nenhum veículo utilizado no período.</Typography>
                  ) : (
                    report.vehiclesUsed.map((v) => <Chip key={v} label={v} />)
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {report.note}
                </Typography>
              </>
            );
          })()
        )}
      </CardContent>
    </Card>
  );
}

export default TechnicianTab;
