import { useState } from "react";
import "./AddStudentModal.css"; // reuse same modal styling as student

export default function AddInvigilatorModal({ onClose, onSave }) {
  const [invigilatorName, setInvigilatorName] = useState("");
  const [rank, setRank] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      invigilatorName: invigilatorName.trim(), // string
      rank: rank.trim(),                       // string
      department: department.trim(),           // string
    };

    if (!payload.invigilatorName) return setError("Name is required.");
    if (!payload.rank) return setError("Rank is required.");
    if (!payload.department) return setError("Department is required.");

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
          <h3>Add Invigilator</h3>
          <button className="stuModalClose" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="stuModalForm">
          {/* Name */}
          <label>
            Name
            <input
              value={invigilatorName}
              onChange={(e) => setInvigilatorName(e.target.value)}
              placeholder="Enter name"
            />
          </label>

          {/* Rank (after name, before department) */}
          <label>
            Rank
            <input
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="Enter rank"
            />
          </label>

          {/* Department */}
          <label>
            Department
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department"
            />
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