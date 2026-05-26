import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider
} from "@mui/material";

import axios from "../api/axios";

export default function AdminModeration() {
  const token = localStorage.getItem("token");

  const [tab, setTab] = useState("incidents");
  const [incidents, setIncidents] = useState([]);
  const [reviews, setReviews] = useState([]);


  // ======================
  // LOAD
  // ======================

  const loadIncidents = async () => {
    const res = await axios.get("/admin/incidents", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIncidents(res.data || []);
  };

  const loadReviews = async () => {
    const res = await axios.get("/admin/reviews", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReviews(res.data || []);
  };

  useEffect(() => {
    loadIncidents();
    loadReviews();
  }, []);

  // ======================
  // ACTIONS
  // ======================

  const updateStatus = async (id, status) => {
    await axios.put(
      `/admin/incidents/${id}?status=${status}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadIncidents();
  };

  const deleteReview = async (id) => {
    await axios.delete(`/admin/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    loadReviews();
  };

  // ======================
  // UI
  // ======================

  const statusColor = (s) => {
    switch (s) {
      case "новый":
        return "warning";
      case "в работе":
        return "info";
      case "решено":
        return "success";
      case "отклонено":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg,#fff7fb,#ffeef6)"
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: "28px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,79,163,0.15)"
        }}
      >
        {/* HEADER */}
        <Typography
          sx={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#ff4fa3",
            mb: 2
          }}
        >
          CRM Модерация
        </Typography>

        {/* SWITCH */}
<Box
  sx={{
    display: "flex",
    gap: 2,

    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",

    borderRadius: "18px",
    padding: "8px",

    border: "1px solid rgba(255,79,163,0.12)",
    boxShadow: "0 10px 30px rgba(255,79,163,0.08)",
    width: "fit-content",
    mb: 3
  }}
>
  <button
    onClick={() => setTab("incidents")}
    style={{
      padding: "12px 22px",
      borderRadius: "14px",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "15px",
      transition: "0.2s ease",

      background:
        tab === "incidents"
          ? "linear-gradient(135deg,#ff4fa3,#ff7ac1)"
          : "transparent",

      color: tab === "incidents" ? "white" : "#444",

      boxShadow:
        tab === "incidents"
          ? "0 8px 18px rgba(255,79,163,0.25)"
          : "none"
    }}
  >
    Жалобы
  </button>

  <button
    onClick={() => setTab("reviews")}
    style={{
      padding: "12px 22px",
      borderRadius: "14px",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "15px",
      transition: "0.2s ease",

      background:
        tab === "reviews"
          ? "linear-gradient(135deg,#ff4fa3,#ff7ac1)"
          : "transparent",

      color: tab === "reviews" ? "white" : "#444",

      boxShadow:
        tab === "reviews"
          ? "0 8px 18px rgba(255,79,163,0.25)"
          : "none"
    }}
  >
    Отзывы
  </button>
</Box>

        {/* ====================== */}
        {/* INCIDENTS */}
        {/* ====================== */}

        {tab === "incidents" && (
          <Stack spacing={2} mt={3}>
            {incidents.map((i) => (
              <Card
                key={i.id_incidenta}
                sx={{
                  borderRadius: "24px",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 10px 30px rgba(255,79,163,0.08)"
                }}
              >
                <CardContent>

                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={800}>
                        {i.tip_incidenta}
                      </Typography>

                      <Typography sx={{ opacity: 0.7, mt: 0.5 }}>
                        {i.opisanie}
                      </Typography>

                      <Typography sx={{ fontSize: 12, mt: 1, opacity: 0.6 }}>
                        {i.data}
                      </Typography>
                    </Box>

                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => updateStatus(i.id_incidenta, "в работе")}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: 700,
                        fontSize: "13px",
                        textTransform: "none",
                        border: "2px solid #f3ff4f",
                        color: "#000000",
                        background: "#f0f19b",
                        "&:hover": {
                        background: "#ff4fa3",
                        color: "#fff",
                        },
                    }}
                    >
                      В работу
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => updateStatus(i.id_incidenta, "решено")}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: 700,
                        fontSize: "13px",
                        textTransform: "none",
                        border: "2px solid #5eff4f",
                        color: "#000000",
                        background: "#c5f19b",
                        "&:hover": {
                        background: "#ff4fa3",
                        color: "#fff",
                        },
                    }}
                    > 
                      Решено
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => updateStatus(i.id_incidenta, "отклонено")}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: 700,
                        fontSize: "13px",
                        textTransform: "none",
                        border: "2px solid #ff4f4f",
                        color: "#000000",
                        background: "#f19b9b",
                        "&:hover": {
                        background: "#ff4fa3",
                        color: "#fff",
                        },
                    }}
                    >
                      Отклонить
                    </Button>
                  </Stack>

                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* ====================== */}
        {/* REVIEWS */}
        {/* ====================== */}

        {tab === "reviews" && (
          <Stack spacing={2} mt={3}>
            {reviews.map((r) => (
              <Card
                key={r.id_otzyva}
                sx={{
                  borderRadius: "24px",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }}
              >
                <CardContent>

                  {/* HEADER BLOCK */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={800}>
                      ⭐ {r.ocenka}/5
                    </Typography>

                    <Typography sx={{ fontSize: 12, opacity: 0.6 }}>
                      {r.data_otzyva}
                    </Typography>
                  </Stack>

                  {/* WHO + SERVICE */}
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                    Мастер: {r.master || "—"}
                    </Typography>

                    <Typography sx={{ opacity: 0.7 }}>
                    Услуга: {r.usluga || "—"}
                    </Typography>
                  </Box>

                  {/* TEXT */}
                  <Typography sx={{ mt: 2 }}>
                    {r.tekst_otzyva}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => deleteReview(r.id_otzyva)}
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
                    Удалить отзыв
                  </Button>

                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

      </Paper>
    </Box>
  );
}