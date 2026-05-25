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

export default function SchedulePage() {

  const [selectedDate, setSelectedDate] =
    useState(dayjs());

  const [shifts, setShifts] = useState([]);

  const [form, setForm] = useState({
    vremya_nachala: "",
    vremya_okonchaniya: "",
    tip_smeny: "Рабочая",
    kommentarii: ""
  });

  useEffect(() => {
    loadShifts();
  }, [selectedDate]);

  const loadShifts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/master/shifts?date=${selectedDate.format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShifts(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const createShift = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "/master/shifts",
        {
          data_smeny: selectedDate.format("YYYY-MM-DD"),

          vremya_nachala:
            form.vremya_nachala,

          vremya_okonchaniya:
            form.vremya_okonchaniya,

          tip_smeny:
            form.tip_smeny,

          kommentarii:
            form.kommentarii
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadShifts();

    } catch (err) {
      console.error(err);
    }
  };

  const deleteShift = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `/master/shifts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadShifts();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,

        background:
          "linear-gradient(135deg,#fff7fb,#ffeef6)"
      }}
    >

      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 800,
          color: "#ff4fa3"
        }}
      >
        Расписание
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "350px 1fr",

          gap: 4
        }}
      >

        {/* КАЛЕНДАРЬ */}

        <Paper
          sx={{
            p: 3,
            borderRadius: "28px",

            background:
              "rgba(255,255,255,0.7)",

            backdropFilter:
              "blur(18px)"
          }}
        >

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
          >

            <DateCalendar
              value={selectedDate}
              onChange={(newValue) =>
                setSelectedDate(newValue)
              }
            />

          </LocalizationProvider>

        </Paper>

        {/* ПРАВАЯ ЧАСТЬ */}

        <Box>

          {/* ФОРМА */}

          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: "28px",

              background:
                "rgba(255,255,255,0.7)",

              backdropFilter:
                "blur(18px)"
            }}
          >

            <Stack spacing={2}>

              <TextField
                label="Начало"
                type="time"
                InputLabelProps={{
                  shrink: true
                }}

                value={form.vremya_nachala}

                onChange={(e) =>
                  setForm({
                    ...form,
                    vremya_nachala:
                      e.target.value
                  })
                }
              />

              <TextField
                label="Конец"
                type="time"

                InputLabelProps={{
                  shrink: true
                }}

                value={form.vremya_okonchaniya}

                onChange={(e) =>
                  setForm({
                    ...form,
                    vremya_okonchaniya:
                      e.target.value
                  })
                }
              />

              <TextField
                select
                label="Тип смены"

                value={form.tip_smeny}

                onChange={(e) =>
                  setForm({
                    ...form,
                    tip_smeny:
                      e.target.value
                  })
                }
              >

                <MenuItem value="Рабочая">
                  Рабочая
                </MenuItem>

                <MenuItem value="Выходной">
                  Выходной
                </MenuItem>

                <MenuItem value="Отпуск">
                  Отпуск
                </MenuItem>

              </TextField>

              <TextField
                label="Комментарий"

                multiline
                rows={3}

                value={form.kommentarii}

                onChange={(e) =>
                  setForm({
                    ...form,
                    kommentarii:
                      e.target.value
                  })
                }
              />

              <Button
                variant="contained"
                onClick={createShift}

                sx={{
                  py: 1.5,
                  borderRadius: "14px",

                  background:
                    "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
                }}
              >
                Добавить смену
              </Button>

            </Stack>

          </Paper>

          {/* СПИСОК СМЕН */}

          <Stack spacing={2}>

            {shifts.map((shift) => (

              <Card
                key={shift.id_shift}

                sx={{
                  borderRadius: "24px",

                  background:
                    shift.tip_smeny === "Рабочая"
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(40,40,40,0.8)",

                  color:
                    shift.tip_smeny === "Рабочая"
                      ? "#2b1d26"
                      : "white"
                }}
              >

                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",

                      alignItems: "center"
                    }}
                  >

                    <Box>

                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "20px"
                        }}
                      >
                        {shift.vremya_nachala}
                        {" - "}
                        {shift.vremya_okonchaniya}
                      </Typography>

                      <Typography>
                        {shift.tip_smeny}
                      </Typography>

                      <Typography
                        sx={{
                          opacity: 0.7
                        }}
                      >
                        {shift.kommentarii}
                      </Typography>

                    </Box>

                    <Button
                      color="error"

                      startIcon={<DeleteIcon />}

                      onClick={() =>
                        deleteShift(
                          shift.id_shift
                        )
                      }
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