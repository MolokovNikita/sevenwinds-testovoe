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
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <ProjectNavBar />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
