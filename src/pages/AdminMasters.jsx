import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import axios from "../api/axios";

export default function AdminMasters() {
  const token = localStorage.getItem("token");

  const emptyForm = {
    fio: "",
    dolzhnost: "",
    kvalifikaciya: "",
    data_nachala_stazha: "",
    telefon: "",
    email: "",
    foto: "",
  };

  const [masters, setMasters] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentMaster, setCurrentMaster] = useState(null);

  const loadMasters = async () => {
    const res = await axios.get("/admin/masters", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMasters(res.data || []);
  };

  useEffect(() => {
    loadMasters();
  }, []);

  const createMaster = async () => {
    await axios.post("/admin/masters", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm(emptyForm);
    setAddOpen(false);
    loadMasters();
  };

  const deleteMaster = async (id) => {
    await axios.delete(`/admin/masters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadMasters();
  };

  const handleEdit = (master) => {
    setCurrentMaster({ ...master });
    setEditOpen(true);
  };

  const handleSave = async () => {
    await axios.put(
      `/admin/masters/${currentMaster.id_mastera}`,
      currentMaster,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEditOpen(false);
    loadMasters();
  };

      const renderFields = (data, setData) =>
        Object.keys(emptyForm).map((field) => (
          <TextField
      key={field}
      fullWidth
      margin="dense"
      label={
        field === "data_nachala_stazha"
          ? ""
          : field.replaceAll("_", " ")
      }
      placeholder={
        field === "data_nachala_stazha"
          ? "Дата начала стажа"
          : ""
      }
      type={field === "data_nachala_stazha" ? "date" : "text"}
      InputLabelProps={
        field === "data_nachala_stazha"
          ? { shrink: true }
          : {}
      }
      value={data[field] || ""}
      onChange={(e) =>
        setData({ ...data, [field]: e.target.value })
      }
    />
    ));

  return (
  <Box
  sx={{
    minHeight: "100vh",

    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",

    px: 2,
    py: 5,

    background: "linear-gradient(135deg, #fff7fb, #ffeef6)",
  }}
>
  <Paper
    sx={{
      width: "100%",
      maxWidth: 1300,

      p: 4,

      borderRadius: "28px",

      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(18px)",

      border: "1px solid rgba(255,79,163,0.15)",

      boxShadow: "0 20px 50px rgba(255,79,163,0.12)",
      borderColor: "#ff4fa3",

      color: "#2b1d26",
    }}
  >
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={4}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Управление мастерами
        </Typography>

        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
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
          Добавить мастера
        </Button>
      </Stack>

      {/* TABLE */}
      <Box sx={{ overflowX: "auto" }}>
        <Table
              sx={{
                minWidth: 1100,

                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(14px)",

                borderRadius: "20px",

                overflow: "hidden",

                border: "1px solid rgba(255,79,163,0.12)",
              }}
        >
          <TableHead>
            <TableRow>
              {[
                "ФИО",
                "Должность",
                "Квалификация",
                "Телефон",
                "Email",
                "Дата начала стажа",
                "Действия",
              ].map((title, index) => (
                <TableCell
                    align="center"
                    sx={{
                      color: "#2b1d26",
                      fontWeight: 600,
                      borderColor: "rgba(255,79,163,0.1)",
                    }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {masters.map((m, index) => (
              <TableRow key={index}>
                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.fio}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.dolzhnost}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.kvalifikaciya}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.telefon}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.email}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {m.data_nachala_stazha}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ borderColor: "#444" }}
                >
                  <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEdit(m)}
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
                      Редактировать
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => deleteMaster(m.id_mastera)}
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
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* ADD DIALOG */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
            PaperProps={{
              sx: {
                borderRadius: "20px",
                p: 2,

                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(16px)",

                boxShadow: "0 20px 50px rgba(255,79,163,0.2)",
              },
            }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#2b1d26" }}>Добавить мастера</DialogTitle>

        <DialogContent>
          {renderFields(form, setForm)}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}sx={{
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
          }}>
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={createMaster}
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
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
      >
        <DialogTitle>
          Редактировать мастера
        </DialogTitle>

        <DialogContent>
          {currentMaster &&
            renderFields(currentMaster, setCurrentMaster)}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{
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
          }}>
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
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
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  </Box>
);
}