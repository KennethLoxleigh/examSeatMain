import { useEffect, useState } from "react";
import { getMySeat } from "../api/studentApi";
import "./StudentHome.css";

export default function StudentHome({ username, onLogout }) {
  const [seatInfo, setSeatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSeatInfo() {
      try {
        setLoading(true);
        setError("");

        const data = await getMySeat(username);
        setSeatInfo(data);
      } catch (err) {
        setError(err.message || "Failed to load seat information");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadSeatInfo();
    }
  }, [username]);

  const displayName = seatInfo?.name ?? username;
  const roomName = seatInfo?.roomName ?? "-";
  const floor = seatInfo?.floor ?? "-";
  const row = seatInfo?.rowNum ?? "-";
  const column = seatInfo?.columnNum ?? "-";

  return (
    <div className="student-home-page">
      <div className="student-home-header">
        <h1 className="student-home-title">WELCOME {displayName} </h1>
        <button className="student-home-top-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>

      {loading && <p className="student-home-status">Loading...</p>}

      {error && <p className="student-home-error">{error}</p>}

      {!loading && !error && (
        <div className="student-home-card">
          <p>
            <span className="student-home-label">Your Seat Position</span>
          </p>
          <p>
            <span className="student-home-label">Room:</span> {roomName}
          </p>
          <p>
            <span className="student-home-label">Floor:</span> {floor}
          </p>
          <p>
            <span className="student-home-label">Seat Position:</span> ({row}, {column})
          </p>
        </div>
      )}
    </div>
  );
}