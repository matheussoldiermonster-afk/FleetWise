import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { useSnackbar } from "notistack";

import api from "../../services/api";
import { exportReportToPdf } from "../../utils/reportExport";

function ExecutiveSummaryDialog({ filters }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  async function handleOpen() {
    setOpen(true);
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get("/reports/executive-summary", { params });
      setSummary(response.data);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao gerar resumo executivo.",
        { variant: "error" }
      );
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function handleExportPdf() {
    if (!summary) return;

    exportReportToPdf({
      title: "Resumo Executivo",
      subtitle: new Date(summary.period.start).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      }),
      summary: [{ label: "Resumo", value: summary.text }],
    });
  }

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AutoAwesomeIcon />}
        onClick={handleOpen}
      >
        Gerar Relatório Executivo
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>✨ Resumo Executivo</DialogTitle>

        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
              {summary?.text}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPdf}
            disabled={!summary}
          >
            Exportar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExecutiveSummaryDialog;
