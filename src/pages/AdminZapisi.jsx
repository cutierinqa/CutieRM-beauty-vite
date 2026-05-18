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
            Управление записями
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
            Добавить запись
          </Button>
        </Stack>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table
            sx={{
              minWidth: 1000,
              backgroundColor: "#2a2a2a",
              borderRadius: 3,
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
              {records.map((r) => (
                <TableRow key={r.id_zapisi}>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.klient}</TableCell>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.master}</TableCell>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.usluga}</TableCell>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.dop_uslugi || "—"}</TableCell>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.data}</TableCell>
                <TableCell align="center" sx={{ color: "white", borderColor: "#444" }}>{r.vremya}</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                        color: "white",
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
                          deleteRecord(r.id_zapisi)
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
            Добавить запись
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
              onClick={createRecord}
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
