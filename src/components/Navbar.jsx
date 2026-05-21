import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const role = localStorage.getItem("role");

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};
console.log("ROLE:", role);
  return (
    <nav className="navbar">
      <div onClick={() => navigate("/")} className="logo">NOVA</div>

      <ul className="nav-links">
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/Services">Услуги</Link></li>
        <li><Link to="/about">О салоне</Link></li>
        <li><Link to="/Masters">Мастера</Link></li>
        <li><Link to="/zapis">Запись</Link></li>
        <li><Link to="/schedule">Расписание</Link></li>

        {isLoggedIn && (
          <li>
            <Link
              to={
                role === "admin"
                  ? "/admin"
                  : role === "master"
                  ? "/masterlk"
                  : "/Lk"
              }
            >
              Кабинет
            </Link>
          </li>
        )}

        {isLoggedIn ? (
          <li>
            <a onClick={handleLogout}>Выйти</a>
          </li>
        ) : (
          <li><Link to="/login">Вход</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;