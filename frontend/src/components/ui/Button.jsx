import { Button as MuiButton } from "@mui/material";

function Button({ children, ...props }) {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      size="large"
      {...props}
    >
      {children}
    </MuiButton>
  );
}

export default Button;