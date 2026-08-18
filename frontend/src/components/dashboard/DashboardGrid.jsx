import { Grid } from "@mui/material";

function DashboardGrid({ left, right }) {
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        {left}
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        {right}
      </Grid>
    </Grid>
  );
}

export default DashboardGrid;