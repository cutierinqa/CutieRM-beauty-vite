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
  Chip
} from "@mui/material";

import axios from "../api/axios";

export default function AdminModeration() {
  const token = localStorage.getItem("token");

  const [tab, setTab] = useState(0);
  const [incidents, setIncidents] = useState([]);
  const [reviews, setReviews] = useState([]);

  // ======================
  // LOAD DATA
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
  // INCIDENT ACTIONS
  // ======================

  const updateStatus = async (id, status) => {
    await axios.put(
      `/admin/incidents/${id}?status=${status}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    loadIncidents();
  };

  // ======================
  // REVIEWS ACTIONS
  // ======================

  const deleteReview = async (id) => {
    await axios.delete(`/admin/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    loadReviews();
  };

  // ======================
  // UI HELPERS
  // ======================

  const getStatusColor = (status) => {
    switch (status) {
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

  // ======================
  // RENDER
  // ======================

  return (
    <Box sx={{ minHeight: "100vh", p: 4, background: "#fafafa" }}>
      <Paper sx={{ p: 3, borderRadius: "20px" }}>
        
        {/* HEADER */}
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          CRM Модерация
        </Typography>

        {/* TABS */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Жалобы" />
          <Tab label="Отзывы" />
        </Tabs>

        {/* ====================== */}
        {/* INCIDENTS */}
        {/* ====================== */}

        {tab === 0 && (
          <Stack spacing={2} mt={3}>
            {incidents.map((i) => (
              <Card key={i.id_incidenta} sx={{ borderRadius: "16px" }}>
                <CardContent>

                  <Stack direction="row" justifyContent="space-between">
                    
                    <Box>
                      <Typography fontWeight={700}>
                        {i.tip_incidenta}
                      </Typography>

                      <Typography sx={{ opacity: 0.7 }}>
                        {i.opisanie}
                      </Typography>

                      <Typography sx={{ mt: 1, fontSize: 12 }}>
                        {i.data}
                      </Typography>
                    </Box>

                    <Chip
                      label={i.status}
                      color={getStatusColor(i.status)}
                    />

                  </Stack>

                  {/* ACTIONS */}
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => updateStatus(i.id_incidenta, "в работе")}
                    >
                      В работу
                    </Button>

                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      onClick={() => updateStatus(i.id_incidenta, "решено")}
                    >
                      Решено
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => updateStatus(i.id_incidenta, "отклонено")}
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

        {tab === 1 && (
          <Stack spacing={2} mt={3}>
            {reviews.map((r) => (
              <Card key={r.id_otzyva} sx={{ borderRadius: "16px" }}>
                <CardContent>

                  <Typography fontWeight={700}>
                    ⭐ Оценка: {r.ocenka}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    {r.tekst_otzyva}
                  </Typography>

                  <Typography sx={{ fontSize: 12, opacity: 0.6, mt: 1 }}>
                    {r.data_otzyva}
                  </Typography>

                  <Button
                    sx={{ mt: 2 }}
                    color="error"
                    variant="outlined"
                    onClick={() => deleteReview(r.id_otzyva)}
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