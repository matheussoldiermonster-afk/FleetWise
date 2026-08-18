import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const COLORS = [
  "#16A34A",
  "#2563EB",
  "#F97316",
  "#DC2626",
  "#7C3AED",
];

function PieChartDashboard({ data = [] }) {
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
          🚗 Gastos por Veículo
        </Typography>

        {data.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum dado disponível ainda.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,.12)",
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default PieChartDashboard;
