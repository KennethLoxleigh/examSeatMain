import { useEffect, useMemo, useState } from "react";
import {
  fetchSeatingRooms,
  fetchSavedSeatingPlan,
  generateSeatingPlan,
  downloadSeatingPlanPdf,
} from "../api/seatingApi";

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
      setSelectedPlan(null);

      const data = await fetchSavedSeatingPlan(roomId);
      const normalized = normalizePlanResponse(data);
      setSelectedPlan(normalized);
    } catch (err) {
      setSelectedPlan(null);
      setError(
        err.message ||
          "No saved seating plan for this room. Please click Generate Plan first."
      );
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
  } catch (err) {
    setError(err.message || "Failed to generate seating plan");
  } finally {
    setLoadingPlan(false);
  }
}

  async function handleDownloadPdf(roomId, roomName) {
    try {
      setError("");
      await downloadSeatingPlanPdf(roomId, roomName);
    } catch (err) {
      setError(err.message || "Failed to download seating plan PDF");
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

                  <button
                    onClick={() => handleDownloadPdf(roomId, roomName)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid #444",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "#f4f4f4",
                      color: "#222",
                    }}
                  >
                    Download PDF
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

    (plan.seats || []).forEach((seat) => {
      if (
        seat == null ||
        !Number.isFinite(seat.rowNum) ||
        !Number.isFinite(seat.columnNum)
      ) {
        return;
      }

      map.set(`${seat.rowNum}-${seat.columnNum}`, seat);
    });

    return map;
  }, [plan.seats]);

  const rowStart = Number.isFinite(plan.minRow) ? plan.minRow : 1;
  const rowEnd = Number.isFinite(plan.maxRow) ? plan.maxRow : rowStart;
  const colStart = Number.isFinite(plan.minCol) ? plan.minCol : 1;
  const colEnd = Number.isFinite(plan.maxCol) ? plan.maxCol : colStart;

  const cells = [];

  for (let row = rowStart; row <= rowEnd; row += 1) {
    for (let col = colStart; col <= colEnd; col += 1) {
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
            {seat ? seat.rollNo || "Occupied" : "Empty"}
          </span>
        </div>
      );
    }
  }

  const hasGrid = cells.length > 0;

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

        {!hasGrid ? (
          <div>
            <p>No seat positions found in saved plan response.</p>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#f5f5f5",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
              }}
            >
              {JSON.stringify(plan.raw, null, 2)}
            </pre>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.max(
                colEnd - colStart + 1,
                1
              )}, minmax(90px, 1fr))`,
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
  const response = Array.isArray(data) ? { seats: data } : data || {};

  const roomName =
    response.roomName ??
    response.room?.roomName ??
    response.room?.name ??
    response.room?.room_number ??
    response.room?.roomNo ??
    response.room?.roomId ??
    "Seating Plan";

  const rawSeatsSource =
    response.seats ??
    response.seatingPlans ??
    response.seatingList ??
    response.seatinglist ??
    response.seatList ??
    response.plan ??
    response.savedPlan ??
    response.savedPlans ??
    response.layout ??
    response.positions ??
    response.data?.seats ??
    response.data?.seatingPlans ??
    response.data?.seatList ??
    response.data?.plan ??
    response.result?.seats ??
    response.result?.seatList ??
    [];

  function pickNumber(...values) {
    for (const value of values) {
      const num = Number(value);
      if (Number.isFinite(num)) {
        return num;
      }
    }
    return null;
  }

  function getRollNo(item) {
    if (item == null) return "";

    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }

    return (
      item.rollNo ??
      item.studentRollNo ??
      item.roll_no ??
      item.rollnumber ??
      item.student?.rollNo ??
      item.student?.studentRollNo ??
      item.student?.roll_no ??
      item.assignedStudent?.rollNo ??
      item.assignedStudent?.studentRollNo ??
      item.seat?.rollNo ??
      item.seat?.studentRollNo ??
      item.value ??
      ""
    );
  }

  let seats = [];
  let matrixMaxRow = 0;
  let matrixMaxCol = 0;

  if (Array.isArray(rawSeatsSource) && rawSeatsSource.every(Array.isArray)) {
    matrixMaxRow = rawSeatsSource.length;
    matrixMaxCol = Math.max(
      0,
      ...rawSeatsSource.map((row) => (Array.isArray(row) ? row.length : 0))
    );

    seats = rawSeatsSource.flatMap((rowItems, rowIndex) =>
      (Array.isArray(rowItems) ? rowItems : [])
        .map((item, colIndex) => {
          if (item == null) return null;

          return {
            id:
              item?.seatingId ??
              item?.id ??
              `${rowIndex + 1}-${colIndex + 1}`,
            rollNo: getRollNo(item),
            rowNum: rowIndex + 1,
            columnNum: colIndex + 1,
          };
        })
        .filter(Boolean)
    );
  } else {
    const rawSeats = Array.isArray(rawSeatsSource) ? rawSeatsSource : [];

    seats = rawSeats
      .map((item, index) => ({
        id: item?.seatingId ?? item?.id ?? index,
        rollNo: getRollNo(item),
        rowNum: pickNumber(
          item?.rowNum,
          item?.row,
          item?.rowNumber,
          item?.rowIndex,
          item?.seatRow,
          item?.seat?.rowNum,
          item?.seat?.row,
          item?.position?.rowNum,
          item?.position?.row,
          item?.seatPosition?.row,
          item?.r
        ),
        columnNum: pickNumber(
          item?.columnNum,
          item?.column,
          item?.col,
          item?.columnNumber,
          item?.colNum,
          item?.columnIndex,
          item?.seatColumn,
          item?.seat?.columnNum,
          item?.seat?.column,
          item?.position?.columnNum,
          item?.position?.column,
          item?.position?.col,
          item?.seatPosition?.column,
          item?.c
        ),
      }))
      .filter(
        (seat) =>
          Number.isFinite(seat.rowNum) && Number.isFinite(seat.columnNum)
      );
  }

  const rowValues = seats.map((seat) => seat.rowNum);
  const colValues = seats.map((seat) => seat.columnNum);

  const minRowFromSeats =
    rowValues.length > 0 ? Math.min(...rowValues) : null;
  const maxRowFromSeats =
    rowValues.length > 0 ? Math.max(...rowValues) : null;

  const minColFromSeats =
    colValues.length > 0 ? Math.min(...colValues) : null;
  const maxColFromSeats =
    colValues.length > 0 ? Math.max(...colValues) : null;

  const minRow = pickNumber(response.minRow, minRowFromSeats, 1);
  const maxRow = pickNumber(
    response.maxRow,
    response.rowCount,
    response.rows,
    response.totalRows,
    maxRowFromSeats,
    matrixMaxRow,
    minRow
  );

  const minCol = pickNumber(response.minCol, minColFromSeats, 1);
  const maxCol = pickNumber(
    response.maxCol,
    response.columnCount,
    response.cols,
    response.columns,
    response.totalColumns,
    maxColFromSeats,
    matrixMaxCol,
    minCol
  );

  return {
    roomName,
    seats,
    minRow,
    maxRow,
    minCol,
    maxCol,
    raw: response,
  };
}