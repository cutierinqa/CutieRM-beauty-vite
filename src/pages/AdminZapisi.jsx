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
  MenuItem,
  Select, 
  InputLabel, 
  FormControl
} from "@mui/material";
import BackButton from "../components/BackButton";
import axios from "../api/axios";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";


      


export default function AdminRecords() {
    
  const token = localStorage.getItem("token");

  const emptyForm = {
    id_klienta: "",
    id_mastera: "",
    id_uslugi: "",
    extra_uslugi: [],
    data: "",
    vremya: "",
  };
  
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [extraUslugi, setExtraUslugi] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
    const [klients, setKlients] = useState([]);
    const [masters, setMasters] = useState([]);
    const [uslugi, setUslugi] = useState([]);
  const loadRecords = async () => {
    const res = await axios.get("/admin/records", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRecords(res.data || []);
  };
  useEffect(() => {
  loadRecords();
  loadLists();
}, []);
    
  const createRecord = async () => {
    await axios.post("/admin/records", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm(emptyForm);
    setAddOpen(false);
    loadRecords();
  };

  const deleteRecord = async (id) => {
    await axios.delete(`/admin/records/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadRecords();
  };

  const handleEdit = (record) => {
  setCurrentRecord({
  id_zapisi: record.id_zapisi,
  id_klienta: record.id_klienta,
  id_mastera: record.id_mastera,
  id_uslugi: record.id_uslugi,
  extra_uslugi: record.extra_uslugi_ids || [],
  data: record.data,
  vremya: record.vremya,
});

  setEditOpen(true);
  
};
        
  const handleSave = async () => {
    await axios.put(
      `/admin/records/${currentRecord.id_zapisi}`,
      currentRecord,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setEditOpen(false);
    loadRecords();
  };
    const loadLists = async () => {
    const [k, m, u, extra] = await Promise.all([
    axios.get("/admin/clients-list", {
      headers: { Authorization: `Bearer ${token}` }
    }),

    axios.get("/admin/masters-list", {
      headers: { Authorization: `Bearer ${token}` }
    }),

    axios.get("/admin/uslugi-list", {
      headers: { Authorization: `Bearer ${token}` }
    }),

    axios.get("/admin/uslugi-extra", {
      headers: { Authorization: `Bearer ${token}` }
    }),
]);

    setKlients(k.data);
    setMasters(m.data);
    setUslugi(u.data);
    setExtraUslugi(extra.data);
    };

  const renderFields = (data, setData) => (
  <>
    {/* КЛИЕНТ */}
    <FormControl fullWidth margin="dense">
      <InputLabel>Клиент</InputLabel>
      <Select
        value={data.id_klienta}
        label="Клиент"
        onChange={(e) =>
          setData({ ...data, id_klienta: e.target.value })
        }
      >
        {klients.map((k) => (
        <MenuItem key={k.id} value={k.id}>
            {k.name}
        </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* МАСТЕР */}
    <FormControl fullWidth margin="dense">
      <InputLabel>Мастер</InputLabel>
      <Select
        value={data.id_mastera}
        label="Мастер"
        onChange={(e) =>
          setData({ ...data, id_mastera: e.target.value })
        }
      >
        {masters.map((m) => (
    <MenuItem key={m.id} value={m.id}>
        {m.name}
    </MenuItem>
    ))}
      </Select>
    </FormControl>

    {/* УСЛУГА */}
    <FormControl fullWidth margin="dense">
      <InputLabel>Услуга</InputLabel>
      <Select
        value={data.id_uslugi}
        label="Услуга"
        onChange={(e) =>
          setData({ ...data, id_uslugi: e.target.value })
        }
      >
        {uslugi.map((u) => (
    <MenuItem key={u.id} value={u.id}>
        {u.name}
    </MenuItem>
    ))}
      </Select>
    </FormControl>
    <FormControl fullWidth margin="dense">

  <FormControl fullWidth margin="dense">

  <InputLabel id="extra-label">
    Доп услуги
  </InputLabel>

  <Select
    labelId="extra-label"
    multiple
    value={data.extra_uslugi || []}
    label="Доп услуги"

    onChange={(e) =>
      setData({
        ...data,
        extra_uslugi: e.target.value,
      })
    }

    renderValue={(selected) =>
      extraUslugi
        .filter((u) => selected.includes(u.id))
        .map((u) => u.name)
        .join(", ")
    }
  >
    {extraUslugi.map((u) => (
      <MenuItem key={u.id} value={u.id}>

        <Checkbox
          checked={
            data.extra_uslugi?.includes(u.id)
          }
        />

        <ListItemText primary={u.name} />

      </MenuItem>
    ))}
  </Select>
</FormControl>

</FormControl>

    {/* ДАТА */}
    <TextField
      fullWidth
      margin="dense"
      type="date"
      value={data.data}
      onChange={(e) =>
        setData({ ...data, data: e.target.value })
      }
    />

    {/* ВРЕМЯ */}
    <TextField
      fullWidth
      margin="dense"
      type="time"
      value={data.vremya}
      onChange={(e) =>
        setData({ ...data, vremya: e.target.value })
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
            Управление записями
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
            Добавить запись
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
                  "Клиент",
                  "Мастер",
                  "Услуга",
                  "Доп услуги", 
                  "Дата",
                  "Время",
                  "Действия",
                ].map((title, index) => (
                  <TableCell
                    key={index}
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
              {records.map((r) => (
                <TableRow key={r.id_zapisi}>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.klient}</TableCell>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.master}</TableCell>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.usluga}</TableCell>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.dop_uslugi || "—"}</TableCell>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.data}</TableCell>
                <TableCell align="center" sx={{ color: "black", borderColor: "#444" }}>{r.vremya}</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                        color: "black",
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
                        onClick={() => handleEdit(r)}
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
                        onClick={() =>
                          deleteRecord(r.id_zapisi)
                        }
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
            Добавить запись
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
              onClick={createRecord}
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
          <DialogTitle sx={{ fontWeight: 800, color: "#2b1d26" }}>
            Редактировать запись
          </DialogTitle>

          <DialogContent>
            {currentRecord &&
              renderFields(
                currentRecord,
                setCurrentRecord
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
              },}}>
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
  
}
