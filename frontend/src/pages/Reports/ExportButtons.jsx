import { Box, Button } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";

import { exportReportToPdf, exportReportToExcel } from "../../utils/reportExport";

function ExportButtons({ title, subtitle, summary, table }) {
  const payload = { title, subtitle, summary, table };

  return (
    <Box display="flex" gap={1.5} mb={2}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<PictureAsPdfIcon />}
        onClick={() => exportReportToPdf(payload)}
      >
        Exportar PDF
      </Button>

      <Button
        variant="outlined"
        size="small"
        startIcon={<GridOnIcon />}
        onClick={() => exportReportToExcel(payload)}
      >
        Exportar Excel
      </Button>
    </Box>
  );
}

export default ExportButtons;
