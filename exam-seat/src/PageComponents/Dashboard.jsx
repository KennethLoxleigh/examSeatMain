import "./Dashboard.css";

export default function Dashboard({
  username,
  onNavigate,
  studentCount,
  invigilatorCount,
  examCount,
  roomCount,
}) {

  return (
    <>
    <div className="dashboardWrapper">
        <div className="goToBox">
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("student");
            }}>
                STUDENTS
            </a>
            <br /> Total Students: {studentCount}
        </div>
        <div className="goToBox">
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("invigilator");
            }}>
                INVIGILATORS
            </a>
            <br /> Total Invigilators: {invigilatorCount}
        </div>
        <div className="goToBox">
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("exam");
            }}>
                EXAMS
            </a>
            <br /> Total Exams: {examCount}
        </div>
        <div className="goToBox">
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onNavigate("room");
            }}>
                ROOMS
            </a>
            <br /> Total Rooms: {roomCount}
        </div>
    </div>

    <div className="newWrapper">
        <div className="assignedSeat">
            <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate("seating");
            }}
            >
                SEATING PLANS
            </a>
        </div>

        <div className="assignedInvi">
            <a
                href="#"
                onClick={(e) => {
                e.preventDefault();
                onNavigate("assignedInv");
                }}
            >
                ASSIGNED INVIGILATORS
            </a>
        </div>
    </div>
    </>
  );
}