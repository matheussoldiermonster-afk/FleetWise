import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";

function RecentActivity({ activities = [] }) {
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
          color="primary"
          mb={2}
        >
          📋 Atividades Recentes
        </Typography>

        {activities.length === 0 ? (
          <Typography color="text.secondary">
            Nenhuma atividade encontrada.
          </Typography>
        ) : (
          activities.map((activity, index) => (
            <Box key={index}>
              <Box py={1.75}>
                <Typography fontWeight={600}>
                  {activity.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                >
                  {activity.date}
                </Typography>
              </Box>

              {index !== activities.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
