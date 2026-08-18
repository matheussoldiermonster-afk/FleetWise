import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { ThemeProvider, CssBaseline } from "@mui/material";

import getTheme from "../theme/theme";

const ThemeContext = createContext(null);

const STORAGE_KEY = "fleetwise:theme-mode";

function getInitialMode() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;

  return prefersDark ? "dark" : "light";
}

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = {
    mode,
    darkMode: mode === "dark",
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext precisa ser usado dentro de um ThemeContextProvider."
    );
  }

  return context;
}
