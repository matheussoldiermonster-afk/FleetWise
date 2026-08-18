import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1FA64A",
    },

    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },

  shape: {
    borderRadius: 16,
  },
});

export default lightTheme;