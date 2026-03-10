import { useState } from "react";

import LoginPage from "./Login/LoginPage.jsx";

import AdminLayout from "./AdminPages/Admin.jsx";

import StudentHome from "./StudentPages/StudentHome.jsx";
import InvigilatorHome from "./InvigilatorPages/InvigilatorHome.jsx";

import Seating from "./Seat/seating.jsx";

// ✅ Demo accounts (change these later)
const USERS = {
  admin: { username: "admin", password: "admin123" },
  student: { username: "student", password: "student123" },
  invigilator: { username: "invigilator", password: "inv123" },
};

export default function App() {
  // role: null => not logged in yet
  const [auth, setAuth] = useState({ role: null, username: "" });

  const handleLogin = ({ role, username, password }) => {
    const user = USERS[role];

    // basic check
    if (!user) return { ok: false, message: "Unknown role." };

    if (username === user.username && password === user.password) {
      setAuth({ role, username });
      return { ok: true, message: "Login success" };
    }

    return { ok: false, message: "Wrong username or password." };
  };

  const handleLogout = () => {
    setAuth({ role: null, username: "" });
  };

  // ✅ If not logged in => show login page ONLY
  if (!auth.role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ✅ After login, show the correct page
  if (auth.role === "admin") {
    return <AdminLayout username={auth.username} onLogout={handleLogout} />;
  }

  if (auth.role === "student") {
    return <StudentHome username={auth.username} onLogout={handleLogout} />;
  }

  if (auth.role === "invigilator") {
    return <InvigilatorHome username={auth.username} onLogout={handleLogout} />;
  }

  // fallback
  return <LoginPage onLogin={handleLogin} />;
}