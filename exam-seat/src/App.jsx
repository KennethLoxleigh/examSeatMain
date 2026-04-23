import { useState } from "react";

import LoginPage from "./Login/LoginPage.jsx";

import AdminLayout from "./AdminPages/Admin.jsx";

import StudentHome from "./StudentPages/StudentHome.jsx";
import InvigilatorHome from "./InvigilatorPages/InvigilatorHome.jsx";

import { checkStudentRollNo } from "./api/studentApi";
import { checkInvigilatorName } from "./api/inviApi";

// ✅ Demo accounts (change these later)
const USERS = {
  admin: { username: "admin", password: "admin123" },
  student: { username: "student", password: "student123" },
  invigilator: { username: "invigilator", password: "inv123" },
};

export default function App() {
  // role: null => not logged in yet
  const [auth, setAuth] = useState({ role: null, username: "" });

  const handleLogin = async ({ role, username, password }) => {
  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      setAuth({ role: "admin", username });
      return { ok: true };
    }

    return { ok: false, message: "Invalid admin username or password" };
  }

  if (role === "student") {
    const result = await checkStudentRollNo(username);

    if (!result.ok) {
      return { ok: false, message: result.message };
    }

    setAuth({
      role: "student",
      username,
      studentSeat: result.data,
    });

    return { ok: true };
  }

  if (role === "invigilator") {
    const result = await checkInvigilatorName(username);

    if (!result.ok) {
      return { ok: false, message: result.message };
    }

    setAuth({
      role: "invigilator",
      username,
      duties: result.data,
    });

    return { ok: true };
  }

  return { ok: false, message: "Invalid role" };
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
  return (
    <InvigilatorHome
      username={auth.username}
      duties={auth.duties}
      onBack={handleLogout}
    />
  );
}

  // fallback
  return <LoginPage onLogin={handleLogin} />;
}