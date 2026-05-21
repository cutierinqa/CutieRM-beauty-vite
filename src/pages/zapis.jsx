import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Modal,
  Select,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Contacts() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [allMasters, setAllMasters] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [mainServices, setMainServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [extraSelected, setExtraSelected] = useState([]);
  const [visibleMasters, setVisibleMasters] = useState([]);
  const [selectedMainService, setSelectedMainService] = useState("");

  const [openAuthModal, setOpenAuthModal] =
    useState(false);

  const [form, setForm] = useState({
    id_mastera: "",
    id_uslugi: "",
    data: "",
    vremya: "",
  });

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
  try {
    const [mastersRes, mainRes, extraRes] = await Promise.all([
      axios.get("/admin/masters-list"),
      axios.get("/admin/uslugi-main"),
      axios.get("/admin/uslugi-extra"),
    ]);

    setAllMasters(mastersRes.data || []);
    setMainServices(mainRes.data || []);
    setExtraServices(extraRes.data || []);
    setVisibleMasters(mastersRes.data || []);
  } catch (err) {
    console.log(err);
  }
};
  
useEffect(() => {
  let masters = [...allMasters];

  if (selectedRole) {
    masters = masters.filter(
      m => m.kvalifikaciya === selectedRole
    );
  }

  if (selectedMainService) {

    // педикюр без стажёров
    const selectedService = mainServices.find(
      s => s.id === selectedMainService
    );

    if (
      selectedService?.name.includes("Педикюр")
    ) {
      masters = masters.filter(
        m => m.kvalifikaciya !== "Стажёр"
      );
    }
  }

  setVisibleMasters(masters);

}, [
  selectedRole,
  selectedMainService,
  allMasters
]);

  const handleCreateRecord = async () => {
    if (!token || role !== "client") {
      setOpenAuthModal(true);
      return;
    }

    try {
      await axios.post(
        "/admin/records",
        {
          id_mastera: form.id_mastera,
          id_uslugi: form.id_uslugi,
          extra_uslugi: extraSelected || [],
          data: form.data,
          vremya: form.vremya,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
);

      alert("Вы успешно записались ❤️");

      setForm({
        id_mastera: "",
        id_uslugi: "",
        data: "",
        vremya: "",
      });

      setSelectedMainService("");
      setSelectedRole("");
      setExtraSelected([]);
    } catch (err) {
      console.log(err);
      alert("Ошибка при создании записи");
    }
  };

  const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#2b1d26",

    backgroundColor: "rgba(255,255,255,0.7)",

    borderRadius: "14px",

    transition: "0.25s ease",

    "& fieldset": {
      borderColor: "rgba(255, 79, 163, 0.2)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(255, 79, 163, 0.5)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#ff4fa3",
      boxShadow: "0 0 0 4px rgba(255,79,163,0.15)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#6e5a66",
  },

  "& .MuiSvgIcon-root": {
    color: "#ff4fa3",
  },
};

  return (
    <>
      <Box
      sx={{
        minHeight: "100vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        px: 2,

        background:
          "linear-gradient(135deg, #fff7fb, #ffeef6)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 550,

          borderRadius: 5,

          p: 5,

          background: "rgba(255,255,255,0.7)",

          backdropFilter: "blur(16px)",

          border: "1px solid rgba(255,79,163,0.15)",

          boxShadow:
            "0 15px 40px rgba(255,79,163,0.12)",

          color: "#2b1d26",
        }}
      >
          <Typography
            variant="h4"
            align="center"
            mb={4}
            sx={{
              fontWeight: 800,
              color: "#2b1d26",
              letterSpacing: "-1px",
              mb: 2,
            }}
          >
            Запись на процедуру
          </Typography>

          <Stack spacing={3}>
            <TextField
                select
                label="Услуга"
                value={selectedMainService || ""}
                onChange={(e) => {
                  setSelectedMainService(e.target.value);
                  setForm({ ...form, id_mastera: "", id_uslugi: e.target.value });
                }}
                fullWidth
                sx={fieldStyles}
              >
                {mainServices.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel sx={{ color: "#ccc" }}>
                  Дополнительные услуги
                </InputLabel>

                <Select
                  multiple
                  value={extraSelected}
                  onChange={(e) => {
                    setExtraSelected(e.target.value);
                  }}
                  renderValue={(selected) =>
                    extraServices
                      .filter((s) => selected.includes(s.id))
                      .map((s) => s.name)
                      .join(", ")
                  }
                >
                  {extraServices.map((s) => (
                    <MenuItem key={s.id} value={s.id}>

                      <Checkbox
                        checked={extraSelected.includes(s.id)}
                      />

                      <ListItemText primary={s.name} />

                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            <TextField
              select
              label="Квалификация мастера"
              value={selectedRole ?? ""}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setForm({ ...form, id_mastera: "" });
              }}
              fullWidth
              sx={fieldStyles}
            >
              <MenuItem value="Топ-мастер">Топ-мастер</MenuItem>
              <MenuItem value="Мастер">Мастер</MenuItem>
              <MenuItem value="Стажёр">Стажёр</MenuItem>
            </TextField>

            <TextField
              select
              label="Выберите мастера"
              value={form.id_mastera || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  id_mastera: e.target.value,
                })
              }
              fullWidth
              sx={fieldStyles}
            >
              {visibleMasters.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>

            

            <TextField
              type="date"
              label="Дата"
              InputLabelProps={{ shrink: true }}
              value={form.data}
              onChange={(e) =>
                setForm({
                  ...form,
                  data: e.target.value,
                })
              }
              fullWidth
              sx={fieldStyles}
            />

            <TextField
              type="time"
              label="Время"
              InputLabelProps={{ shrink: true }}
              value={form.vremya}
              onChange={(e) =>
                setForm({
                  ...form,
                  vremya: e.target.value,
                })
              }
              fullWidth
              sx={fieldStyles}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateRecord}
              sx={{
                py: 1.7,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: 3,

                background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

                boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

                transition: "0.25s ease",

                "&:hover": {
                  background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 30px rgba(255,79,163,0.35)",
                },
              }}
            >
              Записаться
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* MODAL */}
      <Modal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            width: 400,

            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",

            color: "#2b1d26",

            borderRadius: 4,

            boxShadow: "0 20px 50px rgba(255,79,163,0.2)",

            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
          >
            Требуется авторизация
          </Typography>

          <Typography mb={3}>
            Для записи на процедуру
            необходимо войти в аккаунт!
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#684325",

              "&:hover": {
                backgroundColor: "#5a3820",
              },
            }}
          >
            Перейти ко входу
          </Button>
        </Box>
      </Modal>
      
    </>
  );
}