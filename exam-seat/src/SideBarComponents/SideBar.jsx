import { useState } from "react";
import "./SideBar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChartBar,
  faUserGraduate,
  faChalkboardUser,
  faPenFancy,
  faSchool,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function SideBar({ activePage, setActivePage, children, onLogout, username }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="headBar">
        <div className="navLeft">
          <h3 className="logo">Exam Seating Arrangement System</h3>
        </div>

        <div className="navRight">
          <span className="who">{username}</span>
          <img className="profilePic" src="https://i.pravatar.cc/40" alt="profile" />
        </div>
      </div>

      <div className="layout">
        <div className={isOpen ? "sideBar open" : "sideBar"}>
          <button className="toggleBtn" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <ul className="menu">
            <li
              className={activePage === "dashboard" ? "active" : ""}
              onClick={() => setActivePage("dashboard")}
            >
              <span className="menuTxt">
                <FontAwesomeIcon icon={faChartBar} className="icon" />
                Dashboard
              </span>
            </li>

            <li
              className={activePage === "student" ? "active" : ""}
              onClick={() => setActivePage("student")}
            >
              <span className="menuTxt">
                <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                Student
              </span>
            </li>

            <li
              className={activePage === "invigilator" ? "active" : ""}
              onClick={() => setActivePage("invigilator")}
            >
              <span className="menuTxt">
                <FontAwesomeIcon icon={faChalkboardUser} className="icon" />
                Invigilator
              </span>
            </li>

            <li
              className={activePage === "exam" ? "active" : ""}
              onClick={() => setActivePage("exam")}
            >
              <span className="menuTxt">
                <FontAwesomeIcon icon={faPenFancy} className="icon" />
                Exam
              </span>
            </li>

            <li
              className={activePage === "room" ? "active" : ""}
              onClick={() => setActivePage("room")}
            >
              <span className="menuTxt">
                <FontAwesomeIcon icon={faSchool} className="icon" />
                Room
              </span>
            </li>

            <li className="logoutInline" onClick={onLogout}>
              <span className="menuTxt">
                <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                Logout
              </span>
            </li>
          </ul>
        </div>

        <div className={isOpen ? "content content-open" : "content"}>
          {children}
        </div>
      </div>
    </>
  );
}