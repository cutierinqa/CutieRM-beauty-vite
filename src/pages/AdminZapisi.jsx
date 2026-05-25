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
    status: "Активна",
};
  const [tab, setTab] = useState("future"); 
  const [form, setForm] = useState(emptyForm);
  const [extraUslugi, setExtraUslugi] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [klients, setKlients] = useState([]);
  const [masters, setMasters] = useState([]);
  const [uslugi, setUslugi] = useState([]);
  const [futureRecords, setFutureRecords] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
  id_zapisi: "",
  summa: "",
  summa_fact: "",
  summa_bonus: "",
  tip_oplaty: "",
});

const loadRecords = async () => {
  const res = await axios.get("/admin/records", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const all = res.data || [];
  const now = new Date();
  const future = [];
  const past = [];

  all.forEach((r) => {
    const recordDate = new Date(
      `${r.data}T${r.vremya}`
    );
    if (recordDate >= now) {
      future.push(r);
    } else {
      past.push(r);}
  });

  setFutureRecords(future);
  setPastRecords(past);
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
  const currentList =
  tab === "future"
    ? futureRecords
    : pastRecords;

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
  const tipOptions = [
  { label: "Наличные", value: "Наличные" },
  { label: "Карта", value: "Карта" },
  { label: "Комбо", value: "Комбо" },
];
  const handlePayment = async () => {
  try {

    await axios.post(
      "/admin/payments",
      paymentForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Оплата сохранена");

    setPaymentOpen(false);

  } catch (err) {
    console.log(err);
    alert("Ошибка оплаты");
  }
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

  return (<>
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
            mb: 5,
          }}
          >
            Управление записями
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
           {/* ПЕРЕКЛЮЧАТЕЛЬ */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mb: 4,
  }}
>
  <Box
    sx={{
      display: "flex",
      gap: 2,

      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(12px)",

      borderRadius: "18px",
      padding: "8px",

      border: "1px solid rgba(255,79,163,0.12)",

      boxShadow:
        "0 10px 30px rgba(255,79,163,0.08)",
    }}
  >
    <button
      onClick={() => setTab("future")}
      style={{
        padding: "12px 22px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",

        fontWeight: 700,
        fontSize: "15px",

        transition: "0.2s ease",

        background:
          tab === "future"
            ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
            : "transparent",

        color:
          tab === "future"
            ? "white"
            : "#444",
      }}
    >
      Актуальные
    </button>

    <button
      onClick={() => setTab("past")}
      style={{
        padding: "12px 22px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",

        fontWeight: 700,
        fontSize: "15px",

        transition: "0.2s ease",

        background:
          tab === "past"
            ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
            : "transparent",

        color:
          tab === "past"
            ? "white"
            : "#444",
      }}
    >
      Прошедшие
    </button>
  </Box>
</Box>

{/* TABLE */}
<Box sx={{ overflowX: "auto" }}>
  <Table
    sx={{
      minWidth: 1100,

      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(14px)",

      borderRadius: "20px",

      border: "1px solid rgba(255,79,163,0.12)",
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell align="center">
          Клиент
        </TableCell>

        <TableCell align="center">
          Мастер
        </TableCell>

        <TableCell align="center">
          Услуга
        </TableCell>

        <TableCell align="center">
          Доп услуги
        </TableCell>

        <TableCell align="center">
          Дата
        </TableCell>

        <TableCell align="center">
          Время
        </TableCell>

        <TableCell align="center">
          {tab === "future"
            ? "Действия"
            : "Оплата"}
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {currentList.map((r) => (
        <TableRow key={r.id_zapisi}>
          <TableCell align="center">
            {r.klient}
          </TableCell>

          <TableCell align="center">
            {r.master}
          </TableCell>

          <TableCell align="center">
            {r.usluga}
          </TableCell>

          <TableCell align="center">
            {r.dop_uslugi || "—"}
          </TableCell>

          <TableCell align="center">
            {r.data}
          </TableCell>

          <TableCell align="center">
            {r.vremya}
          </TableCell>

          <TableCell align="center">
            {tab === "future" ? (
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
                  onClick={() =>
                    deleteRecord(r.id_zapisi)
                  }
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
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  setPaymentForm({
                    id_zapisi: r.id_zapisi,
                    summa: "",
                    summa_fact: "",
                    summa_bonus: "",
                    tip_oplaty: "",
                  });

                  setPaymentOpen(true);
                }}
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
                Оплата
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>
           

            
          </Table>
        </Box>

        {/* ADD DIALOG */}
        <Dialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          fullWidth
          PaperProps={{
              sx: {
          borderRadius: "22px",
          p: 2,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,79,163,0.15)",
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

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddOpen(false)} sx={{
            borderRadius: "14px",
            px: 3,
            fontWeight: 700,
            color: "#ff4fa3",
            border: "2px solid #ff4fa3",
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
              onClick={createRecord}
              sx={{
              borderRadius: "14px",
              px: 3,
              fontWeight: 700,
              color: "#ff4fa3",
              border: "2px solid #ff4fa3",
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
          fullWidth
          maxWidth="sm"
          PaperProps={{
          sx: {
            borderRadius: "22px",
            p: 2,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,79,163,0.15)",
            boxShadow: "0 20px 50px rgba(255,79,163,0.2)",
          },
        }}
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
          }}>
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>

<Dialog
  open={paymentOpen}
  onClose={() => setPaymentOpen(false)}
  fullWidth
>

  <DialogTitle>
    Оплата клиента
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      margin="dense"
      label="Полная сумма"
      type="number"
      value={paymentForm.summa}
      onChange={(e) =>
        setPaymentForm({
          ...paymentForm,
          summa: e.target.value,
        })
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    />

    <TextField
      fullWidth
      margin="dense"
      label="Оплачено деньгами"
      type="number"
      value={paymentForm.summa_fact}
      onChange={(e) =>
        setPaymentForm({
          ...paymentForm,
          summa_fact: e.target.value,
        })
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    />

    <TextField
      fullWidth
      margin="dense"
      label="Оплачено бонусами"
      type="number"
      value={paymentForm.summa_bonus}
      onChange={(e) =>
        setPaymentForm({
          ...paymentForm,
          summa_bonus: e.target.value,
        })
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
        },
      }}
    />

    <FormControl fullWidth margin="dense">

      <InputLabel>
        Тип оплаты
      </InputLabel>

      <Select
  value={paymentForm.tip_oplaty}
  onChange={(e) =>
    setPaymentForm({
      ...paymentForm,
      tip_oplaty: e.target.value,
    })
  }
>
  {tipOptions.map((t) => (
    <MenuItem key={t.value} value={t.value}>
      {t.label}
    </MenuItem>
  ))}
</Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setPaymentOpen(false)}
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
      
      Отмена
    </Button>

    <Button
      variant="contained"
      onClick={handlePayment}
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

</Dialog> </>
  );
  
}
