import { useState } from "react";
import "./AddStudentModal.css";

export default function AddExamModal({ onClose, onSave }) {
  const [examId, setExamId] = useState("");
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      examId: examId.trim(),
      subject: subject.trim(),
      examDate,
      examTime,
    };

    if (!payload.examId) return setError("Exam ID is required.");
    if (!payload.subject) return setError("Subject is required.");
    if (!payload.examDate) return setError("Date is required.");
    if (!payload.examTime) return setError("Time is required.");

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="stuModalOverlay" onClick={onClose}>
      <div className="stuModal" onClick={(e) => e.stopPropagation()}>
        <div className="stuModalTop">
          <h3>Add Exam</h3>
          <button className="stuModalClose" onClick={onClose}>
            X
          </button>
        </div>

        <form onSubmit={submit} className="stuModalForm">
          <label>
            Exam ID
            <input
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              placeholder="Enter exam ID"
            />
          </label>

          <label>
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </label>

          <label>
            Date
            <input
                type="date"
                className="examDateInput"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
            />
          </label>

          <label>
            Time
            <br></br>
            <select
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
            >
              <option value="">Select time</option>
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
            </select>
          </label>

          {error && <p className="stuModalError">{error}</p>}

          <button type="submit" className="stuModalSave">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}