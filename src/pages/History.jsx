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
   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Rating,
  Stack,
  IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "../api/axios";
export default function History() {
  const [history, setHistory] = useState({
  past: [],
  upcoming: [],
});
const INCIDENT_TYPES = [
  "жалоба",
  "аллергия",
  "повреждение",
  "травма",
  "прочее",
];
 
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [extraServices, setExtraServices] = useState([]);
  const navigate = useNavigate();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [viewMode, setViewMode] = useState(false);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incidentText, setIncidentText] = useState("");
  const [incidentType, setIncidentType] = useState("жалоба");
  const [incidentRecord, setIncidentRecord] = useState(null);
 
  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const res = await axios.get("/admin/uslugi-extra");
        setExtraServices(res.data || []);
      } catch (e) {
        console.log(e);
      }
    };

    fetchExtra();
  }, []);

    const parseExtra = (extra) => {
  if (!extra) return [];

  if (Array.isArray(extra)) {
    return extra.map(Number);
  }

  try {
    return JSON.parse(extra).map(Number);
  } catch {
    return String(extra)
      .split(",")
      .map(s => Number(s.trim()))
      .filter(Boolean);
  }
};

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

    const submitReview = async () => {
  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "/history/review",
      {
        id_zapisi: selectedRecord.id_zapisi,
        ocenka: reviewRating,
        tekst_otzyva: reviewText
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setReviewOpen(false);

    setReviewText("");

    setReviewRating(5);

    alert("Отзыв отправлен ❤️");

  } catch (err) {
    console.log(err);
    alert("Ошибка");
  }
};

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
                  "Отзыв",
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
                {parseExtra(item.extra_uslugi).length
                  ? extraServices
                      .filter(u =>
                        parseExtra(item.extra_uslugi).includes(Number(u.id))
                      )
                      .map(u => u.name)
                      .join(", ")
                  : "—"}
              </TableCell>
              <TableCell>
  <Stack
    spacing={1}
    alignItems="center"
    justifyContent="center"
  >
    {/* ОТЗЫВ (только прошедшие) */}
    {tab === "past" && (
      item.has_review ? (
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedRecord(item);
            setReviewRating(item.review.ocenka);
            setReviewText(item.review.tekst_otzyva);
            setViewMode(true);
            setReviewOpen(true);
          }}
          sx={{
            borderRadius: "16px",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "none",
            border: "2px solid #ff4fa3",
            color: "#ff4fa3",
            background: "#fff",
            "&:hover": {
              background: "#ff4fa3",
              color: "#fff",
            },
          }}
        >
          Мой отзыв
        </Button>
      ) : (
        <Button
          onClick={() => {
            setSelectedRecord(item);
            setReviewText("");
            setReviewRating(5);
            setViewMode(false);
            setReviewOpen(true);
          }}
          sx={{
            borderRadius: "16px",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "none",
            border: "2px solid #ff4fa3",
            color: "#ff4fa3",
            background: "#fff",
            "&:hover": {
              background: "#ff4fa3",
              color: "#fff",
            },
          }}
        >
          Оставить отзыв
        </Button>
      )
    )}

    {/* ЖАЛОБА (только прошедшие) */}
{tab === "past" && (
  item.has_incident ? (
    <Button
      variant="outlined"
      onClick={() => {
        setIncidentRecord(item);
        setIncidentType(item.incident.tip_incidenta);
        setIncidentText(item.incident.opisanie);
        setIncidentOpen(true);
      }}
      sx={{
        borderRadius: "16px",
        fontWeight: 700,
        fontSize: "13px",
        textTransform: "none",
        border: "2px solid #ff4fa3",
        color: "#ff4fa3",
        background: "#fff",
        "&:hover": {
          background: "#ff4fa3",
          color: "#fff",
        },
      }}
    >
      Моя жалоба
    </Button>
  ) : (
    <Button
      onClick={() => {
        setIncidentRecord(item);
        setIncidentType("жалоба");
        setIncidentText("");
        setIncidentOpen(true);
      }}
      sx={{
        borderRadius: "16px",
        fontWeight: 700,
        fontSize: "13px",
        textTransform: "none",
        border: "2px solid #ff4fa3",
        color: "#ff4fa3",
        background: "#fff",
        "&:hover": {
          background: "#ff4fa3",
          color: "#fff",
        },
      }}
    >
      Пожаловаться 🚨
    </Button>
  )
)}
  </Stack>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
          <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
        sx: {
          borderRadius: "22px",
          p: 2,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,79,163,0.15)",
          boxShadow: "0 20px 50px rgba(255,79,163,0.2)",
        },
      }}
      >
        <DialogTitle>
        {viewMode
          ? "Ваш отзыв"
          : "Оставить отзыв"}
      </DialogTitle>

        <DialogContent>
  <Stack spacing={2} sx={{ mt: 1 }}>

    <Box sx={{ textAlign: "center" }}>
      <Rating
        value={reviewRating}
        readOnly={viewMode}
        onChange={(e, newValue) => setReviewRating(newValue)}
        size="large"
      />
    </Box>

    <TextField
      fullWidth
      multiline
      rows={4}
      label="Ваш отзыв"
      value={reviewText}
      disabled={viewMode}
      onChange={(e) => setReviewText(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    />

  </Stack>
</DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
  <Button
    onClick={() => setReviewOpen(false)}
    sx={{
      borderRadius: "14px",
      px: 3,
      fontWeight: 700,
      color: "#ff4fa3",
      border: "2px solid #ff4fa3",
      background: "#fff",
      "&:hover": {
        background: "#ff4fa3",
        color: "#fff",
      },
    }}
  >
    Закрыть
  </Button>

  {!viewMode && (
    <Button
      onClick={submitReview}
      sx={{
        borderRadius: "14px",
        px: 3,
        fontWeight: 700,
        color: "#fff",
        background: "linear-gradient(135deg,#ff4fa3,#ff8ec6)",
        boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      Отправить
    </Button>
  )}
</DialogActions>
      </Dialog>
      <Dialog
  open={incidentOpen}
  onClose={() => setIncidentOpen(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{
  sx: {
    borderRadius: "22px",
    p: 2,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,79,163,0.15)",
    boxShadow: "0 20px 50px rgba(255,79,163,0.2)",
  },
}}
>
  <DialogTitle>Жалоба на инцидент</DialogTitle>

  <DialogContent>
  <Stack spacing={2} sx={{ mt: 1 }}>

    <TextField
      select
      fullWidth
      label="Тип проблемы"
      value={incidentType}
      onChange={(e) => setIncidentType(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    >
      {INCIDENT_TYPES.map((t) => (
        <MenuItem key={t} value={t}>
          {t}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      fullWidth
      multiline
      rows={4}
      label="Описание"
      value={incidentText}
      onChange={(e) => setIncidentText(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    />

  </Stack>
</DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
  <Button
    onClick={() => setIncidentOpen(false)}
    sx={{
      borderRadius: "14px",
      px: 3,
      fontWeight: 700,
      color: "#ff4fa3",
      border: "2px solid #ff4fa3",
      background: "#fff",
      "&:hover": {
        background: "#ff4fa3",
        color: "#fff",
      },
    }}
  >
    Отмена
  </Button>

  <Button
    onClick={async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          "/history/incident",
          {
            id_zapisi: incidentRecord.id_zapisi,
            tip_incidenta: incidentType,
            opisanie: incidentText,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIncidentOpen(false);
        setIncidentText("");
        alert("Жалоба отправлена 🚨");
      } catch (err) {
        console.log(err);
        alert("Ошибка");
      }
    }}
    sx={{
      borderRadius: "14px",
      px: 3,
      fontWeight: 700,
      color: "#fff",
      background: "linear-gradient(135deg,#ff4fa3,#ff8ec6)",
      boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    }}
  >
    Отправить
  </Button>
</DialogActions>
</Dialog>
  </Box>
  );
  
}
