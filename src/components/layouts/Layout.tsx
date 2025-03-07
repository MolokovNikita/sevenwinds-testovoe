import { Box } from "@mui/material";
import Sidebar from "../ui/SideBar/SideBar.tsx";
import Navbar from "../ui/NavBar/NavBar.tsx";
import ProjectNavBar from "../ui/ProjectNavBar/ProjectNavBar.tsx";
import { JSX, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <Navbar />
      <ProjectNavBar />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginTop: "80px",
            marginLeft: "240px",
            display: "flex",
            height: "calc(100vh - 80px)",
            width: "100%", // Высота экрана минус navbar
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
