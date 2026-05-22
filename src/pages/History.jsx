import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "../api/axios";

export default function History() {
  const [history, setHistory] = useState({
  past: [],
  upcoming: [],
});

const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("/history/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res.data);

        setHistory({
          past: res.data.past || [],
          upcoming: res.data.upcoming || [],
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU");
  };

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5);
  };
  
  const currentList =
  tab === "upcoming"
    ? (history?.upcoming || [])
    : (history?.past || []);

  return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      px: 2,
      py: 5,
      background:
        "linear-gradient(135deg, #fff7fb, #ffeef6)",
      position: "relative",
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

    {/* ОСНОВНОЙ БЛОК */}
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      {/* ПЕРЕКЛЮЧАТЕЛЬ */}
      <Box
        sx={{
          display: "flex",
          gap: 2,

          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",

          borderRadius: "18px",

          padding: "8px",

          border:
            "1px solid rgba(255,79,163,0.12)",

          boxShadow:
            "0 10px 30px rgba(255,79,163,0.08)",
        }}
      >
        <button
          onClick={() => setTab("upcoming")}
          style={{
            padding: "12px 22px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",

            fontWeight: 700,
            fontSize: "15px",

            transition: "0.2s ease",

            background:
              tab === "upcoming"
                ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
                : "transparent",

            color:
              tab === "upcoming"
                ? "white"
                : "#444",

            boxShadow:
              tab === "upcoming"
                ? "0 8px 18px rgba(255,79,163,0.25)"
                : "none",
          }}
        >
          Предстоящие
        </button>

        <button
          onClick={() => setTab("past")}
          style={{
            padding: "12px 22px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",

            fontWeight: 700,
            fontSize: "15px",

            transition: "0.2s ease",

            background:
              tab === "past"
                ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
                : "transparent",

            color:
              tab === "past"
                ? "white"
                : "#444",

            boxShadow:
              tab === "past"
                ? "0 8px 18px rgba(255,79,163,0.25)"
                : "none",
          }}
        >
          Прошедшие
        </button>
      </Box>

      {/* ТАБЛИЦА */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxWidth: 1000,

          borderRadius: "28px",

          overflow: "hidden",

          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",

          border:
            "1px solid rgba(255,79,163,0.12)",

          boxShadow:
            "0 20px 50px rgba(255,79,163,0.12)",

          p: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 800,
            color: "#2b1d26",
            mb: 4,
            letterSpacing: "-1px",
          }}
        >
          История посещений
        </Typography>

        {currentList.length === 0 ? (
          <Typography
            align="center"
            sx={{
              py: 6,
              color: "#777",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            Записей пока нет ✨
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Дата",
                  "Время",
                  "Мастер",
                  "Услуга",
                  "Доп услуги",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 800,
                      fontSize: "15px",

                      color: "#ff4fa3",

                      borderBottom:
                        "2px solid rgba(255,79,163,0.15)",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {currentList.map((item) => (
                <TableRow
                  key={item.id_zapisi}
                  hover
                  sx={{
                    transition: "0.2s ease",

                    "&:hover": {
                      background:
                        "rgba(255,79,163,0.04)",
                    },
                  }}
                >
                  <TableCell>
                    {formatDate(item.data)}
                  </TableCell>

                  <TableCell>
                    {formatTime(item.vremya)}
                  </TableCell>

                  <TableCell>
                    {item.master}
                  </TableCell>

                  <TableCell>
                    {item.usluga}
                  </TableCell>

                  <TableCell>
                    {item.dop_uslugi || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  </Box>
  );
}
