import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({ username, onNavigate }) {

  return (
    <>
    <div className="dashboardWrapper">
        <div className="goToBox">
            Students List <br />
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("student");
            }}>
                See More
                <FontAwesomeIcon icon={faAngleRight} />
            </a>
        </div>
        <div className="goToBox">
            Invigilators List <br />
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("invigilator");
            }}>
                See More
                <FontAwesomeIcon icon={faAngleRight} />
            </a>
        </div>
        <div className="goToBox">
            Exam List <br />
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("exam");
            }}>
                See More
                <FontAwesomeIcon icon={faAngleRight} />
            </a>
        </div>
        <div className="goToBox">
            Room List <br />
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("room");
            }}>
                See More
                <FontAwesomeIcon icon={faAngleRight} />
            </a>
        </div>
    </div>
    </>
  );
}