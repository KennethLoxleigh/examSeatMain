import { useEffect, useMemo, useState } from "react";
import {
  fetchSeatingRooms,
  fetchSavedSeatingPlan,
  generateSeatingPlan,
} from "../api/seatingApi.js";

export default function Seating({ onBack }) {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setLoadingRooms(true);
      setError("");
      const data = await fetchSeatingRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  }

  async function handleViewPlan(roomId) {
    try {
      setLoadingPlan(true);
      setError("");
      const data = await fetchSavedSeatingPlan(roomId);
      const normalized = normalizePlanResponse(data);
      setSelectedPlan(normalized);
      console.log("Saved seating plan response:", data);
    } catch (err) {
      setError(err.message || "Failed to load seating plan");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleGeneratePlan(roomId) {
    try {
      setLoadingPlan(true);
      setError("");
      const data = await generateSeatingPlan(roomId);
      const normalized = normalizePlanResponse(data);
      setSelectedPlan(normalized);
      console.log("Generated seating plan response:", data);
    } catch (err) {
      setError(err.message || "Failed to generate seating plan");
    } finally {
      setLoadingPlan(false);
    }
  }

  function closeModal() {
    setSelectedPlan(null);
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Seating Plan</h1>
          <p style={{ marginTop: "8px" }}>
            Select a room to view or generate its seating plan.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "10px 16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid red",
            borderRadius: "8px",
            color: "red",
            background: "#fff5f5",
          }}
        >
          {error}
        </div>
      )}

      {loadingRooms ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {rooms.map((room) => {
            const roomId = room.roomId ?? room.id;
            const roomName =
              room.roomName ?? room.name ?? `Room ${roomId ?? ""}`;

            return (
              <div
                key={roomId}
                style={{
                  border: "2px solid #0a1587",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#fff",
                }}
              >
                <h3 style={{ marginTop: 0 }}>{roomName}</h3>

                {"maxCapacity" in room && <p>Capacity: {room.maxCapacity}</p>}
                {"numOfInvigilator" in room && (
                  <p>Invigilators: {room.numOfInvigilator}</p>
                )}
                {"maxMajor" in room && <p>Max Major: {room.maxMajor}</p>}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "14px",
                  }}
                >
                  <button
                    onClick={() => handleViewPlan(roomId)}
                    disabled={loadingPlan}
                    style={{
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "#0a1587",
                      color: "white",
                    }}
                  >
                    View Saved Plan
                  </button>

                  <button
                    onClick={() => handleGeneratePlan(roomId)}
                    disabled={loadingPlan}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid #0a1587",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "white",
                      color: "#0a1587",
                    }}
                  >
                    Generate Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlan && (
        <PlanModal plan={selectedPlan} onClose={closeModal} />
      )}
    </div>
  );
}

function PlanModal({ plan, onClose }) {
  const seatMap = useMemo(() => {
    const map = new Map();
    plan.seats.forEach((seat) => {
      map.set(`${seat.rowNum}-${seat.columnNum}`, seat);
    });
    return map;
  }, [plan.seats]);

  const cells = [];
  for (let row = 1; row <= plan.maxRow; row += 1) {
    for (let col = 1; col <= plan.maxCol; col += 1) {
      const seat = seatMap.get(`${row}-${col}`);
      cells.push(
        <div
          key={`${row}-${col}`}
          style={{
            minHeight: "80px",
            border: "1px solid #bbb",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: seat ? "#eef3ff" : "#f7f7f7",
            padding: "8px",
            fontSize: "14px",
          }}
        >
          <strong>
            {row}, {col}
          </strong>
          <span style={{ marginTop: "6px" }}>
            {seat ? seat.rollNo : "Empty"}
          </span>
        </div>
      );
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>{plan.roomName}</h2>
            <p style={{ marginTop: "8px" }}>Top view seating layout</p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            border: "2px dashed #999",
            borderRadius: "10px",
            padding: "12px",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Front / Whiteboard
        </div>

        {plan.seats.length === 0 ? (
          <p>No seat data returned by backend.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${plan.maxCol}, minmax(90px, 1fr))`,
              gap: "12px",
            }}
          >
            {cells}
          </div>
        )}
      </div>
    </div>
  );
}

function normalizePlanResponse(data) {
  const roomName =
    data?.roomName ??
    data?.room?.roomName ??
    data?.room?.name ??
    "Seating Plan";

  const rawSeats =
    data?.seats ??
    data?.seatingPlans ??
    data?.seatingList ??
    data?.seatList ??
    data?.plan ??
    [];

  const seats = Array.isArray(rawSeats)
    ? rawSeats.map((item, index) => ({
        id: item.seatingId ?? item.id ?? index,
        rollNo: item.rollNo ?? item.studentRollNo ?? item.student?.rollNo ?? "",
        rowNum: Number(item.rowNum ?? item.row ?? item.rowNumber ?? 0),
        columnNum: Number(
          item.columnNum ?? item.column ?? item.col ?? item.columnNumber ?? 0
        ),
      }))
    : [];

  const maxRow =
    seats.length > 0 ? Math.max(...seats.map((seat) => seat.rowNum)) : 0;

  const maxCol =
    seats.length > 0 ? Math.max(...seats.map((seat) => seat.columnNum)) : 0;

  return {
    roomName,
    seats,
    maxRow,
    maxCol,
    raw: data,
  };
}