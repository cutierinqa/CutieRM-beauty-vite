import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import { Helmet } from "react-helmet";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Masters from "./components/masters";
import Services from "./pages/Services";
import Schedule from "./pages/Schedule.jsx";
import Login from "./pages/Login";
import History from "./pages/History";
import Loyalty from "./pages/Loyalty";
import Zapis from "./pages/zapis";
import AdminUslugi from "./pages/AdminUslugi";
import AdminMasters from "./pages/AdminMasters";
import AdminClients from "./pages/AdminClients";
import AdminZapisi from "./pages/AdminZapisi";
import AdminUsers from "./pages/AdminUsers";
import AdminSchedule from "./pages/AdminSchedule";
import Admin from "./pages/admin";
import Lk from "./pages/Lk";
import MasterLk from "./pages/masterlk";
import Settings from "./pages/Settings";
import MasterSchedule from "./pages/MasterSchedule";
import Moderation from "./pages/AdminModeration";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Helmet>
        <title >NOVA</title>
      </Helmet>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/services" element={<Services />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/zapis" element={<Zapis />} />

        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Admin />
    </ProtectedRoute>
  }
/>

<Route
  path="/Lk"
  element={
    <ProtectedRoute allowedRoles={["client"]}>
      <Lk />
    </ProtectedRoute>
  }
/>

<Route
  path="/masterlk"
  element={
    <ProtectedRoute allowedRoles={["master"]}>
      <MasterLk />
    </ProtectedRoute>
  }
/>

        <Route path="/admin/masters" element={<AdminMasters />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/zapisi" element={<AdminZapisi />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/uslugi" element={<AdminUslugi />} />
        <Route path="/admin/schedule" element={<AdminSchedule />} />
        <Route path="/admin/moderation" element={<Moderation />} />
        <Route path="/master/schedule" element={<MasterSchedule />} />
      </Routes>
    </>
  );
}

export default App;