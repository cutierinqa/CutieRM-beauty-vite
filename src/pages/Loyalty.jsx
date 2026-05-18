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
      {/* Кнопка "Назад" */}
      <IconButton
        onClick={() => navigate("/Lk")}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "#f0f0f0",
          "&:hover": { backgroundColor: "#e0e0e0" },
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
                  backgroundColor: "#4b3126",
                  "&:hover": { backgroundColor: "#3a231a" },
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem"
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
