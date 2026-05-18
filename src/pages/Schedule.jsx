import React, { useEffect, useState } from "react";
import { getSchedule } from "../api/api";

const Schedule = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedule()
      .then(data => {
        setShifts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка расписания...</div>;

  return (
    <div>
      <h2>Расписание мастеров</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Мастер</th>
            <th>Дата</th>
            <th>Время начала</th>
            <th>Время окончания</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift.id_shift}>
              <td>{shift.master_fio}</td>
              <td>{shift.data}</td>
              <td>{shift.vremya_nachala}</td>
              <td>{shift.vremya_okonchaniya}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
