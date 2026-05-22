import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "../api/axios";

const avatars = {
  flower: "/src/assets/avatars/flower.png",
  woman: "/src/assets/avatars/woman.png",
  man: "/src/assets/avatars/man.png",
  user: "/src/assets/avatars/user.png",
  heart: "/src/assets/avatars/heart.png",
};

const colors = [
  { id: "pink", color: "#ff4fa3" },
  { id: "purple", color: "#8b5cf6" },
  { id: "blue", color: "#3b82f6" },
  { id: "mint", color: "#10b981" },
];

export default function Lk() {
  const [client, setClient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClient(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    loadClient();
  }, [navigate]);

  if (!client) {
    return (
      <Typography align="center" mt={10} fontSize="1.5rem">
        Загрузка данных клиента...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: client.bg_color || "#f5f5f5",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, md: 6 },
          width: "100%",
          maxWidth: 650,
          borderRadius: 4,
          boxShadow: 6,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {/* меню */}
        <Box
          sx={{ position: "absolute", top: 16, right: 16 }}
          onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
          onMouseLeave={() => setAnchorEl(null)}
        >
          <IconButton>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              onMouseEnter: () => setAnchorEl(anchorEl),
              onMouseLeave: () => setAnchorEl(null),
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => { navigate("/loyalty"); setAnchorEl(null); }}>
              Программа лояльности
            </MenuItem>
            <MenuItem onClick={() => { navigate("/history"); setAnchorEl(null); }}>
              Мои записи
            </MenuItem>
            <MenuItem onClick={() => { navigate("/settings"); setAnchorEl(null); }}>
              Настройки
            </MenuItem>
          </Menu>
        </Box>

        {/* аватар */}
        <Avatar
        src={client.avatar ? avatars[client.avatar] : undefined}
        sx={{
          mb: 2,
          width: 90,
          height: 90,
          bgcolor: client.bg_color || "#4b3126",
          border: "3px solid rgba(255,255,255,0.3)",
          boxShadow: 3
        }}
      >
        {!client.avatar && <PersonIcon sx={{ fontSize: 40 }} />}
      </Avatar>

        <Typography variant="h4" fontWeight={600}>
          {client.fio}
        </Typography>

        {client.kategoria && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            {client.kategoria.nazvanie}
          </Typography>
        )}

        <Divider sx={{ my: 3, width: "100%" }} />

        {/* данные */}
        <Stack spacing={1.5} sx={{ width: "100%" }}>
          <Typography><b>Телефон:</b> {client.telefon}</Typography>
          <Typography><b>Email:</b> {client.email}</Typography>
          <Typography><b>Визитов:</b> {client.kolichestvo_vizitov}</Typography>
          <Typography><b>Первый визит:</b> {client.data_pervogo_vizita}</Typography>
          <Typography><b>Последний визит:</b> {client.data_poslednego_vizita}</Typography>
        </Stack>

        <Divider sx={{ my: 4, width: "100%" }} />

        {/* кнопка */}
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            fontSize: "1.1rem",
            px: 5,
            py: 1.5,
            backgroundColor: "#4b3126",
            color: "white",
            "&:hover": { backgroundColor: "#3a231a" },
          }}
        >
          На главную
        </Button>
      </Paper>
    </Box>
  );
}