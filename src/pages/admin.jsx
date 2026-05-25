import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "../api/axios";


export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableType, setTableType] = useState("");
  const [admin, setAdmin] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [mastersList, setMastersList] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState("all");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchAdmin();
  }, [navigate]);

  const formatTime = (t) => {
  if (!t) return "—";
  return t.toString().slice(0, 5); // HH:mm
};


  const fetchData = async (type) => {
    try {
      if (tableType === type) {
        setTableType("");
        setData([]);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let url = "";

      switch (type) {
        case "clients":
          url = "/admin/clients";
          break;
        case "masters":
          url = "/admin/masters";
          break;
        case "uslugi":
          url = "/admin/uslugi";
          break;
        case "schedule":
          url = "/admin/schedule";
          break;
        case "records":
          url = "/admin/records";
          break;
         case "payments":
          url = "/admin/payments";
          break;
        default:
          setLoading(false);
          return;
      }

      const res = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` },
});

const dataRes = res.data || [];
setData(dataRes);

      // уникальные мастера
      const uniqueMasters = Array.from(
  new Set(
    dataRes
      .map((x) => x.master?.trim())
      .filter(Boolean)
  )
);

setMastersList(uniqueMasters);

      setLoading(false);
      setTableType(type);
    } catch (err) {
  console.error(err);
  setData([]);
  setLoading(false);
}
  };
 
  const filteredData =
  tableType === "schedule"
    ? [...(data || [])]

        // только будущие записи
        .filter((item) => {
          const time =
            item.vremya_nachala || item.vremya;

          if (!item.data || !time) return false;

          const recordDate = new Date(
            `${item.data}T${time}`
          );

          return recordDate >= new Date();
        })

        // фильтр по мастеру
        .filter((item) =>
          selectedMaster === "all"
            ? true
            : item.master?.trim() === selectedMaster
        )

        // сортировка
        .sort((a, b) => {
          const timeA =
            a.vremya_nachala || a.vremya;

          const timeB =
            b.vremya_nachala || b.vremya;

          const dateA = new Date(
            `${a.data}T${timeA}`
          );

          const dateB = new Date(
            `${b.data}T${timeB}`
          );

          return dateA - dateB;
        })

    : data;
    const tableContainerSx = {
  mt: 3,
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(16px)",
  borderRadius: "24px",
  border: "1px solid rgba(255,79,163,0.12)",
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(255,79,163,0.12)",
};

const tableHeadCellSx = {
  color: "#ff4fa3",
  fontWeight: 800,
  fontSize: "15px",
  borderBottom: "2px solid rgba(255,79,163,0.15)",
};

const tableBodyCellSx = {
  color: "#2b1d26",
  fontWeight: 600,
  borderBottom: "1px solid rgba(255,79,163,0.08)",
};

const tableRowSx = {
  transition: "0.2s ease",

  "&:hover": {
    background: "rgba(255,79,163,0.04)",
  },
};

  const renderTable = () => {
    if (tableType === "schedule" && filteredData.length === 0) {
  return <Typography mt={2}>Нет будущих смен</Typography>;
} 


    switch (tableType) {
     case "clients":
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table>
        <TableHead
          sx={{
            background: "rgba(255,79,163,0.08)",
          }}
        >
          <TableRow>
            <TableCell sx={tableHeadCellSx}>ФИО</TableCell>
            <TableCell sx={tableHeadCellSx}>Телефон</TableCell>
            <TableCell sx={tableHeadCellSx}>Email</TableCell>
            <TableCell sx={tableHeadCellSx}>Визиты</TableCell>
            <TableCell sx={tableHeadCellSx}>
              Дата первого визита
            </TableCell>
            <TableCell sx={tableHeadCellSx}>
              Дата последнего визита
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((client) => (
            <TableRow
              key={client.id_klienta}
              hover
              sx={tableRowSx}
            >
              <TableCell sx={tableBodyCellSx}>
                {client.fio}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {client.telefon}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {client.email}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {client.kolichestvo_vizitov}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {client.data_pervogo_vizita}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {client.data_poslednego_vizita}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
     case "masters":
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table>
        <TableHead
          sx={{
            background: "rgba(255,79,163,0.08)",
          }}
        >
          <TableRow>
            <TableCell sx={tableHeadCellSx}>ФИО</TableCell>
            <TableCell sx={tableHeadCellSx}>
              Квалификация
            </TableCell>
            <TableCell sx={tableHeadCellSx}>
              Специальность
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((master) => (
            <TableRow
              key={master.id_mastera}
              hover
              sx={tableRowSx}
            >
              <TableCell sx={tableBodyCellSx}>
                {master.fio}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {master.kvalifikaciya}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {master.dolzhnost}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
case "uslugi":
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table>

        <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
          <TableRow>
            <TableCell sx={tableHeadCellSx}>Название</TableCell>
            <TableCell sx={tableHeadCellSx}>Описание</TableCell>
            <TableCell sx={tableHeadCellSx}>Категория</TableCell>
            <TableCell sx={tableHeadCellSx}>Длительность</TableCell>
            <TableCell sx={tableHeadCellSx}>Базовая цена</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((usluga) => (
            <TableRow key={usluga.id_uslugi} hover sx={tableRowSx}>

              <TableCell sx={tableBodyCellSx}>
                {usluga.nazvanie}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {usluga.opisanie}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {usluga.kategoria?.nazvanie || "—"}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {usluga.dlitelnost ? `${usluga.dlitelnost} мин` : "—"}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {usluga.bazovaya_cena} ₽
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
      case "schedule":
    return ( <>
        <Stack
           direction="row"
            spacing={1}
            sx={{
              mb: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
        >
          <Button
            onClick={() => setSelectedMaster("all")}
            variant={selectedMaster === "all" ? "contained" : "outlined"}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: 700,
              color: selectedMaster === "all" ? "#fff" : "#ff4fa3",
              background:
                selectedMaster === "all"
                  ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
                  : "#fff",
              border: "2px solid #ff4fa3",
            }}
          >
            Все мастера
          </Button>

          {mastersList.map((m) => (
            <Button
              key={m}
              onClick={() => setSelectedMaster(m)}
              variant={selectedMaster === m ? "contained" : "outlined"}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                color: selectedMaster === m ? "#fff" : "#ff4fa3",
                background:
                  selectedMaster === m
                    ? "linear-gradient(135deg, #ff4fa3, #ff8ec6)"
                    : "#fff",
                border: "2px solid #ff4fa3",
              }}
            >
              {m}
            </Button>
          ))}
        </Stack>
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        borderRadius: "24px",
        border: "1px solid rgba(255,79,163,0.12)",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(255,79,163,0.12)",
      }}
    >
      <Table>
        <TableHead
          sx={{
            background: "rgba(255,79,163,0.08)",
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                color: "#ff4fa3",
                fontWeight: 800,
                fontSize: "15px",
                borderBottom:
                  "2px solid rgba(255,79,163,0.15)",
              }}
            >
              Мастер
            </TableCell>

            <TableCell
              sx={{
                color: "#ff4fa3",
                fontWeight: 800,
                fontSize: "15px",
                borderBottom:
                  "2px solid rgba(255,79,163,0.15)",
              }}
            >
              Дата
            </TableCell>

            <TableCell
              sx={{
                color: "#ff4fa3",
                fontWeight: 800,
                fontSize: "15px",
                borderBottom:
                  "2px solid rgba(255,79,163,0.15)",
              }}
            >
              Время
            </TableCell>
            <TableCell
            sx={{
              color: "#ff4fa3",
              fontWeight: 800,
              fontSize: "15px",
              borderBottom:
                "2px solid rgba(255,79,163,0.15)",
            }}
          >
            Клиент
          </TableCell>
        <TableCell
  sx={{
    color: "#ff4fa3",
    fontWeight: 800,
    fontSize: "15px",
    borderBottom:
      "2px solid rgba(255,79,163,0.15)",
  }}
>
  Статус
</TableCell>
            
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                transition: "0.2s ease",

                "&:hover": {
                  background:
                    "rgba(255,79,163,0.04)",
                },
              }}
            >
              <TableCell
                sx={{
                  color: "#2b1d26",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid rgba(255,79,163,0.08)",
                }}
              >
                {item.master}
              </TableCell>

              <TableCell
                sx={{
                  color: "#2b1d26",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid rgba(255,79,163,0.08)",
                }}
              >
                {item.data}
              </TableCell>

              <TableCell
                sx={{
                  color: "#2b1d26",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid rgba(255,79,163,0.08)",
                }}
              >
                {formatTime(item.vremya_nachala || item.vremya)}
              </TableCell>
              <TableCell
              sx={{
                color: "#2b1d26",
                fontWeight: 600,
                borderBottom:
                  "1px solid rgba(255,79,163,0.08)",
              }}
            >
              {item.klient}
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.6,
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 700,

                  background:
                    item.status === "Занято"
                      ? "rgba(244,67,54,0.12)"
                      : "rgba(76,175,80,0.12)",

                  color:
                    item.status === "Занято"
                      ? "#e72a27"
                      : "#4bb450",
                }}
              >
                {item.status}
              </Box>
            </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
      case "records":
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table>
        <TableHead
          sx={{
            background: "rgba(255,79,163,0.08)",
          }}
        >
          <TableRow>
            <TableCell sx={tableHeadCellSx}>
              Клиент
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Мастер
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Услуга
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Доп услуги
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Дата
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Время
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((record) => (
            <TableRow
              key={record.id_zapisi}
              hover
              sx={tableRowSx}
            >
              <TableCell sx={tableBodyCellSx}>
                {record.klient}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {record.master}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {record.usluga}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {record.dop_uslugi || "—"}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {record.data}
              </TableCell>

              <TableCell sx={tableBodyCellSx}>
                {formatTime(record.vremya)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

 case "payments":
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table>

        <TableHead
          sx={{
            background: "rgba(255,79,163,0.08)",
          }}
        >
          <TableRow>

            <TableCell sx={tableHeadCellSx}>
              Клиент
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Услуга
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Сумма
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Оплачено
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Бонусами
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Тип оплаты
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Дата платежа
            </TableCell>

            <TableCell sx={tableHeadCellSx}>
              Начислено бонусов
            </TableCell>

          </TableRow>
        </TableHead>
<TableBody>
  {data.map((payment) => (
    <TableRow
      key={payment.id_platyzha}
      hover
      sx={tableRowSx}
    >

      <TableCell sx={tableBodyCellSx}>
        {payment.klient}
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.usluga}
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.summa} ₽
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.summa_fact} ₽
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.summa_bonus || 0} ₽
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.tip_oplaty}
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.data_platyzha
          ? new Date(payment.data_platyzha).toLocaleDateString()
          : "—"}
      </TableCell>

      <TableCell sx={tableBodyCellSx}>
        {payment.nachisleno_bonusov || 0}
      </TableCell>

    </TableRow>
  ))}
</TableBody>

      </Table>
    </TableContainer>
  );
      default:
        return null;
    }
  };

  if (!admin) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",

    px: 2,
    py: 5,

    background: "var(--bg-main)",
  }}
>
  <Paper
    sx={{
      width: "100%",
      maxWidth: 1100,

      p: { xs: 3, md: 5 },

      borderRadius: "28px",

      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(18px)",

      border: "1px solid rgba(255,79,163,0.15)",

      boxShadow: "0 20px 50px rgba(255,79,163,0.12)",

      position: "relative",

      color: "#2b1d26",
    }}
  >
      {/* MENU */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <IconButton
          sx={{
            color: "#ffffff",
            backgroundColor: "rgba(255,79,163,0.08)",
            "&:hover": {
              backgroundColor: "rgba(255,79,163,0.15)",
            },
          }}>
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            onMouseEnter: () => setAnchorEl(anchorEl),
            onMouseLeave: () => setAnchorEl(null),
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => navigate("/admin/clients")}>
            Управление клиентами
          </MenuItem>

          <MenuItem onClick={() => navigate("/admin/masters")}>
            Управление мастерами
          </MenuItem>

          <MenuItem onClick={() => navigate("/admin/uslugi")}>
            Управление услугами
          </MenuItem>

          <MenuItem onClick={() => navigate("/admin/sсhedule")}>
            Управление расписанием
          </MenuItem>

          <MenuItem onClick={() => navigate("/admin/zapisi")}>
            Управление записями
          </MenuItem>

          <MenuItem onClick={() => navigate("/admin/users")}>
            Управление пользователями
          </MenuItem>
        </Menu>
      </Box>

      {/* HEADER */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar
  sx={{
    width: 90,
    height: 90,
    mb: 2,

    background: "linear-gradient(135deg, #ff4fa3, #ff8ec6)",

    boxShadow: "0 10px 25px rgba(255,79,163,0.25)",
  }}></Avatar>


        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
  {admin.fio}
</Typography>

        <Typography variant="h6" sx={{ color: "#6e5a66" }}>
  Панель администратора
</Typography>
      </Box>

      {/* BUTTONS */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
            mb: 4
          }}
      >
        <Button
          variant="contained"
          onClick={() => fetchData("clients")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          Клиенты
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("masters")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}>
          Мастера
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("uslugi")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          Услуги
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("schedule")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          Расписание
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("records")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          Записи
        </Button>
        <Button
          variant="contained"
          onClick={() => fetchData("payments")}
          sx={{
                py: 1.2,
                minWidth: 170,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "14px",
                color: "#ff4fa3",
                background: "#fff0f7",
                borderColor: "#e63e90",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)", 
                border: "2px solid #ff4fa3",
                "&:hover": {
                borderColor: "#e63e90",
                color: "white",
                background: "#ff4fa3",
                boxShadow:
                "0 10px 25px rgba(255,79,163,0.25)",
              }
              }}
        >
          Платежи
        </Button>
      </Stack>


      {/* CONTENT */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          mt={4}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            borderRadius: 3,
          }}
        >
          {renderTable()}
        </Box>
      )}
    </Paper>
  </Box>
);
}
