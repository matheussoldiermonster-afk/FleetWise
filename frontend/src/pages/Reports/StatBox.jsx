import { Box, Typography } from "@mui/material";

function StatBox({ label, value, highlight, danger }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: "background.default",
        height: "100%",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h5"
        fontWeight="bold"
        color={danger ? "error.main" : highlight ? "primary.main" : "text.primary"}
        mt={0.5}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default StatBox;
