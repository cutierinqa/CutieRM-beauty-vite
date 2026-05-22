import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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

export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("user");
  const [selectedColor, setSelectedColor] = useState("pink");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPhone(res.data.telefon || "");
        setSelectedAvatar(res.data.avatar || "user");
        setSelectedColor(res.data.theme_color || "pink");
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(
        "/users/me",
        {
          telefon: phone,
          avatar: selectedAvatar,
          theme_color: selectedColor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Настройки сохранены ❤️");
    } catch (err) {
      console.log(err);
    }
  };

  const themeColor =
    colors.find((c) => c.id === selectedColor)?.color || "#ff4fa3";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, #fff7fb, #ffeef6)`,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 4,
          borderRadius: 5,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${themeColor}33`,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          textAlign="center"
          mb={3}
          color={themeColor}
        >
          Настройки профиля
        </Typography>

        {/* AVATAR */}
        <Typography fontWeight={700} mb={1}>
          Выбор аватара
        </Typography>

        <Stack direction="row" spacing={2} mb={3}>
        {Object.entries(avatars).map(([key, src]) => (
            <IconButton
            key={key}
            onClick={() => setSelectedAvatar(key)}
            sx={{
                border:
                selectedAvatar === key
                    ? `2px solid ${themeColor}`
                    : "2px solid transparent",
                borderRadius: "50%",
            }}
            >
            <Avatar src={src} />
            </IconButton>
        ))}
        </Stack>

        {/* COLOR */}
        <Typography fontWeight={700} mb={1}>
          Цвет профиля
        </Typography>

        <Stack direction="row" spacing={2} mb={3}>
          {colors.map((c) => (
            <Box
              key={c.id}
              onClick={() => setSelectedColor(c.id)}
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: c.color,
                cursor: "pointer",
                border:
                  selectedColor === c.id
                    ? "3px solid #000"
                    : "2px solid transparent",
                transition: "0.2s",
              }}
            />
          ))}
        </Stack>

        {/* PHONE */}
        <TextField
          fullWidth
          label="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.7)",
            },
          }}
        />

        {/* BUTTONS */}
        <Stack spacing={2}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${themeColor}, #ff8ec6)`,
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            Сохранить
          </Button>

          <Button
            onClick={() => navigate("/Lk")}
            sx={{
              borderRadius: "12px",
              color: themeColor,
              fontWeight: 700,
            }}
          >
            Назад
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}