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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

import axios from "../api/axios";

export default function AdminUsers() {
  const token = localStorage.getItem("token");

  const emptyForm = {
    fio: "",
    email: "",
    telefon: "",
    password: "",
    id_role: ""
  };

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // =========================
  // LOAD USERS + ROLES
  // =========================
  const loadUsers = async () => {
    const res = await axios.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsers(res.data || []);
  };

  const loadRoles = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get("/admin/roles", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setRoles(res.data || []);
};

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // =========================
  // CREATE USER
  // =========================
  const createUser = async () => {
    await axios.post("/admin/users", form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setForm(emptyForm);
    setAddOpen(false);
    loadUsers();
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    await axios.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    loadUsers();
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (user) => {
    setCurrentUser({
      ...user
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    await axios.put(
      `/admin/users/${currentUser.id_user}`,
      currentUser,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setEditOpen(false);
    loadUsers();
  };

  // =========================
  // RENDER FORM
  // =========================
  const renderFields = (data, setData) => (
    <>
      <TextField
        fullWidth
        margin="dense"
        label="ФИО"
        value={data.fio}
        onChange={(e) =>
          setData({ ...data, fio: e.target.value })
        }
      />

      <TextField
        fullWidth
        margin="dense"
        label="Телефон"
        value={data.telefon}
        onChange={(e) =>
          setData({ ...data, telefon: e.target.value })
        }
      />

      <TextField
        fullWidth
        margin="dense"
        label="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      {/* РОЛЬ */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Роль</InputLabel>

        <Select
          value={data.id_role || ""}
          label="Роль"
          onChange={(e) =>
            setData({
              ...data,
              id_role: e.target.value
            })
          }
        >
          {roles.map((r) => (
            <MenuItem key={r.id_role} value={r.id_role}>
              {r.nazvanie_role}
            </MenuItem>
          ))}
        </Select>
        </FormControl>

      {/* пароль только при создании */}
      {"password" in data && (
        <TextField
          fullWidth
          margin="dense"
          type="password"
          label="Пароль"
          value={data.password}
          onChange={(e) =>
            setData({
              ...data,
              password: e.target.value
            })
          }
        />
      )}
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
      color: "#2b1d26",
      borderColor: "#ff4fa3",
      
      
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
            
          }}
          >
            Управление пользователями
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
            Добавить пользователя
          </Button>
        </Stack>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
  <Table
    sx={{
      minWidth: 1100,
      width: "100%",
      borderCollapse: "collapse",

      "& .MuiTableCell-root": {
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        textAlign: "center",
        color: "#2b1d26",
      },

      "& .MuiTableHead-root .MuiTableCell-root": {
        fontWeight: 700,
        background: "rgba(255,79,163,0.08)",
      },

      "& .MuiTableRow-root:hover": {
        background: "rgba(255,79,163,0.04)",
      },
    }}
  >
    <TableHead>
      <TableRow>
        {[
          "ФИО",
          "Телефон",
          "Email",
          "Роль",
          "Активность",
          "Действия"
        ].map((t) => (
          <TableCell key={t}>
            {t}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {users.map((u) => (
        <TableRow key={u.id_user}>
          <TableCell>{u.fio}</TableCell>

          <TableCell>{u.telefon}</TableCell>

          <TableCell>{u.email}</TableCell>

          <TableCell>{u.role}</TableCell>

          <TableCell>
            {u.aktivnost ? "Да" : "Нет"}
          </TableCell>

          <TableCell align="center">
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleEdit(u)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

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
                  onClick={() => deleteUser(u.id_user)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff6b8b, #ff3d6e)",

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
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>

        {/* ADD */}
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
            Добавить пользователя
          </DialogTitle>

          <DialogContent>
            {renderFields(form, setForm)}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setAddOpen(false)}
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
            }}>
              Отмена
            </Button>

            <Button
              onClick={createUser}
              variant="contained"
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
              Создать
            </Button>
          </DialogActions>
        </Dialog>

        {/* EDIT */}
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800, color: "#2b1d26" }}>
            Редактировать пользователя
          </DialogTitle>

          <DialogContent>
            {currentUser &&
              renderFields(
                currentUser,
                setCurrentUser
              )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditOpen(false)}sx={{
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
              onClick={handleSave}
              variant="contained"
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
              },}}>
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}