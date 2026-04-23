import { useEffect, useMemo, useState } from "react";
import {
  fetchAllAssignments,
  generateAssignmentPlan,
  deleteAssignmentById,
  deleteAssignmentsByExam,
  updateAssignmentById,
  downloadAssignmentsPdf,
} from "../api/assignedInviApi";
import { fetchExams } from "../api/examApi";

function displayExamTime(value) {
  if (!value) return "-";

  const text = String(value).trim().toUpperCase();

  if (text.startsWith("MOR")) return "Morning";
  if (text.startsWith("AFT")) return "Afternoon";

  return value;
}

export default function AssignedInv({ onBack }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [examIdInput, setExamIdInput] = useState("");
  const [deleteExamIdInput, setDeleteExamIdInput] = useState("");

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editRoomName, setEditRoomName] = useState("");
  const [editInvigilatorName, setEditInvigilatorName] = useState("");
  const [examOptions, setExamOptions] = useState([]);

  useEffect(() => {
  loadAssignments();
  loadExamOptions();
}, []);

  async function loadAssignments() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllAssignments();
      setAssignments(normalizeAssignments(data));
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }

  async function loadExamOptions() {
    try {
      const data = await fetchExams();

      const ids = Array.from(
        new Set(
          (Array.isArray(data) ? data : [])
            .map((exam) => exam.examId)
            .filter(Boolean)
        )
      );

      setExamOptions(ids);
    } catch (err) {
      console.error("Failed to load exam options:", err);
    }
  }

  async function handleGenerate() {
    if (!examIdInput.trim()) {
      setError("Please enter Exam ID");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");
      const text = await generateAssignmentPlan(examIdInput);
      setMessage(text);
      setExamIdInput("");
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Failed to generate assignments");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteAssignment(assignmentId) {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");
      const text = await deleteAssignmentById(assignmentId);
      setMessage(text);
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Failed to delete assignment");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteByExam() {
    if (!deleteExamIdInput.trim()) {
      setError("Please enter Exam ID to delete assignments");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");
      const text = await deleteAssignmentsByExam(deleteExamIdInput);
      setMessage(text);
      setDeleteExamIdInput("");
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Failed to delete assignments by exam");
    } finally {
      setActionLoading(false);
    }
  }

  function openEditModal(assignment) {
    setEditingAssignment(assignment);
    setEditRoomName(assignment.roomName || "");
    setEditInvigilatorName(assignment.invigilatorName || "");
  }

  function closeEditModal() {
    setEditingAssignment(null);
    setEditRoomName("");
    setEditInvigilatorName("");
  }

  async function handleUpdateAssignment() {
    if (!editingAssignment) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const payload = {
        roomName: editRoomName,
        invigilatorName: editInvigilatorName,
      };

      const text = await updateAssignmentById(editingAssignment.assignmentId, payload);
      setMessage(text);
      closeEditModal();
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Failed to update assignment");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDownloadPdf() {
    try {
      setError("");
      await downloadAssignmentsPdf();
    } catch (err) {
      setError(err.message || "Failed to download PDF");
    }
  }

  const groupedByExam = useMemo(() => {
    const groups = {};

    assignments.forEach((assignment) => {
      const key = assignment.examId ? `Exam ${assignment.examId}` : "No Exam ID";
      if (!groups[key]) groups[key] = [];
      groups[key].push(assignment);
    });

    return groups;
  }, [assignments]);

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Assigned Invigilator</h1>
          <p style={{ marginTop: "8px" }}>
            View, generate, update, delete, and download invigilator assignments.
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
              background: "#fff",
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

      {message && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #1f7a1f",
            borderRadius: "8px",
            color: "#1f7a1f",
            background: "#f4fff4",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "2px solid #0a1587",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Generate Assignment</h3>
          <select
            value={examIdInput}
            onChange={(e) => setExamIdInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select Exam ID</option>
            {examOptions.map((examId) => (
              <option key={examId} value={examId}>
                {examId}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={actionLoading}
            style={{
              padding: "10px 14px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#0a1587",
              color: "white",
            }}
          >
            Generate
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "2px solid #0a1587",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Delete by Exam ID</h3>
          <select
            value={deleteExamIdInput}
            onChange={(e) => setDeleteExamIdInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select Exam ID</option>
            {examOptions.map((examId) => (
              <option key={examId} value={examId}>
                {examId}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteByExam}
            disabled={actionLoading}
            style={{
              padding: "10px 14px",
              border: "1px solid #b30000",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#fff",
              color: "#b30000",
            }}
          >
            Delete All for Exam
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "2px solid #0a1587",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Download PDF</h3>
          <p style={{ marginBottom: "12px" }}>
            Download all invigilator assignments as PDF.
          </p>
          <button
            onClick={handleDownloadPdf}
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

      <div
        style={{
          background: "#fff",
          border: "2px solid #0a1587",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>Assignment List</h2>
          <button
            onClick={loadAssignments}
            disabled={loading || actionLoading}
            style={{
              padding: "10px 14px",
              border: "1px solid #0a1587",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#fff",
              color: "#0a1587",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No assignment data found.</p>
        ) : (
          Object.entries(groupedByExam).map(([groupName, items]) => (
            <div key={groupName} style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "12px" }}>{groupName}</h3>

              <div style={{ display: "grid", gap: "12px" }}>
                {items.map((assignment) => (
                  <div
                    key={assignment.assignmentId}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "14px",
                      background: "#f9f9ff",
                    }}
                  >
                    <p style={{ margin: "4px 0" }}>
                      <strong>Assignment ID:</strong> {assignment.assignmentId}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Date:</strong> {assignment.examDate || "-"}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Time:</strong> {displayExamTime(assignment.examTime)}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Room:</strong> {assignment.roomName || "-"}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Invigilator:</strong> {assignment.invigilatorName || "-"}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Exam ID:</strong> {assignment.examId || "-"}
                    </p>
                    

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        onClick={() => openEditModal(assignment)}
                        style={{
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: "#0a1587",
                          color: "white",
                        }}
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDeleteAssignment(assignment.assignmentId)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #b30000",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: "#fff",
                          color: "#b30000",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {editingAssignment && (
        <div
          onClick={closeEditModal}
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
              width: "100%",
              maxWidth: "500px",
              background: "white",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Update Assignment</h2>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>Room Name</label>
              <input
                type="text"
                value={editRoomName}
                onChange={(e) => setEditRoomName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>
                Invigilator Name
              </label>
              <input
                type="text"
                value={editInvigilatorName}
                onChange={(e) => setEditInvigilatorName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handleUpdateAssignment}
                disabled={actionLoading}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: "#0a1587",
                  color: "white",
                }}
              >
                Save
              </button>

              <button
                onClick={closeEditModal}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeAssignments(data) {
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => ({
    assignmentId:
      item.assignmentId ??
      item.AssignmentId ??
      item.id ??
      index + 1,

    roomName:
      item.roomName ??
      item.room?.roomName ??
      item.room?.name ??
      "",

    invigilatorName:
      item.invigilatorName ??
      item.invigilator?.name ??
      item.invigilator?.invigilatorName ??
      "",

    examId:
      item.examId ??
      item.exam?.examId ??
      item.exam?.id ??
      "",

    examDate:
      item.examDate ??
      item.exam?.examDate ??
      item.exam?.date ??
      "",

    examTime:
      item.examTime ??
      item.exam?.examTime ??
      item.exam?.time ??
      "",
  }));
}