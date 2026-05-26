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

 useEffect(() => {
  loadShifts();
  loadMonthShifts();
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
  const loadMonthShifts = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `/master/shifts/month?month=${selectedDate.format("YYYY-MM")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setHighlightedDays(res.data);

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
      loadMonthShifts();

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
    borderRadius: "32px",
    background:
      "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    border:
      "1px solid rgba(255,79,163,0.15)",
    boxShadow:
      "0 20px 50px rgba(255,79,163,0.12)",
    height: "fit-content"
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
  sx={{
    "& .MuiPickersDay-root": {
      fontWeight: 600,
      borderRadius: "50%"
    },

    "& .Mui-selected": {
      background:
        "linear-gradient(135deg,#ff4fa3,#ff8ec6) !important",

      color: "white"
    }
  }}
  slotProps={{
    day: (ownerState) => {

      const date =
        ownerState.day.format("YYYY-MM-DD");

      const hasShift =
        highlightedDays.includes(date);

      return {
        sx: {
          position: "relative",

          ...(hasShift && {
            "&::after": {
              content: '""',

              position: "absolute",

              bottom: 3,
              left: "50%",

              transform:
                "translateX(-50%)",

              width: 6,
              height: 6,

              borderRadius: "50%",

              background:
                "#ff4fa3"
            }
          })
        }
      };
    }
  }}
/>

          </LocalizationProvider>

        </Paper>

        {/* ПРАВАЯ ЧАСТЬ */}

        <Box>
          <Typography
  sx={{
    mb: 2,
    fontWeight: 700,
    fontSize: "20px",
    color: "#ff4fa3"
  }}
>
  Выбранная дата:
  {" "}
  {selectedDate.format("DD.MM.YYYY")}
</Typography>

          {/* ФОРМА */}

          <Paper
  sx={{
    p: 4,
    mb: 4,

    borderRadius: "32px",

    background:
      "rgba(255,255,255,0.72)",

    backdropFilter: "blur(20px)",

    border:
      "1px solid rgba(255,79,163,0.15)",

    boxShadow:
      "0 20px 50px rgba(255,79,163,0.12)"
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
                sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",

                  background: "white"
                }
              }}
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
                sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",

                  background: "white"
                }
              }}
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
                sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",

                  background: "white"
                }
              }}
              >

                <MenuItem value="morning">
                  morning
                </MenuItem>

                <MenuItem value="day">
                  day
                </MenuItem>

                <MenuItem value="evening">
                  evening
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
                sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",

                  background: "white"
                }
              }}
              />

              <Button
                variant="contained"
                onClick={createShift}

                sx={{
                py: 1.5,
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
  borderRadius: "28px",

  background:
    shift.tip_smeny === "day"
      ? "rgba(255,255,255,0.75)"
      : "linear-gradient(135deg,#2f2f2f,#4a4a4a)",

  color:
    shift.tip_smeny === "day"
      ? "#2b1d26"
      : "white",

  border:
    "1px solid rgba(255,79,163,0.12)",

  boxShadow:
    "0 10px 30px rgba(255,79,163,0.10)"
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
                        {shiftNames[shift.tip_smeny]}
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
                          shift.id_shift)}
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