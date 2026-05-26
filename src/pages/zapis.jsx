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
  FormControl,
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
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectedDolzhnost, setSelectedDolzhnost] = useState("");
  const [openAuthModal, setOpenAuthModal] = useState(false);

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

  const handleSelectShift = (shift) => {
  setSelectedShift(shift);

  setForm({
    id_mastera: shift.id_mastera || "",
    id_uslugi: "",
    data: shift.data || "",
    vremya: shift.vremya || "",
  });
};

  useEffect(() => {
    const slot = localStorage.getItem("selectedSlot");

    if (slot) {
      const parsed = JSON.parse(slot);

      setForm((prev) => ({
        id_mastera: parsed.id_mastera || "",
        id_uslugi: parsed.id_uslugi || "",
        data: parsed.data || "",
        vremya: parsed.vremya || "",
      }));

      setSelectedMaster(parsed.fio_mastera);
      setSelectedDolzhnost(parsed.dolzhnost);
      setSelectedRole(parsed.kvalifikaciya);
      localStorage.removeItem("selectedSlot");
    }
  }, []);

  useEffect(() => {
    let masters = [...allMasters];

    if (selectedRole) {
      masters = masters.filter(
        (m) => m.kvalifikaciya === selectedRole
      );
    }

    if (selectedMainService) {
      const selectedService = mainServices.find(
        (s) => s.id === selectedMainService
      );

      if (selectedService?.name.includes("Педикюр")) {
        masters = masters.filter(
          (m) => m.kvalifikaciya !== "Стажёр"
        );
      }
    }

    setVisibleMasters(masters);
  }, [selectedRole, selectedMainService, allMasters]);

  const handleCreateRecord = async () => {

  // 🔥 ПРОВЕРКА АВТОРИЗАЦИИ
  if (!token) {
    setOpenAuthModal(true);
    return;
  }

  try {
    if (!form.id_uslugi) {
      alert("Выберите услугу");
      return;
    }

    if (!form.id_mastera || !form.data || !form.vremya) {
      alert("Сначала выберите окно записи");
      return;
    }

      await axios.post(
        "/admin/records",
        {
          id_mastera: Number(form.id_mastera),
          id_uslugi: Number(form.id_uslugi),
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

      // 🔥 1. очищаем form
      setForm({
        id_mastera: "",
        id_uslugi: "",
        data: "",
        vremya: "",
      });

      // 🔥 2. очищаем UI состояния
      setSelectedMainService("");
      setExtraSelected([]);
      setSelectedMaster("");
      setSelectedDolzhnost("");
      setSelectedRole("");
      setSelectedShift(null);

      // 🔥 3. очищаем localStorage (ВАЖНО!)
      localStorage.removeItem("selectedSlot");
    } catch (err) {
      console.log(err);
      alert("Ошибка при создании записи");
    }
  };

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "var(--text-primary)",
      backgroundColor: "var(--bg-secondary)",
      borderRadius: "14px",
      transition: "0.25s ease",
      "& fieldset": {
        borderColor: "var(--border-default)",
        
      },
      "&:hover fieldset": {
        borderColor: "var(--border-hover)",
        color: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--accent)",
        
        boxShadow: "0 0 0 4px rgba(255,79,163,0.15)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--text-secondary)",
    },
    "& .MuiSvgIcon-root": {
      color: "var(--accent)",
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
          background: "var(--bg-main)",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 550,
            borderRadius: 5,
            p: 5,
            background: "var(--bg-secondary)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border)",
            boxShadow: "0 15px 40px var(--shadow)",
            color: "var(--accent2)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            mb={4}
            sx={{
              fontWeight: 800,
              letterSpacing: "-1px",
              mb: 2,
            }}
          >
            Запись на процедуру
          </Typography>

          <Stack spacing={3}>
            {/* Услуги */}
            <TextField
              select
              label="Услуга"
              value={selectedMainService || ""}
              onChange={(e) => {
              const val = Number(e.target.value);

              setSelectedMainService(val);

              setForm((prev) => ({ 
                ...prev,
                id_uslugi: val,
              }));
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

            {/* Доп. услуги */}
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel>Дополнительные услуги</InputLabel>

              <Select
                multiple
                value={extraSelected}
                onChange={(e) => setExtraSelected(e.target.value)}
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

            {/* Мастер */}
            {selectedMaster && (
              <div style={{
                marginBottom: "2 px",
                padding: "12px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                color: "var(--text-main:)",
                fontWeight: 700,
              }}>
                <div>Мастер: {selectedMaster}</div>
                <div style={{ color: "var(--text-primary)", marginTop: "4px" }}>
                  {selectedDolzhnost}
                </div>
                <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  {selectedRole ?? ""}
                </div>
              </div>
            )}

            {/* Время */}
            {form.data && form.vremya && (
              <Box
  sx={{
    padding: "15px",
    borderRadius: "14px",
    fontWeight: 700,
    textAlign: "center",
    border: "1px solid transparent",
    transition: "0.2s ease",
    borderColor: "var(--border-hover)",
      color: "var(--text-main)",
      background: "var(--bg-secondary)",
  }}
>
  Выбранное время: {form.data} | {form.vremya}
</Box>
            )}

            {/* Кнопка */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateRecord}
              sx={{
                py: 1.7,
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: "20px",
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
          <Typography variant="h6" mb={2}>
            Требуется авторизация
          </Typography>

          <Typography mb={3}>
            Для записи на процедуру необходимо войти в аккаунт!
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