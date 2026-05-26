import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Card,
  CardContent
} from "@mui/material";

import {
  LocalizationProvider,
  DateCalendar
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import DeleteIcon from "@mui/icons-material/Delete";

import axios from "../api/axios";

export default function AdminSchedule() {

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMaster, setSelectedMaster] = useState(null);

  const [masters, setMasters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [highlightedDays, setHighlightedDays] = useState([]);

  const [form, setForm] = useState({
    vremya_nachala: "",
    vremya_okonchaniya: "",
    tip_smeny: "day",
    kommentarii: ""
  });

  const shiftNames = {
    morning: "morning",
    day: "day",
    evening: "evening"
  };

  // =====================
  // LOAD MASTERS
  // =====================
  const loadMasters = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/admin/masters", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMasters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // LOAD SHIFTS
  // =====================
  const loadShifts = async () => {
    if (!selectedMaster) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/admin/shifts?date=${selectedDate.format("YYYY-MM-DD")}&masterId=${selectedMaster}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShifts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // CREATE SHIFT
  // =====================
  const createShift = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/admin/shifts",
        {
          id_mastera: selectedMaster,
          data_smeny: selectedDate.format("YYYY-MM-DD"),
          vremya_nachala: form.vremya_nachala,
          vremya_okonchaniya: form.vremya_okonchaniya,
          tip_smeny: form.tip_smeny,
          kommentarii: form.kommentarii
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      loadShifts();
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // DELETE SHIFT
  // =====================
  const deleteShift = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/admin/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      loadShifts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMasters();
  }, []);

  useEffect(() => {
    loadShifts();
  }, [selectedDate, selectedMaster]);

  return (
    <Box sx={{ minHeight: "100vh", p: 4, background: "linear-gradient(135deg,#eef6ff,#f7f7ff)" }}>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
        Админ — расписание мастеров
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 4 }}>

        {/* LEFT */}
        <Paper sx={{ p: 3, borderRadius: 4 }}>

          {/* MASTER SELECT */}
          <TextField
            select
            fullWidth
            label="Выбрать мастера"
            value={selectedMaster || ""}
            onChange={(e) => setSelectedMaster(e.target.value)}
            sx={{ mb: 3 }}
          >
            {masters.map((m) => (
              <MenuItem key={m.id_mastera} value={m.id_mastera}>
                {m.fio}
              </MenuItem>
            ))}
          </TextField>

          {/* CALENDAR */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </LocalizationProvider>

        </Paper>

        {/* RIGHT */}
        <Box>

          <Typography sx={{ mb: 2, fontWeight: 700 }}>
            {selectedDate.format("DD.MM.YYYY")}
          </Typography>

          {/* FORM */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>

            <Stack spacing={2}>

              <TextField
                type="time"
                label="Начало"
                InputLabelProps={{ shrink: true }}
                value={form.vremya_nachala}
                onChange={(e) => setForm({ ...form, vremya_nachala: e.target.value })}
              />

              <TextField
                type="time"
                label="Конец"
                InputLabelProps={{ shrink: true }}
                value={form.vremya_okonchaniya}
                onChange={(e) => setForm({ ...form, vremya_okonchaniya: e.target.value })}
              />

              <TextField
                select
                label="Тип"
                value={form.tip_smeny}
                onChange={(e) => setForm({ ...form, tip_smeny: e.target.value })}
              >
                <MenuItem value="morning">morning</MenuItem>
                <MenuItem value="day">day</MenuItem>
                <MenuItem value="evening">evening</MenuItem>
              </TextField>

              <TextField
                label="Комментарий"
                value={form.kommentarii}
                onChange={(e) => setForm({ ...form, kommentarii: e.target.value })}
              />

              <Button variant="contained" onClick={createShift}>
                Добавить смену
              </Button>

            </Stack>
          </Paper>

          {/* SHIFTS LIST */}
          <Stack spacing={2}>

            {shifts.map((shift) => (
              <Card key={shift.id_shift}>
                <CardContent>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>

                    <Box>
                      <Typography fontWeight={700}>
                        {shift.vremya_nachala} - {shift.vremya_okonchaniya}
                      </Typography>

                      <Typography>
                        {shiftNames[shift.tip_smeny]}
                      </Typography>

                      <Typography opacity={0.7}>
                        {shift.kommentarii}
                      </Typography>
                    </Box>

                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteShift(shift.id_shift)}
                    >
                      Удалить
                    </Button>

                  </Box>

                </CardContent>
              </Card>
            ))}

          </Stack>

        </Box>
      </Box>
    </Box>
  );
}