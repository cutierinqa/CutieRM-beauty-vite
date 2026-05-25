import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { TextField, Button, Box, Typography, Modal, Stack } from "@mui/material";

export default function Login() {
  const [telefon, setTelefon] = useState("+7");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);

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
  "& .MuiInputBase-input": {
    color: "#2b1d26",
  },

  "& .MuiInputLabel-root": {
    color: "#6e5a66",
  },

  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.7)",

    borderRadius: "14px",

    transition: "0.25s ease",

    "& fieldset": {
      borderColor: "rgba(255, 79, 163, 0.2)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(255, 79, 163, 0.5)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#ff4fa3",
      boxShadow: "0 0 0 4px rgba(255,79,163,0.15)",
    },
  },

  "& .MuiSvgIcon-root": {
    color: "#ff4fa3",
  },
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
        borderColor: "#ff4fa3",
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
            py: 1.5,
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "14px",
            color: "#ff4fa3",
            border: "2px solid #ff4fa3",
            background: "#fff0f7",
            borderColor: "#e63e90",
            boxShadow:
            "0 10px 25px rgba(255,79,163,0.25)",
            "&:hover": {
            borderColor: "#e63e90",
            color: "white",
            background: "#ff4fa3",
            boxShadow:
            "0 10px 25px rgba(255,79,163,0.25)",
            }}}
        >
          Войти
        </Button>
      </form>

      <Typography align="center" mt={3} sx={{ color: "#6e5a66" }}>
  <Box
  sx={{
    mt: 2,
    display: "flex",
    gap: 2,          // расстояние между кнопками
    width: "100%",
  }}
>
  <Button
    variant="text"
    onClick={() => setShowForgot(true)}
    sx={{
      flex: 1,

      py: 1.3,
      fontSize: "16px",
      fontWeight: 700,
      borderRadius: "14px",

      border: "2px solid #ff4fa3",
      color: "#ff4fa3",
      background: "#fff0f7",

      boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

      textTransform: "none",

      "&:hover": {
        borderColor: "#e63e90",
        color: "white",
        background: "#ff4fa3",
        boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
      },
    }}
  >
    Забыли пароль?
  </Button>

  <Button
    onClick={() => setShowRegister(true)}
    variant="contained"
    sx={{
      flex: 1,

      py: 1.3,
      fontSize: "16px",
      fontWeight: 700,
      borderRadius: "14px",

      border: "2px solid #ff4fa3",
      color: "#ff4fa3",
      background: "#fff0f7",

      boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

      textTransform: "none",

      "&:hover": {
        borderColor: "#e63e90",
        color: "white",
        background: "#ff4fa3",
        boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
      },
    }}
  >
    Зарегистрироваться
  </Button>
</Box>
      </Typography>

      <Modal open={showForgot} onClose={() => setShowForgot(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 380,
      bgcolor: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 20px 50px rgba(255,79,163,0.2)",
      p: 4,
      borderRadius: "20px",
    }}
  >
    <Typography
      variant="h6"
      align="center"
      mb={2}
      sx={{
        fontWeight: 800,
        mb: 2,
        background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Восстановление пароля
    </Typography>

    <ForgotPasswordForm onClose={() => setShowForgot(false)} />
  </Box>
</Modal>

      <Modal open={showRegister} onClose={() => setShowRegister(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            width: 420,

            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",

            boxShadow: "0 20px 50px rgba(255,79,163,0.2)",

            p: 4,

            borderRadius: "20px",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            mb={2}
            sx={{
              fontWeight: 800,
              mb:2,
              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",

              letterSpacing: "-0.5px",
            }}
          >
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
  "& .MuiInputBase-input": {
    color: "#2b1d26",
  },
  "& .MuiInputLabel-root": {
    color: "#6e5a66",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: "14px",
    transition: "0.25s ease",
    "& fieldset": {
      borderColor: "rgba(255, 79, 163, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 79, 163, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff4fa3",
      boxShadow: "0 0 0 4px rgba(255,79,163,0.15)",
    },
  },
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

    <Box mt={2} display="flex" gap={2} width="100%">
  <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 1,

            py: 1.5,
            fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                border: "2px solid #ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
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
          Зарегистрироваться
        </Button>

  <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
              mt: 1,
              flex: 1,

              py: 1.5,
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
          Закрыть
        </Button>
</Box>
  </form>
);
}

function ForgotPasswordForm({ onClose }) {
  const [telefon, setTelefon] = useState("+7");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Если номер существует — код отправлен (фиктивно)");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Введите номер телефона"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
        />
      </Stack>

      <Box mt={3} display="flex" gap={2}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
                mt:2,
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                border: "2px solid #ff4fa3",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }}}
        >
          Получить код
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
                mt:1,
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                border: "2px solid #ff4fa3",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }}}
        >
          Закрыть
        </Button>
      </Box>
    </form>
  );
}
