import { createTheme } from "@mui/material/styles";

function getTheme(mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#15803D",
      },

      secondary: {
        main: "#2563EB",
      },

      background: {
        default: isDark ? "#0F172A" : "#F8FAFC",
        paper: isDark ? "#1E293B" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#F1F5F9" : "#0F172A",
        secondary: isDark ? "#94A3B8" : "#64748B",
      },

      success: {
        main: "#22C55E",
      },

      warning: {
        main: "#F59E0B",
      },

      error: {
        main: "#EF4444",
      },

      divider: isDark ? "#334155" : "#E2E8F0",
    },

    shape: {
      borderRadius: 16,
    },

    typography: {
      fontFamily: [
        "Inter",
        "Roboto",
        "Arial",
        "sans-serif",
      ].join(","),
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  });
}

export default getTheme;
