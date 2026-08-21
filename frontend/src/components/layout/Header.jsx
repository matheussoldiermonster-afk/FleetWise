import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import api from "../../services/api";

function Header() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  // --- Busca global ---
  const [query, setQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // --- Notificações ---
  const [notifications, setNotifications] = useState({ count: 0, items: [] });
  const [notifAnchor, setNotifAnchor] = useState(null);

  useEffect(() => {
    loadSearchData();
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadSearchData() {
    try {
      const [vehiclesRes, techniciansRes] = await Promise.all([
        api.get("/vehicles"),
        api.get("/technicians"),
      ]);
      setVehicles(vehiclesRes.data);
      setTechnicians(techniciansRes.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadNotifications() {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const term = query.trim().toLowerCase();

  const matchedVehicles = term
    ? vehicles
        .filter(
          (v) =>
            v.plate.toLowerCase().includes(term) ||
            v.model.toLowerCase().includes(term) ||
            v.brand.toLowerCase().includes(term)
        )
        .slice(0, 5)
    : [];

  const matchedTechnicians = term
    ? technicians.filter((t) => t.name.toLowerCase().includes(term)).slice(0, 5)
    : [];

  const hasResults = matchedVehicles.length > 0 || matchedTechnicians.length > 0;

  function goToVehicle(vehicle) {
    setSearchOpen(false);
    setQuery("");
    navigate("/vehicles", { state: { prefillSearch: vehicle.plate } });
  }

  function goToTechnician(technician) {
    setSearchOpen(false);
    setQuery("");
    navigate("/technicians", { state: { prefillSearch: technician.name } });
  }

  function handleNotificationClick(item) {
    setNotifAnchor(null);
    navigate(item.link);
  }

  async function handleDismiss(item) {
    setNotifications((prev) => ({
      count: prev.count - 1,
      items: prev.items.filter((i) => i.key !== item.key),
    }));

    try {
      await api.post("/notifications/dismiss", {
        key: item.key,
        value: item.value,
      });
    } catch (error) {
      console.error(error);
      loadNotifications();
    }
  }

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

          <Typography variant="body2" color="text.secondary">
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
          <Box
            component="img"
            src="/carro-fleetwise.gif"
            alt="FleetWise"
            sx={{
              height: 40,
              width: "auto",
              display: { xs: "none", sm: "block" },
            }}
          />

          <Box ref={searchBoxRef} sx={{ position: "relative" }}>
            <TextField
              size="small"
              placeholder="Pesquisar placa, técnico..."
              sx={{ width: 280 }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {searchOpen && term && (
              <Paper
                elevation={4}
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  width: 320,
                  zIndex: 20,
                  maxHeight: 360,
                  overflowY: "auto",
                }}
              >
                {!hasResults ? (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    Nenhum resultado para "{query}".
                  </Typography>
                ) : (
                  <List dense>
                    {matchedVehicles.length > 0 && (
                      <ListSubheader>Veículos</ListSubheader>
                    )}
                    {matchedVehicles.map((v) => (
                      <ListItemButton key={`v-${v.id}`} onClick={() => goToVehicle(v)}>
                        <DirectionsCarIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
                        <ListItemText
                          primary={`${v.plate} - ${v.model}`}
                          secondary={v.brand}
                        />
                      </ListItemButton>
                    ))}

                    {matchedTechnicians.length > 0 && (
                      <ListSubheader>Técnicos</ListSubheader>
                    )}
                    {matchedTechnicians.map((t) => (
                      <ListItemButton key={`t-${t.id}`} onClick={() => goToTechnician(t)}>
                        <PersonIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
                        <ListItemText primary={t.name} />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Paper>
            )}
          </Box>

          <IconButton
            onClick={(e) => {
              setNotifAnchor(e.currentTarget);
              loadNotifications();
            }}
          >
            <Badge badgeContent={notifications.count} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            PaperProps={{ sx: { width: 340, maxHeight: 400 } }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }} color="text.secondary">
              Notificações
            </Typography>
            <Divider />

            {notifications.items.length === 0 ? (
              <MenuItem disabled>Nenhuma notificação no momento.</MenuItem>
            ) : (
              notifications.items.map((item, index) => (
                <MenuItem
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                >
                  <Box
                    onClick={() => handleNotificationClick(item)}
                    sx={{ flex: 1, cursor: "pointer" }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {item.type === "maintenance" ? "🛠 " : "🔁 "}
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss(item);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
              ))
            )}
          </Menu>

          <IconButton onClick={toggleTheme}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Avatar>{user?.name?.charAt(0)?.toUpperCase() || "U"}</Avatar>

          <Typography fontWeight="600">{user?.name || "Usuário"}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
