import { Card } from "@mui/material";

function CardContainer({ children, sx = {} }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 30px rgba(15,23,42,.06)",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

export default CardContainer;