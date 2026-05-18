import React, { useEffect, useState } from "react";
import "../styles/Masters.css";

const Masters = () => {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/masters")
      .then((res) => res.json())
      .then((data) => {
        setMasters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки мастеров:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка мастеров...</p>;
  if (!masters.length) return <p>Мастера ещё не загружены.</p>; 

  return (
  <div className="masters-page">
    <h1>Наши мастера</h1>
    <div className="masters-grid">
      {masters.map((master) => (
        <div className="master-card" key={master.id_mastera}>
          {}
          <div className="master-photo">
            <img
                src={
                  master.foto
                    ? `http://localhost:8000/uploads/${master.foto}`
                    : `http://localhost:8000/uploads/placeholder.jpg`
                }
                alt={master.fio}
              />
          </div>
          <div className="master-info">
            <h2>{master.fio}</h2>
            <p>Должность: {master.dolzhnost}</p>
            <p>Квалификация: {master.kvalifikaciya}</p>
            <p>Стаж: {master.stazh}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);}

export default Masters;