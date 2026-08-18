import { Box, Toolbar } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";

const drawerWidth = 260;

function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Espaço da Sidebar */}
        <Toolbar />

        <Header />

        <Box
          sx={{
            p: 4,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;