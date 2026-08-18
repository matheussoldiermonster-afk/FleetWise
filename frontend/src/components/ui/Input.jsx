import { TextField } from "@mui/material";

function Input({ placeholder, value, onChange, type = "text", label, ...props }) {
  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default Input;