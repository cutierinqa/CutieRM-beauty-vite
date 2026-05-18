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

export default function AdminClients() {
  const token = localStorage.getItem("token");

  const emptyForm = {
    fio: "",
    telefon: "",
    email: "",
    kolichestvo_vizitov: "",
    data_pervogo_vizita: "",
    data_poslednego_vizita: "",
  };

  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  const loadClients = async () => {
    const res = await axios.get("/admin/clients", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setClients(res.data || []);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const createClient = async () => {
    await axios.post("/admin/clients", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm(emptyForm);
    setAddOpen(false);
    loadClients();
  };

  const deleteClient = async (id) => {
    await axios.delete(`/admin/clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadClients();
  };

  const handleEdit = (client) => {
  setCurrentClient({
    id_klienta: client.id_klienta,
    fio: client.fio || "",
    telefon: client.telefon || "",
    email: client.email || "",
    kolichestvo_vizitov: client.kolichestvo_vizitov || "",
    data_pervogo_vizita: client.data_pervogo_vizita || "",
    data_poslednego_vizita: client.data_poslednego_vizita || "",
  });

  setEditOpen(true);
};

  const handleSave = async () => {
    await axios.put(
      `/admin/clients/${currentClient.id_klienta}`,
      currentClient,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setEditOpen(false);
    loadClients();
  };

  const renderFields = (data, setData) =>
    Object.keys(emptyForm).map((field) => (
      <TextField
        key={field}
        fullWidth
        margin="dense"
        label={
          field.includes("data")
            ? ""
            : field.replaceAll("_", " ")
        }
        placeholder={
          field.includes("data")
            ? field.replaceAll("_", " ")
            : ""
        }
        type={
          field.includes("data")
            ? "date"
            : "text"
        }
        InputLabelProps={
          field.includes("data")
            ? { shrink: true }
            : {}
        }
        value={data[field] || ""}
        onChange={(e) =>
          setData({
            ...data,
            [field]: e.target.value,
          })
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
          maxWidth: 1300,
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
            Управление клиентами
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
            Добавить клиента
          </Button>
        </Stack>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table
            sx={{
              minWidth: 1100,
              backgroundColor: "#2a2a2a",
              borderRadius: 3,
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  "ФИО",
                  "Телефон",
                  "Email",
                  "Кол-во визитов",
                  "Первый визит",
                  "Последний визит",
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
              {clients.map((c) => (
                <TableRow key={c.id_klienta}>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.fio}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.telefon}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.email}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.kolichestvo_vizitov}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.data_pervogo_vizita}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      borderColor: "#444",
                    }}
                  >
                    {c.data_poslednego_vizita}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderColor: "#444",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEdit(c)}
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
                        onClick={() =>
                          deleteClient(c.id_klienta)
                        }
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
          <DialogTitle>
            Добавить клиента
          </DialogTitle>

          <DialogContent>
            {renderFields(form, setForm)}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setAddOpen(false)}>
              Отмена
            </Button>

            <Button
              variant="contained"
              onClick={createClient}
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
            Редактировать клиента
          </DialogTitle>

          <DialogContent>
            {currentClient &&
              renderFields(
                currentClient,
                setCurrentClient
              )}
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