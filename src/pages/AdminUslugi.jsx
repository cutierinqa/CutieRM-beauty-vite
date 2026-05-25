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

export default function AdminUslugi() {

  const token = localStorage.getItem("token");

  const emptyForm = {
    nazvanie: "",
    opisanie: "",
    cena: "",
  };

  const [uslugi, setUslugi] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [addOpen, setAddOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [currentUsluga, setCurrentUsluga] = useState(null);

  const loadUslugi = async () => {
    try {

      const res = await axios.get("/admin/uslugi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUslugi(res.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUslugi();
  }, []);

  const createUsluga = async () => {
    try {

      await axios.post("/admin/uslugi", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm(emptyForm);

      setAddOpen(false);

      loadUslugi();

    } catch (err) {
      console.error(err);
    }
  };

  const deleteUsluga = async (id) => {
    try {

      await axios.delete(`/admin/uslugi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadUslugi();

    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (usluga) => {
    setCurrentUsluga({ ...usluga });

    setEditOpen(true);
  };

  const handleSave = async () => {
    try {

      await axios.put(
        `/admin/uslugi/${currentUsluga.id_uslugi}`,
        currentUsluga,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditOpen(false);

      loadUslugi();

    } catch (err) {
      console.error(err);
    }
  };

  const renderFields = (data, setData) => (
    <>
      <TextField
        fullWidth
        margin="dense"
        label="Название услуги"
        value={data.nazvanie || ""}
        onChange={(e) =>
          setData({
            ...data,
            nazvanie: e.target.value,
          })
        }
      />

      <TextField
        fullWidth
        margin="dense"
        label="Описание"
        multiline
        rows={3}
        value={data.opisanie || ""}
        onChange={(e) =>
          setData({
            ...data,
            opisanie: e.target.value,
          })
        }
      />

      <TextField
        fullWidth
        margin="dense"
        label="Цена"
        type="number"
        value={data.cena || ""}
        onChange={(e) =>
          setData({
            ...data,
            cena: e.target.value,
          })
        }
      />
    </>
  );

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
          Управление услугами
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
                "Название услуги",
                "Описание",
                "Цена",
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
            {uslugi.map((u, index) => (
              <TableRow key={index}>
                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {u.nazvanie_uslugi}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {u.opisanie}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "black", borderColor: "#444" }}
                >
                  {u.cena}
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
                      color="error"
                      onClick={() => deleteMaster(m.id_mastera)}
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
        <DialogTitle sx={{ fontWeight: 800, color: "#2b1d26" }}>Добавить услугу</DialogTitle>

        <DialogContent>
          {renderFields(form, setForm)}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}sx={{
            
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
            onClick={createUslugu}
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
          Редактировать услугу
        </DialogTitle>

        <DialogContent>
          {currentUsluga &&
            renderFields(currentUsluga, setCurrentUsluga)}
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