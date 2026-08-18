import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import RouteIcon from "@mui/icons-material/Route";
import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 260;

function Sidebar() {
  const { pathname } = useLocation();

  const { logout, user } = useAuth();

  const menu = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Veículos",
      icon: <DirectionsCarIcon />,
      path: "/vehicles",
    },
    {
      text: "Técnicos",
      icon: <EngineeringIcon />,
      path: "/technicians",
    },
    {
      text: "Abastecimentos",
      icon: <LocalGasStationIcon />,
      path: "/fuelings",
    },
    {
      text: "Viagens",
      icon: <RouteIcon />,
      path: "/trips",
    },
    {
      text: "Manutenções",
      icon: <BuildIcon />,
      path: "/maintenances",
    },
    {
      text: "Relatórios",
      icon: <AssessmentIcon />,
      path: "/reports",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
        >
          FleetWise
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <Box p={2}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Usuário
        </Typography>

        <Typography fontWeight="bold">
          {user?.name}
        </Typography>

        <ListItemButton
          onClick={logout}
          sx={{ mt: 2 }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Sair" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

export default Sidebar;