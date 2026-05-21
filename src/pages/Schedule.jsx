import { useEffect, useState } from "react";

export default function SchedulePage() {

  const [masters, setMasters] = useState([]);

  const times = [];

  for (let h = 8; h <= 20; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
  }

  useEffect(() => {
    fetch("http://127.0.0.1:8000/schedule")
      .then((res) => res.json())
      .then((data) => setMasters(data))
      .catch((err) => console.error(err));
  }, []);

  const isShiftActive = (
    shifts,
    currentTime
  ) => {

    for (const shift of shifts) {

      if (shift.type !== "work")
        continue;

      if (
        currentTime >= shift.start &&
        currentTime < shift.end
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#fff7fb,#ffeef6)",

        fontFamily: "Inter"
      }}
    >

      <h1
        style={{
          marginBottom: 30,
          color: "#ff4fa3",
          fontSize: 42,
          fontWeight: 800
        }}
      >
        Расписание
      </h1>

      <div
        style={{
          display: "flex",

          overflowX: "auto",

          background: "white",

          borderRadius: 24,

          boxShadow:
            "0 15px 40px rgba(255,79,163,0.12)"
        }}
      >

        {/* TIME COLUMN */}

        <div
          style={{
            minWidth: 100,

            borderRight:
              "1px solid #eee"
          }}
        >

          <div
            style={{
              height: 80
            }}
          />

          {times.map((time) => (
            <div
              key={time}
              style={{
                height: 80,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                borderBottom:
                  "1px solid #f3f3f3",

                fontWeight: 700,

                color: "#777"
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* MASTERS */}

        {masters.map((master) => (

          <div
            key={master.id_mastera}

            style={{
              minWidth: 220,

              borderRight:
                "1px solid #eee"
            }}
          >

            {/* HEADER */}

            <div
              style={{
                height: 80,

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center",

                gap: 6,

                borderBottom:
                  "1px solid #eee",

                background:
                  "linear-gradient(135deg,#fff0f7,#fff)"
              }}
            >

              <img
                src={`http://127.0.0.1:8000/uploads/${master.foto}`}

                alt={master.fio}

                style={{
                  width: 42,
                  height: 42,

                  borderRadius: "50%",

                  objectFit: "cover"
                }}
              />

              <span
                style={{
                  fontWeight: 700,

                  fontSize: 16
                }}
              >
                {master.fio}
              </span>

            </div>

            {/* SHIFTS */}

            {times.map((time) => {

              const active =
                isShiftActive(
                  master.shifts,
                  time
                );

              return (

                <div
                  key={time}

                  style={{
                    height: 80,

                    borderBottom:
                      "1px solid #f5f5f5",

                    background:
                      active
                        ? "#d9ffe3"
                        : "#f3f3f3",

                    transition: "0.2s",

                    cursor:
                      active
                        ? "pointer"
                        : "default",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    fontWeight: 700,

                    color:
                      active
                        ? "#1d7a31"
                        : "#999"
                  }}
                >

                  {active
                    ? "Работает"
                    : "Нет смены"}

                </div>
              );
            })}

          </div>

        ))}

      </div>
    </div>
  );
}