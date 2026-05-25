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
import { Snackbar, Alert} from "@mui/material";

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

export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("user");
  const [avatarColor, setAvatarColor] = useState("#b1abae");
  const [selectedColor, setSelectedColor] = useState("pink");
   const [notify, setNotify] = useState({
  open: false,
  text: "",
  severity: "success",
});

  

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPhone(res.data.telefon || "");
        setSelectedAvatar(res.data.avatar || "user");
        setSelectedColor(res.data.bg_color || "pink");
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

 

  const handleSave = async () => {
    
  try {
    await axios.put(
      "/profile/me",
      {
        telefon: phone,
        avatar: selectedAvatar,
        bg_color: selectedColor,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      setNotify({
      open: true,
      text: "Настройки сохранены ❤️",
      severity: "success",
    });

    setTimeout(() => {
      navigate("/Lk");
    }, 1500);
  } catch (err) {
    console.log(err);
    setNotify({
      open: true,
      text: "Ошибка сохранения ❌",
      severity: "error",
    });
      }
};

  const themeColor =
    colors.find((c) => c.id === selectedColor)?.color || "#ff4fa3";

  return (  <>
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-main)",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
        >
        <Typography
          variant="h4"
            align="center"
            mb={4}
            sx={{
              fontWeight: 800,
              letterSpacing: "-1px",
              mb: 2,
            }}
        >
          Настройки профиля
        </Typography>

        {/* AVATAR */}
<Typography fontWeight={700} mb={3} textAlign="center">
  Аватар
</Typography>

<Stack
  direction="row"
  spacing={2}
  justifyContent="center"
  flexWrap="wrap"
>
  {Object.entries(avatars).map(([key, src]) => (
    <IconButton
      key={key}
      onClick={() => setSelectedAvatar(key)}
      sx={{
        width: 60,
        height: 60,
        backgroundColor:
            selectedAvatar === key ? themeColor : "#f5f5f5",
        border:
            selectedAvatar === key
            ? `3px solid ${themeColor}`
            : "3px solid transparent",
        borderRadius: "50%",
        transition: "0.25s",
        boxShadow:
            selectedAvatar === key
            ? `0 0 12px ${themeColor}66`
            : "none",
        "&:hover": {
            transform: "scale(1.05)",
        },
        }}
>
      <Avatar src={src} />
    </IconButton>
  ))}
</Stack>

{/* COLOR */}
<Typography fontWeight={700} mb={1} textAlign="center">
  Цвет
</Typography>

<Stack
  direction="row"
  spacing={2}
  mb={3}
  justifyContent="center"
  alignItems="center"
  flexWrap="wrap"
>
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
            mt: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.7)",
            },
          }}
        />

        {/* BUTTONS */}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3"
              }
              }}
          >
            Сохранить
          </Button>

          <Button
            onClick={() => navigate("/Lk")}
            sx={{
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3"
              }
              }}
            >
            Назад
          </Button>
        </Stack>
      </Paper>
    </Box>
        <Snackbar
          open={notify.open}
          autoHideDuration={3000}
          onClose={() =>
            setNotify({ ...notify, open: false })
          }
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            severity={notify.severity}
            variant="filled"
            sx={{
              borderRadius: "14px",
              fontWeight: 600,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            {notify.text}
          </Alert>
        </Snackbar> </>
    
  );
}
