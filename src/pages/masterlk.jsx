
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HistoryIcon from "@mui/icons-material/History";
import axios from "../api/axios";


export default function LkMaster() {
  const [master, setMaster] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadMaster();
  }, []);

  const loadMaster = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/master/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMaster(res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  if (!master) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
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
        py: 4,

        background:
          "linear-gradient(135deg, #fff7fb, #ffeef6)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 700,

          p: 5,

          borderRadius: "28px",

          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(18px)",

          border:
            "1px solid rgba(255,79,163,0.15)",

          boxShadow:
            "0 20px 50px rgba(255,79,163,0.12)",

          textAlign: "center"
        }}
      >
        {/* ФОТО */}
        <Avatar
          src={master.photo}
          alt={master.fio}
          sx={{
            width: 140,
            height: 140,

            mx: "auto",
            mb: 3,

            border: "4px solid #ff8ec6",

            boxShadow:
              "0 10px 30px rgba(255,79,163,0.25)"
          }}
        />

        {/* ИМЯ */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#2b1d26"
          }}
        >
          {master.fio}
        </Typography>

        {/* СПЕЦИАЛИЗАЦИЯ */}
        <Typography
          sx={{
            mt: 1,
            color: "#666",
            fontSize: "18px"
          }}
        >
          {master.specializaciya}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ИНФА */}
        <Stack spacing={2}>
          <Typography>
            <b>Телефон:</b> {master.telefon}
          </Typography>

          <Typography>
            <b>Email:</b> {master.email}
          </Typography>

          <Typography>
            <b>Стаж:</b> {master.stazh} лет
          </Typography>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* КНОПКИ */}
        <Stack spacing={2}>
          <Button
            startIcon={<EventIcon />}
            variant="contained"
            onClick={() => navigate("/master/zapisi")}
            sx={{
              py: 1.5,
              borderRadius: "14px",

              fontWeight: 700,

              textTransform: "none",

              background:
                "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",

              "&:hover": {
                transform: "translateY(-2px)"
              }
            }}
          >
            Актуальные записи
          </Button>

          <Button
            startIcon={<ScheduleIcon />}
            variant="contained"
            onClick={() => navigate("/master/raspisanie")}
            sx={{
              py: 1.5,
              borderRadius: "14px",

              fontWeight: 700,

              textTransform: "none",

              background:
                "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",

              "&:hover": {
                transform: "translateY(-2px)"
              }
            }}
          >
            Расписание
          </Button>

          <Button
            startIcon={<HistoryIcon />}
            variant="contained"
            onClick={() => navigate("/master/history")}
            sx={{
              py: 1.5,
              borderRadius: "14px",

              fontWeight: 700,

              textTransform: "none",

              background:
                "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",

              "&:hover": {
                transform: "translateY(-2px)"
              }
            }}
          >
            История записей
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              mt: 2,

              py: 1.5,

              borderRadius: "14px",

              fontWeight: 700,

              textTransform: "none",

              borderColor: "#ff4fa3",

              color: "#ff4fa3",

              "&:hover": {
                borderColor: "#e63e90",
                background: "#fff0f7"
              }
            }}
          >
            На главную
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}