import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useAuth } from "../../contexts/AuthContext";

import { useThemeContext } from "../../contexts/ThemeContext";

function Header() {

  const { user } = useAuth();

  const {
        darkMode,
        toggleTheme
    } = useThemeContext();

  return (
    <AppBar
      position="static"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        background: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Bem-vindo ao FleetWise
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Pesquisar..."
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>

          <IconButton
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? (
    <LightModeIcon />
  ) : (
    <DarkModeIcon />
  )}
</IconButton>
          

          <Avatar>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>

          <Typography fontWeight="600">
            {user?.name || "Usuário"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;