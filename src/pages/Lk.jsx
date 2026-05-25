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
  { id: "pink", color: "#fd6fb4" },
  { id: "#a57ffd", color: "#a57ffd" },
  { id: "#7d7fff", color: "#7d7fff" },
  { id: "#ffea8a", color: "#ffea8a" },
  { id: "#9ffd83", color: "#9ffd83" },
];

export default function Lk() {
  const [client, setClient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [clientRes, profileRes] = await Promise.all([
          axios.get("/client/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setClient(clientRes.data);
        setProfile(profileRes.data);

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    loadData();
  }, [navigate]);

  if (!client || !profile) {
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
          src={profile.avatar ? avatars[profile.avatar] : undefined}
          sx={{
            mb: 2,
            width: 90,
            height: 90,
            bgcolor: profile.bg_color || "#969696",
            border: "3px solid rgba(255,255,255,0.3)",
            boxShadow: 3
          }}
        >
          {!profile.avatar && <PersonIcon sx={{ fontSize: 40 }} />}
        </Avatar>

        <Typography variant="h4">
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
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                border: "2px solid #ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          На главную
        </Button>
      </Paper>
    </Box>
  );
}
