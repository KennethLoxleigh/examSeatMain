import { useState } from "react";
import "./InvigilatorHome.css";

export default function InvigilatorHome({ username, duties, onBack }) {
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [loadingGrid, setLoadingGrid] = useState(false);

  const dutyList = Array.isArray(duties) ? duties : duties ? [duties] : [];

  const fetchGrid = async (roomId) => {
    try {
      setLoadingGrid(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/seating/view-plan/${roomId}`
      );

      if (!response.ok) {
        throw new Error("Seating plan not generated yet for this room.");
      }

      const gridData = await response.json();
      setSelectedGrid(gridData);
    } catch (error) {
      alert(error.message || "Seating plan not generated yet for this room.");
    } finally {
      setLoadingGrid(false);
    }
  };

  const closeGrid = () => {
    setSelectedGrid(null);
  };

  const layout =
    selectedGrid?.layout ||
    selectedGrid?.seatGrid ||
    selectedGrid?.grid ||
    [];

  return (
    <div className="invigilator-home-page">
      <div className="invigilator-topbar">
        <h2 className="invigilator-title">Assigned Exams</h2>

        <button
          className="invigilator-back-btn"
          onClick={onBack}
        >
          Log Out
        </button>
      </div>

      {dutyList.length === 0 ? (
        <p className="invigilator-empty">You are not assigned to any Exam</p>
      ) : (
        <div className="invigilator-duty-row">
          {dutyList.map((duty, index) => (
            <div
              className="invigilator-duty-card"
              key={duty.assignmentId ?? duty.id ?? index}
            >
              <p><strong>Date:</strong> {duty.examDate ?? duty.date ?? "-"}</p>
              <p><strong>Time:</strong> {duty.examTime ?? duty.time ?? "-"}</p>
              <p><strong>Room:</strong> {duty.roomName ?? "-"}</p>
              <p><strong>Invigilator:</strong> {duty.invigilatorName ?? username}</p>
              <p><strong>Subject:</strong> {duty.subject ?? "-"}</p>

              <button
                className="view-seat-btn"
                onClick={() => fetchGrid(duty.roomId)}
                disabled={loadingGrid}
              >
                View Seating Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedGrid && (
        <div className="grid-overlay">
          <div className="grid-modal">
            <div className="grid-topbar">
              <div>
                <h2>{selectedGrid.roomName ?? "Room"}</h2>
                <p>Top view seating layout</p>
              </div>
              <button className="close-grid-btn" onClick={closeGrid}>
                Close
              </button>
            </div>

            <div className="front-board">Front / Whiteboard</div>

            <div className="grid-layout">
              {layout.map((row, rowIndex) => (
                <div className="seat-row" key={rowIndex}>
                  {row.map((seat, seatIndex) => (
                    <div className="seat-box" key={seatIndex}>
                      {typeof seat === "string" ? (
                        <span>{seat}</span>
                      ) : (
                        <>
                          <strong>
                            {seat?.position ?? `${rowIndex + 1}, ${seatIndex + 1}`}
                          </strong>
                          <span>
                            {seat?.label ??
                              seat?.studentName ??
                              seat?.rollNo ??
                              seat?.value ??
                              "EMPTY"}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}