import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Typography } from "@mui/material";

function BarChartDashboard({ data = [], title, dataKey, color }) {
  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={3}
      >
        {title}
      </Typography>

      {data.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum dado disponível ainda.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              stroke="#E5E7EB"
              strokeDasharray="5 5"
              vertical={false}
            />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,.12)",
              }}
            />

            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
}

export default BarChartDashboard;
