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
  Avatar,
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
    id_kategoriiklient: client.id_kategoriiklient|| "",
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
      borderColor: "#ff4fa3",

      boxShadow: "0 20px 50px rgba(255,79,163,0.12)",

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
            fontWeight: 800,
            textAlign: "center",
            mb: 5,
          }}
        >
          Управление клиентами
        </Typography>
          <Button
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: "14px",
              fontWeight: 700,
              textTransform: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",
              boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                transform: "translateY(-2px)",
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

                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(14px)",

                borderRadius: "20px",

                overflow: "hidden",

                border: "1px solid rgba(255,79,163,0.12)",
              }}
            >
            <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
              <TableRow>
                {[
                  "ФИО",
                  "Телефон",
                  "Email",
                  "Категория",
                  "Кол-во визитов",
                  "Первый визит",
                  "Последний визит",
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
              {clients.map((c) => (
                <TableRow key={c.id_klienta}>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      borderColor: "#444",
                    }}
                  >
                    {c.fio}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      borderColor: "#444",
                    }}
                  >
                    {c.telefon}
                  </TableCell>

                 <TableCell
  align="center"
  sx={{
    color: "black",
    borderColor: "#444",
  }}
>
  {c.email}
</TableCell>

<TableCell
  align="center"
  sx={{
    color: "black",
    borderColor: "#444",
  }}
>
  {c.kategoriya}
</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      borderColor: "#444",
                    }}
                  >
                    {c.kolichestvo_vizitov}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      borderColor: "#444",
                    }}
                  >
                    {c.data_pervogo_vizita}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
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
                          background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "10px",

                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Редактировать
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                         onClick={() => deleteClient(c.id_klienta)} 
                        sx={{
                          background: "linear-gradient(135deg, #ff6b8b, #ff3d6e)",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "10px",

                          "&:hover": {
                            transform: "translateY(-2px)",
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
          <DialogTitle sx={{ fontWeight: 800, color: "#2b1d26" }}>
            Добавить клиента
          </DialogTitle>

          <DialogContent>
            {renderFields(form, setForm)}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setAddOpen(false)} sx={{
            
              flex: 1,

              py: 1.5,
              borderRadius: "14px",

              fontWeight: 350,
              fontSize: "16px",
              textTransform: "none",

              color: "#fff",

              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

              transition: "0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                transform: "translateY(-2px)",
                boxShadow: "0 16px 35px rgba(255,79,163,0.35)",
              },

              "&:active": {
                transform: "scale(0.98)",
              },
            }}>
              Отмена
            </Button>

            <Button
              variant="contained"
              onClick={createClient}
              sx={{
              
              flex: 1,

              py: 1.5,
              borderRadius: "14px",

              fontWeight: 350,
              fontSize: "16px",
              textTransform: "none",

              color: "#fff",

              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

              transition: "0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                transform: "translateY(-2px)",
                boxShadow: "0 16px 35px rgba(255,79,163,0.35)",
              },

              "&:active": {
                transform: "scale(0.98)",
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
            <Button onClick={() => setEditOpen(false)} sx={{
              mt: 1,
              flex: 1,

              py: 1.5,
              borderRadius: "14px",

              fontWeight: 350,
              fontSize: "16px",
              textTransform: "none",

              color: "#fff",

              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

              transition: "0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                transform: "translateY(-2px)",
                boxShadow: "0 16px 35px rgba(255,79,163,0.35)",
              },

              "&:active": {
                transform: "scale(0.98)",
              },
            }}>
              Отмена
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
              mt: 1,
              flex: 1,

              py: 1.5,
              borderRadius: "14px",

              fontWeight: 350,
              fontSize: "16px",
              textTransform: "none",

              color: "#fff",

              background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

              boxShadow: "0 10px 25px rgba(255,79,163,0.25)",

              transition: "0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #e63e90, #ff70b3)",
                transform: "translateY(-2px)",
                boxShadow: "0 16px 35px rgba(255,79,163,0.35)",
              },

              "&:active": {
                transform: "scale(0.98)",
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