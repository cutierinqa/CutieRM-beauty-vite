
import { List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ClientSidebar() {
  const navigate = useNavigate();

  return (
    <Paper sx={{ width: 240, borderRadius: 0 }}>
      <List>
        <ListItemButton onClick={() => navigate("/lk")}>
          <ListItemText primary="Профиль" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/lk/visits")}>
          <ListItemText primary="Мои визиты" />
        </ListItemButton>

        <ListItemButton onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          <ListItemText primary="Выход" />
        </ListItemButton>
      </List>
    </Paper>
  );
}
