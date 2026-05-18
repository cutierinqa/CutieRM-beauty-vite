
import { Box } from "@mui/material";
import ClientSidebar from "../components/ClientSidebar";

export default function ClientLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <ClientSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
