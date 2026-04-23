import { useEffect, useState, Fragment } from "react";
import "./Exam.css";
import AddExamModal from "./AddExamModal.jsx";

import {
  fetchExams,
  addExam,
  updateExam,
  deleteExam,
} from "../api/examApi.js";

function formatDateForInput(value) {
  if (!value) return "";
  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return text;

  return d.toISOString().slice(0, 10);
}

function normalizeExamTime(value) {
  if (!value) return "";

  const text = String(value).trim().toUpperCase();

  if (text.startsWith("MOR")) return "MORNING";
  if (text.startsWith("AFT")) return "AFTERNOON";

  return "";
}

function displayExamTime(value) {
  const normalized = normalizeExamTime(value);

  if (normalized === "MORNING") return "Morning";
  if (normalized === "AFTERNOON") return "Afternoon";

  return value || "-";
}

export default function Exam({ onExamCountChange }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editExamId, setEditExamId] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editError, setEditError] = useState("");

  async function loadExams() {
    setLoading(true);
    setStatus("");

    try {
      const data = await fetchExams();

const examList = Array.isArray(data)
  ? data
  : Array.isArray(data?.exams)
  ? data.exams
  : [];

setExams(examList);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
  if (onExamCountChange) {
    onExamCountChange(exams.length);
  }
}, [exams, onExamCountChange]);

  async function handleAddFromModal(payload) {
    const msg = await addExam({
      examId: payload.examId,
      subject: payload.subject,
      examDate: payload.examDate,
      examTime: payload.examTime,
    });

    setStatus(msg);
    await loadExams();
  }

  function startEdit(exam) {
    setEditError("");
    setStatus("");
    setEditingId(exam.examId);
    setEditExamId(exam.examId ?? "");
    setEditSubject(exam.subject ?? "");
    setEditDate(formatDateForInput(exam.examDate));
    setEditTime(normalizeExamTime(exam.examTime));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditExamId("");
    setEditSubject("");
    setEditDate("");
    setEditTime("");
    setEditError("");
  }

  async function saveEdit(examId) {
    setEditError("");
    setStatus("");

    if (!editExamId.trim()) return setEditError("Exam ID is required.");
    if (!editSubject.trim()) return setEditError("Subject is required.");
    if (!editDate) return setEditError("Date is required.");
    if (!editTime) return setEditError("Time is required.");

    try {
      const msg = await updateExam(examId, {
        examId: editExamId.trim(),
        subject: editSubject.trim(),
        examDate: editDate,
        examTime: editTime,
      });

      setStatus(msg);
      cancelEdit();
      await loadExams();
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function removeExam(examId) {
    setStatus("");

    try {
      const msg = await deleteExam(examId);
      setStatus(msg);

      if (editingId === examId) cancelEdit();

      await loadExams();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <div className="examWrapper">
        <div className="examHeadLeft">Exams</div>

        <div className="examHeadRight">
          <button
            className="examAddBtn"
            onClick={() => setShowAdd(true)}
          >
            Add Exam
          </button>
        </div>
      </div>

      {status && (
        <p style={{ color: "black", paddingLeft: 20 }}>
          {status}
        </p>
      )}

      <div className="examListHead">
        <div style={{ paddingLeft: 80, paddingRight: 40, marginTop: 10 }}>
          <table className="examTable">
            <thead>
              <tr>
                  <th>Exam ID</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="examActionHead"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 10 }}>
                    Loading...
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 10 }}>
                    No exams found.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <Fragment key={exam.examId}>
                    <tr>
                      <td>{exam.examId}</td>
                      <td>{exam.subject}</td>
                      <td>{formatDateForInput(exam.examDate)}</td>
                      <td>{displayExamTime(exam.examTime)}</td>
                      <td className="examActionCell">
                        <div className="examActionButtons">
                            <button
                            type="button"
                            className="examUpdateBtn"
                            onClick={() => startEdit(exam)}
                            >
                            Update
                            </button>

                            <button
                            type="button"
                            className="examRemoveBtn"
                            onClick={() => removeExam(exam.examId)}
                            >
                            Remove
                            </button>
                        </div>
                    </td>
                    </tr>

                    {editingId === exam.examId && (
                    <tr className="examEditRow">
                        <td colSpan={5} className="examEditCell">
                          <div
                            style={{
                              marginTop: 8,
                              padding: 12,
                              border: "1px solid #999",
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 12, marginBottom: 4 }}>
                                  Exam ID
                                </div>
                                <input
                                  value={editExamId}
                                  onChange={(e) => setEditExamId(e.target.value)}
                                  disabled
                                />
                              </div>

                              <div>
                                <div style={{ fontSize: 12, marginBottom: 4 }}>
                                  Subject
                                </div>
                                <input
                                  value={editSubject}
                                  onChange={(e) => setEditSubject(e.target.value)}
                                />
                              </div>

                              <div>
                                <div style={{ fontSize: 12, marginBottom: 4 }}>
                                  Date
                                </div>
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                />
                              </div>

                              <div>
                                <div style={{ fontSize: 12, marginBottom: 4 }}>
                                  Time
                                </div>
                                <select
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                >
                                  <option value="">Select time</option>
                                  <option value="MORNING">Morning</option>
                                  <option value="AFTERNOON">Afternoon</option>
                                </select>
                              </div>

                              <div className="examEditActions">
                                <button
                                    type="button"
                                    className="examSaveBtn"
                                    onClick={() => saveEdit(exam.examId)}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="examCancelBtn"
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                              </div>
                            </div>

                            {editError && (
                              <p style={{ marginTop: 8, color: "#ff6b6b" }}>
                                {editError}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddExamModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddFromModal}
        />
      )}
    </>
  );
}