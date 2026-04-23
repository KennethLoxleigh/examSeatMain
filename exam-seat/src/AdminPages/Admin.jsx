
import SideBar from "../SideBarComponents/SideBar.jsx";
import { useState, useEffect } from "react";
import Dashboard from "../PageComponents/Dashboard.jsx";
import Student from "../PageComponents/Student.jsx";
import Invigilator from "../PageComponents/Invigilator.jsx";
import Exam from "../PageComponents/Exam.jsx";
import Room from "../PageComponents/Room.jsx";
import Seating from "../Seat/seating.jsx";
import AssignedInv from "../Seat/assignedInv.jsx";
import { fetchStudents } from "../api/studentApi";
import { fetchInvigilators } from "../api/inviApi.js";
import { fetchExams } from "../api/examApi.js";
import { fetchRooms } from "../api/roomApi.js";

export default function AdminLayout({ username, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [studentCount, setStudentCount] = useState(0);
  const [invigilatorCount, setInvigilatorCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);

  useEffect(() => {
    async function loadStudentCount() {
      try {
        const data = await fetchStudents();

const studentList = Array.isArray(data)
  ? data
  : Array.isArray(data?.students)
  ? data.students
  : [];

setStudentCount(studentList.length);
      } catch (err) {
        console.error("Failed to load student count:", err);
      }
    }
  
    loadStudentCount();
  }, []);

  useEffect(() => {
  async function loadInvigilatorCount() {
    try {
      const data = await fetchInvigilators();

      const invigilatorList = Array.isArray(data)
        ? data
        : Array.isArray(data?.invigilators)
        ? data.invigilators
        : [];

      setInvigilatorCount(invigilatorList.length);
    } catch (err) {
      console.error("Failed to load invigilator count:", err);
    }
  }

  loadInvigilatorCount();
}, []);

  useEffect(() => {
  async function loadExamCount() {
    try {
      const data = await fetchExams();

      const examList = Array.isArray(data)
        ? data
        : Array.isArray(data?.exams)
        ? data.exams
        : [];

      setExamCount(examList.length);
    } catch (err) {
      console.error("Failed to load exam count:", err);
      setExamCount(0);
    }
  }

  loadExamCount();
}, []);

useEffect(() => {
  async function loadRoomCount() {
    try {
      const data = await fetchRooms();

      const roomList = Array.isArray(data)
        ? data
        : Array.isArray(data?.rooms)
        ? data.rooms
        : [];

      setRoomCount(roomList.length);
    } catch (err) {
      console.error("Failed to load room count:", err);
      setRoomCount(0);
    }
  }

  loadRoomCount();
}, []);
  
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            username={username}
            onNavigate={setActivePage}
            studentCount={studentCount}
            invigilatorCount={invigilatorCount}
            examCount={examCount}
            roomCount={roomCount}
/>
        );
      case "student":
        return <Student onStudentCountChange={setStudentCount} />;
      case "invigilator":
        return <Invigilator onInvigilatorCountChange={setInvigilatorCount} />;
      case "exam":
        return <Exam onExamCountChange={setExamCount} />;
      case "room":
        return <Room onRoomCountChange={setRoomCount} />;
      default:
        return (
          <Dashboard
            username={username}
            onNavigate={setActivePage}
            studentCount={studentCount}
            invigilatorCount={invigilatorCount}
            examCount={examCount}
            roomCount={roomCount}
/>
        );
    }
  };
  if (activePage === "seating") {
    return <Seating onBack={() => setActivePage("dashboard")} />;
  }
  
  if (activePage === "assignedInv") {
    return <AssignedInv onBack={() => setActivePage("dashboard")} />;
  }

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