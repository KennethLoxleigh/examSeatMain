import { useState } from "react";
import SideBar from "../SideBarComponents/SideBar.jsx";

import Dashboard from "../PageComponents/Dashboard.jsx";
import Student from "../PageComponents/Student.jsx";
import Invigilator from "../PageComponents/Invigilator.jsx";
import Exam from "../PageComponents/Exam.jsx";
import Room from "../PageComponents/Room.jsx";

export default function AdminLayout({ username, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard username={username} onNavigate={setActivePage} />;
      case "student":
        return <Student />;
      case "invigilator":
        return <Invigilator />;
      case "exam":
        return <Exam />;
      case "room":
        return <Room />;
      default:
        return <Dashboard username={username} onNavigate={setActivePage} />;
    }
  };

  return (
    <SideBar
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={onLogout}
      username={username}
    >
      {renderPage()}
    </SideBar>
  );
}