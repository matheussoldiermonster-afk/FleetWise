import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function AlertCard({ alerts = [] }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          🚨 Alertas
        </Typography>

        {alerts.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum alerta encontrado.
          </Typography>
        ) : (
          alerts.map((alert, index) => (
            <Box key={index}>
              <Box
                display="flex"
                gap={1.5}
                py={1.75}
              >
                <WarningAmberIcon
                  color="warning"
                  fontSize="small"
                  sx={{ mt: 0.3 }}
                />

                <Box>
                  <Typography fontWeight={600}>
                    {alert.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                  >
                    {alert.description}
                  </Typography>
                </Box>
              </Box>

              {index !== alerts.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default AlertCard;
