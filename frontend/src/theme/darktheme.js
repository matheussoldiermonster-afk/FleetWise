import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#1FA64A",
    },

    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },

  shape: {
    borderRadius: 16,
  },
});

export default darkTheme;