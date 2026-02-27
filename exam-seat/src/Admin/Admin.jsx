import './Admin.css';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserGraduate, faChalkboardUser, faPenFancy, faSchool } from "@fortawesome/free-solid-svg-icons";

function Admin () {
 
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className='headBar'>
            <div className="navLeft">
                <h3 className="logo">Exam Seating Arrangement System</h3>
            </div>

            <div className="navCenter">
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Log Out</a>
            </div>

            <div className="navRight">
                <img className="profilePic" src="https://i.pravatar.cc/40" alt="profile"/>
            </div>
        </div>
        
        <div className="layout">
            <div className={isOpen ? "sideBar open" : "sideBar"}>
                <button className="toggleBtn" onClick={() => setIsOpen(!isOpen)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <ul className="menu">
                    <li><span className="menuTxt">
                        <FontAwesomeIcon icon={faUserGraduate} className='icon'/>Student</span> </li>
                    <li><span className="menuTxt">
                        <FontAwesomeIcon icon={faChalkboardUser} className='icon'/>Invigilator</span> </li>
                    <li><span className="menuTxt">
                        <FontAwesomeIcon icon={faPenFancy} className='icon'/>Exam</span> </li>
                    <li><span className="menuTxt">
                        <FontAwesomeIcon icon={faSchool} className='icon'/>Room</span> </li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default Admin