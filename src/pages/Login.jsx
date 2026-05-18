import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { TextField, Button, Box, Typography, Modal, Stack } from "@mui/material";

export default function Login() {
  const [telefon, setTelefon] = useState("+7");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!/^\+7\d{10}$/.test(telefon)) {
    alert("Неправильный формат номера!");
    return;
  }

  try {
    const res = await axios.post("/login", { telefon, password });

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("role", res.data.role);

    switch (res.data.role) {
      case "client":
        navigate("/Lk");
        break;
      case "master":
        navigate("/masterlk");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  } catch (err) {
    alert("Неверный логин или пароль");
    console.error(err);
  }
};

  const inputStyles = {
    input: { color: "white" },
    "& label": { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#949494ff" },
      "&:hover fieldset": { borderColor: "#4b3126" },
      "&.Mui-focused fieldset": { borderColor: "#d6d6d6ff" }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        border: 1,
        borderRadius: 2,
        borderColor: "#4b3126",
        boxShadow: 3
      }}
    >
      <Typography variant="h5" align="center" gutterBottom color="white">
        Вход в личный кабинет
      </Typography>

      <form onSubmit={handleLogin}>
        <Stack spacing={2} mb={2}>
          <TextField
            label="Телефон"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            fullWidth
            sx={inputStyles}
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={inputStyles}
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#4b3126",
            color: "white"
          }}
        >
          Войти
        </Button>
      </form>

      <Typography align="center" mt={2} color="white">
        Нет аккаунта?{" "}
        <Button
          onClick={() => setShowRegister(true)}
          sx={{
            color: "white",
            "&:hover": { color: "#4b3126" }
          }}
        >
          Зарегистрироваться
        </Button>
      </Typography>

      <Modal open={showRegister} onClose={() => setShowRegister(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#1e1e1e",
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" align="center" mb={2} color="white">
            Регистрация
          </Typography>

          <RegisterForm onClose={() => setShowRegister(false)} />
        </Box>
      </Modal>
    </Box>
  );
}

function RegisterForm({ onClose }) {
  const [password, setPassword] = useState("");
  const [fio, setFio] = useState("");
  const [telefon, setTelefon] = useState("+7");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const inputStyles = {
    input: { color: "white" },
    "& label": { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#949494ff" },
      "&:hover fieldset": { borderColor: "#4b3126" },
      "&.Mui-focused fieldset": { borderColor: "#d6d6d6ff" }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (/[0-9]/.test(fio)) newErrors.fio = "Некорректное имя";
    if (!/^\+7\d{10}$/.test(telefon)) newErrors.telefon = "Телефон неверный";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email неверный";
    if (password.length < 8) newErrors.password = "Пароль минимум 8 символов";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await axios.post("/register", { telefon, fio, password, email });
      onClose();
    }
  };

  return (
  <form onSubmit={handleRegister} style={{ width: "100%" }}>
    <Stack spacing={2}>
      <TextField
        label="Телефон"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        error={!!errors.telefon}
        helperText={errors.telefon}
        sx={inputStyles}
      />

      <TextField
        label="Имя"
        value={fio}
        onChange={(e) => setFio(e.target.value)}
        error={!!errors.fio}
        helperText={errors.fio}
        sx={inputStyles}
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        sx={inputStyles}
      />

      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        sx={inputStyles}
      />
    </Stack>

    <Box
  mt={3}
  display="flex"
  justifyContent="center"
  alignItems="center"
  gap={2}
  width="100%"
>
  <Button type="submit" variant="contained" sx={{ mt: 3,  ml : 4  }}>
    Зарегистрироваться
  </Button>

  <Button onClick={onClose} variant="outlined" sx={{ mt: 3, ml : 3 }}>
    Закрыть
  </Button>
</Box>
  </form>
);
}
