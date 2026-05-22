import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Button,
  Stack
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "../api/axios";
import "../styles/Loyalty.css"; 

export default function Loyalty() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("/loyalty/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCard(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchCard();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!card) {
    return (
      <Typography textAlign="center" mt={10} fontSize="1.2rem">
        У вас нет карты лояльности
      </Typography>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: 2,
        py: 4,
        position: "relative"
      }}
    >
      {/* КНОПКА НАЗАД */}
    <IconButton
      onClick={() => navigate("/Lk")}
      sx={{
        position: "absolute",
        top: 20,
        left: 20,

        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",

        border: "1px solid rgba(255,79,163,0.15)",

        boxShadow:
          "0 8px 20px rgba(255,79,163,0.12)",

        color: "#ff4fa3",

        transition: "0.2s ease",

        "&:hover": {
          background: "#fff0f7",
          transform: "translateY(-2px)",
        },
      }}
    >
      <ArrowBackIcon />
    </IconButton>

      <Box className="card-container">
        <Box className="card-flip">
          {/* Лицевая сторона карты */}
          <Box className="card-front">
            <Typography variant="h6" color="white">Программа лояльности</Typography>
            <Typography variant="h5" color="white" mt={3}>
              № {card.nomer_karty}
            </Typography>
          </Box>

          {/* Задняя сторона карты */}
          <Box className="card-back">
            <Stack spacing={1.5} alignItems="center">
              <Typography variant="subtitle1" color="white">
                Дата создания: {formatDate(card.data_sozdaniya)}
              </Typography>
              <Typography variant="subtitle1" color="white">
                Бонусы: {card.balans_bonysov}
              </Typography>
              <Typography variant="subtitle1" color="white">
                Статус: {card.status}
              </Typography>

              {/* Кнопка "История начислений" */}
              <Button
                variant="contained"
                sx={{ 
              py: 2,
              borderRadius: "14px",

              fontWeight: 700,

              textTransform: "none",

              borderColor: "#e63e90",
                color: "#ff4fa3",
                background: "#fff0f7",

              boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",

              "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3"
              }
                }}
                onClick={() => alert("Пока что функционал не реализован")}
              >
                История начислений
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
