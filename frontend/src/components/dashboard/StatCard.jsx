import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

function StatCard({
  title,
  value,
  icon,
  color,
  trend = 0,
  subtitle = "em relação ao mês passado",
}) {
  const positive = trend >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: "100%",
        border: "1px solid #E5E7EB",
        transition: ".25s",
        

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 15px 35px rgba(0,0,0,.08)",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
  variant="body2"
  sx={{
    color: "text.secondary",
    textAlign: "center",
    width: "100%",
    mb: 2,
  }}
>
  {title}
</Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              mt={1}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${color}20`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color,
              fontSize: 30,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mt={3}
        >
          <Chip
            icon={
              positive
                ? <TrendingUpIcon />
                : <TrendingDownIcon />
            }
            label={`${Math.abs(trend)}%`}
            color={positive ? "success" : "error"}
            size="small"
          />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatCard;