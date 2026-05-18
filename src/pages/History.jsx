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
  const [history, setHistory] = useState([]);
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

        setHistory(res.data);
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
      <IconButton
        onClick={() => navigate("/Lk")}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "#f0f0f0",
          "&:hover": { backgroundColor: "#e0e0e0" }
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <TableContainer component={Paper} sx={{ maxWidth: 900, width: "100%", p: 3, borderRadius: 3, boxShadow: 6 }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight={600}>
          История посещений
        </Typography>

        {history.length === 0 ? (
          <Typography textAlign="center" mt={2} fontSize="1.2rem">
            История посещений пуста
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Дата</b></TableCell>
                <TableCell><b>Время</b></TableCell>
                <TableCell><b>Мастер</b></TableCell>
                <TableCell><b>Услуга</b></TableCell>
                <TableCell><b>Доп услуги</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id_zapisi}>
                  <TableCell>{formatDate(item.data)}</TableCell>
                  <TableCell>{formatTime(item.vremya)}</TableCell>
                  <TableCell>{item.master}</TableCell>
                  <TableCell>{item.usluga}</TableCell>
                  <TableCell>{item.dop_uslugi || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}
