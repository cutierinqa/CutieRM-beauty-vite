
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
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
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

  const [openCurrent, setOpenCurrent] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);

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

  const loadCurrentRecords = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "/master/current-records",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCurrentRecords(res.data);
    setOpenCurrent(true);

  } catch (err) {
    console.error(err);
  }
};

const loadHistoryRecords = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "/master/history-records",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setHistoryRecords(res.data);
    setOpenHistory(true);

  } catch (err) {
    console.error(err);
  }
};

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
          src={master.foto}
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
          
           {master.dolzhnost}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color: "#666",
            fontSize: "18px"
          }}
        >
          
           {master.kvalifikaciya}
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
            <b>Стаж:</b> {master.stazh} 
          </Typography>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* КНОПКИ */}
        <Stack spacing={2}>
          <Button
            startIcon={<EventIcon />}
            variant="contained"
            onClick={loadCurrentRecords}
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
                borderColor: "#e63e90",
                color: "#ff4fa3",
                background: "#fff0f7"
              }
            }}
          >
            Актуальные записи
          </Button>

          <Button
            startIcon={<ScheduleIcon />}
            variant="contained"
            onClick={() => navigate("/master/schedule")}
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
                borderColor: "#e63e90",
                color: "#ff4fa3",
                background: "#fff0f7"
              }
            }}
          >
            Расписание
          </Button>

          <Button
            startIcon={<HistoryIcon />}
            variant="contained"
            onClick={loadHistoryRecords}
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
                borderColor: "#e63e90",
                color: "#ff4fa3",
                background: "#fff0f7"
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

              color: "white",

              "&:hover": {
                borderColor: "#e63e90",
                color: "#ff4fa3",
                background: "#fff0f7"
              }
            }}
          >
            На главную
          </Button>
        </Stack>
      </Paper>
      <Dialog
  open={openCurrent}
  onClose={() => setOpenCurrent(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Актуальные записи
  </DialogTitle>

  <DialogContent>

    <TableContainer>

      <Table>

        <TableHead>
          <TableRow>

            <TableCell>Клиент</TableCell>
            <TableCell>Услуга</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Время</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>

          {currentRecords.map((item) => (
            <TableRow key={item.id_zapisi}>

              <TableCell>
                {item.klient}
              </TableCell>

              <TableCell>
                {item.usluga}
              </TableCell>

              <TableCell>
                {item.data}
              </TableCell>

              <TableCell>
                {item.vremya}
              </TableCell>

            </TableRow>
          ))}

        </TableBody>

      </Table>

    </TableContainer>

  </DialogContent>
</Dialog>
<Dialog
  open={openHistory}
  onClose={() => setOpenHistory(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    История записей
  </DialogTitle>

  <DialogContent>

    <TableContainer>

      <Table>

        <TableHead>
          <TableRow>

            <TableCell>Клиент</TableCell>
            <TableCell>Услуга</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Время</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>

          {historyRecords.map((item) => (
            <TableRow key={item.id_zapisi}>

              <TableCell>
                {item.klient}
              </TableCell>

              <TableCell>
                {item.usluga}
              </TableCell>

              <TableCell>
                {item.data}
              </TableCell>

              <TableCell>
                {item.vremya}
              </TableCell>

            </TableRow>
          ))}

        </TableBody>

      </Table>

    </TableContainer>

  </DialogContent>
</Dialog>
    </Box>
  );
}