import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SchedulePage() {
  const navigate = useNavigate();
  const [masters, setMasters] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] =
    useState("2026-05-23");

  const days = [
    "2026-05-23",
    "2026-05-24",
    "2026-05-25",
    "2026-05-26",
    "2026-05-27",
    "2026-05-28",
    "2026-05-29",
    "2026-05-30",
  ];

  useEffect(() => {
    loadSchedule();
  }, []);


  const loadSchedule = async () => {
    try {
      const res = await axios.get("/schedule");

      setMasters(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSlotClick = (master, shift) => {
  const slot = {
    id_mastera: master.id_mastera,
    fio_mastera: master.fio,
    dolzhnost: master.dolzhnost,
    kvalifikaciya: master.kvalifikaciya,
    data: shift.data_smeny,
    vremya: shift.vremya_nachala,
    id_shift: shift.id_shift,
  };

  localStorage.setItem("selectedSlot", JSON.stringify(slot));

  navigate("/zapis");
};

  return (
    <div
      style={{
        padding: "40px",
        background: "#fff7fb",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "800",
          color: "#ff4fa3",
          marginBottom: "30px",
        }}
      >
        Расписание мастеров
      </h1>

      {/* ДНИ */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",

              border:
                selectedDay === day
                  ? "2px solid #ff4fa3"
                  : "2px solid #ffd3e8",

              background:
                selectedDay === day
                  ? "#ff4fa3"
                  : "white",

              color:
                selectedDay === day
                  ? "white"
                  : "#ff4fa3",

              fontWeight: "700",

              cursor: "pointer",

              transition: "0.2s",
            }}
          >
            {new Date(day).toLocaleDateString(
              "ru-RU",
              {
                day: "numeric",
                month: "short",
              }
            )}
          </button>
        ))}
      </div>

      {/* СПИСОК МАСТЕРОВ */}
      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {masters.map((master) => {
          const shifts =
          master.shifts?.filter(
            (shift) =>
              shift.data_smeny.slice(0, 10) === selectedDay
          ) || [];

          return (
            <div
              key={master.id_mastera}
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "24px",

                boxShadow:
                  "0 10px 30px rgba(255,79,163,0.08)",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={master.foto}
                  alt={master.fio}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #ffb6d5",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#2b1d26",
                    }}
                  >
                    {master.fio}
                  </div>

                  <div
                    style={{
                      color: "#777",
                    }}
                  >
                    {master.dolzhnost}
                  </div>
                  
                  <div
                    style={{
                      color: "#949494",
                    }}
                  >
                    {master.kvalifikaciya}
                  </div>
                </div>
              </div>

              {/* ОКНА */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <div
                      key={shift.id_shift}
                      onClick={() => handleSlotClick(master, shift)}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        userSelect: "none",

                        background:
                          selectedSlot?.id_shift === shift.id_shift
                            ? "linear-gradient(135deg,#ff4fa3,#ff8ec6)"
                            : "#fff",

                        border:
                          selectedSlot?.id_shift === shift.id_shift
                            ? "none"
                            : "2px solid #ffb6d5",

                        color:
                          selectedSlot?.id_shift === shift.id_shift
                            ? "white"
                            : "#ff4fa3",

                        minWidth: "150px",
                        transition: "0.2s ease",

                        boxShadow:
                          selectedSlot?.id_shift === shift.id_shift
                            ? "0 10px 25px rgba(255,79,163,0.25)"
                            : "0 5px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        {shift.vremya_nachala.slice(0, 5)} —{" "}
                        {shift.vremya_okonchaniya.slice(0, 5)}
                      </div>

                      <div style={{ fontSize: "13px", opacity: 0.85 }}>
                        {shift.tip_smeny}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: "#999",
                      fontWeight: "600",
                    }}
                  >
                    Нет смен
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}