import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

function LineChartDashboard({ title, data }) {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        mt: 3,
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          {title}
        </Typography>

        <ResponsiveContainer width="100%" height={350}>
  <AreaChart data={data}>
    <defs>
      <linearGradient
        id="colorValue"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="5%"
          stopColor={theme.palette.primary.main}
          stopOpacity={0.35}
        />

        <stop
          offset="95%"
          stopColor={theme.palette.primary.main}
          stopOpacity={0}
        />
      </linearGradient>
    </defs>

    <CartesianGrid
      strokeDasharray="3 3"
      stroke="#E5E7EB"
    />

    <XAxis dataKey="month" />

    <YAxis />

    <Tooltip
    contentStyle={{
        borderRadius: 12,
        border: "none",
        boxShadow: "0 10px 25px rgba(0,0,0,.12)",
    }}
/>

    <Area
      type="monotone"
      dataKey="value"
      stroke={theme.palette.primary.main}
      strokeWidth={3}
      fill="url(#colorValue)"
      dot={false}
activeDot={{ r: 6 }}
    />
  </AreaChart>
</ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default LineChartDashboard;