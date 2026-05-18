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
              <TableHead>
                <TableRow>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Визиты</TableCell>
                  <TableCell>Дата первого визита</TableCell>
                  <TableCell>Дата последнего визита</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((client) => (
                  <TableRow key={client.id_klienta}>
                    <TableCell>{client.fio}</TableCell>
                    <TableCell>{client.telefon}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.kolichestvo_vizitov}</TableCell>
                    <TableCell>{client.data_pervogo_vizita}</TableCell>
                    <TableCell>{client.data_poslednego_vizita}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case "masters":
        return (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Квалификация</TableCell>
                  <TableCell>Специальность</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((master) => (
                  <TableRow key={master.id_mastera}>
                    <TableCell>{master.fio}</TableCell>
                    <TableCell>{master.kvalifikaciya}</TableCell>
                    <TableCell>{master.dolzhnost}</TableCell>
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
              <TableHead>
                <TableRow>
                  <TableCell>Мастер</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Время</TableCell>
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
              <TableHead>
                <TableRow>
                  <TableCell>Клиент</TableCell>
                  <TableCell>Мастер</TableCell>
                  <TableCell>Услуга</TableCell>
                  <TableCell>Доп услуги</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Время</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((record) => (
                  <TableRow key={record.id_zapisi}>
                    <TableCell>{record.klient}</TableCell>
                    <TableCell>{record.master}</TableCell>
                    <TableCell>{record.usluga}</TableCell>
                    <TableCell>{record.dop_uslugi || "—"}</TableCell>
                    <TableCell>{record.data}</TableCell>
                    <TableCell>{record.vremya}</TableCell>
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
    }}
  >
    <Paper
      sx={{
        width: "100%",
        maxWidth: 1100,
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        boxShadow: 6,
        position: "relative",
        backgroundColor: "#1e1e1e",
        color: "white",
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
        <IconButton sx={{ color: "white" }}>
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
            bgcolor: "#4b3126",
            width: 90,
            height: 90,
            mx: "auto",
            mb: 2,
          }}
        >
          <PersonIcon sx={{ fontSize: 45 }} />
        </Avatar>

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 1, textAlign: "center" }}
        >
          {admin.fio}
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "#bdbdbd" }}
        >
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
