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
        case "schedule":
          url = "/admin/schedule";
          break;
        case "records":
          url = "/admin/records";
          break;
        default:
          setLoading(false);
          return;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data || []);
      setTableType(type);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setData([]);
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!data || data.length === 0) return <Typography mt={2}></Typography>;

    switch (tableType) {
      case "clients":
        return (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>ФИО</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Телефон</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Визиты</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Дата первого визита</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Дата последнего визита</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((client) => (
                  <TableRow key={client.id_klienta}>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.fio}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.telefon}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.email}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.kolichestvo_vizitov}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.data_pervogo_vizita}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{client.data_poslednego_vizita}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case "masters":
        return (
          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,79,163,0.12)",
              overflow: "hidden",
            }}>
            <Table>
              <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>ФИО</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Квалификация</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Специальность</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((master) => (
                  <TableRow key={master.id_mastera}>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{master.fio}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{master.kvalifikaciya}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{master.dolzhnost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case "schedule":
        return (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Мастер</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Дата</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Время</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "white", borderColor: "#444" }}>
                      {item.master}
                    </TableCell>

                    <TableCell sx={{ color: "white", borderColor: "#444" }}>
                      {item.data}
                    </TableCell>

                    <TableCell sx={{ color: "white", borderColor: "#444" }}>
                      {item.vremya}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case "records":
        return (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead sx={{ background: "rgba(255,79,163,0.08)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Клиент</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Мастер</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Услуга</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Доп услуги</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Дата</TableCell>
                  <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>Время</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((record) => (
                  <TableRow key={record.id_zapisi}>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.klient}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.master}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.usluga}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.dop_uslugi || "—"}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.data}</TableCell>
                    <TableCell sx={{ color: "#2b1d26", fontWeight: 600 }}>{record.vremya}</TableCell>
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

    background: "linear-gradient(135deg, #fff7fb, #ffeef6)",
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

          <MenuItem onClick={() => navigate("/admin/shedule")}>
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
            minWidth: 170,
            backgroundColor: "#4b3126",
            "&:hover": {
              backgroundColor: "#3a231a",
              
            },
          }}
        >
          Клиенты
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("masters")}
          sx={{
            minWidth: 170,
            backgroundColor: "#6d4c41",
            "&:hover": {
              backgroundColor: "#5a3c32",
            },
          }}
        >
          Мастера
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("schedule")}
          sx={{
            minWidth: 170,
            backgroundColor: "#8d6e63",
            "&:hover": {
              backgroundColor: "#795548",
            },
          }}
        >
          Расписание
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchData("records")}
          sx={{
            minWidth: 170,
            backgroundColor: "#a1887f",
            "&:hover": {
              backgroundColor: "#8d6e63",
              
            },
          }}
        >
          Записи
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
