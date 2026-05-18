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
      backgroundColor: "#121212",
    }}
  >
    <Paper
      sx={{
        width: "100%",
        maxWidth: 1200,
        p: 4,
        borderRadius: 4,
        backgroundColor: "#1e1e1e",
        color: "white",
        boxShadow: 6,
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
            backgroundColor: "#684325",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#5a3820",
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
            minWidth: 900,
            backgroundColor: "#2a2a2a",
            borderRadius: 3,
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
                  key={index}
                  align="center"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    borderColor: "#444",
                    backgroundColor: "#333",
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
                  sx={{ color: "white", borderColor: "#444" }}
                >
                  {m.fio}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white", borderColor: "#444" }}
                >
                  {m.dolzhnost}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white", borderColor: "#444" }}
                >
                  {m.kvalifikaciya}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white", borderColor: "#444" }}
                >
                  {m.telefon}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white", borderColor: "#444" }}
                >
                  {m.email}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white", borderColor: "#444" }}
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
                        backgroundColor: "#4b3126",
                        "&:hover": {
                          backgroundColor: "#3a231a",
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
      >
        <DialogTitle>Добавить мастера</DialogTitle>

        <DialogContent>
          {renderFields(form, setForm)}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={createMaster}
            sx={{
              backgroundColor: "#684325",
              "&:hover": {
                backgroundColor: "#5a3820",
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
          <Button onClick={() => setEditOpen(false)}>
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#684325",
              "&:hover": {
                backgroundColor: "#5a3820",
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