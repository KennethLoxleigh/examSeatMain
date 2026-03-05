import { useState } from "react";
import "./AddStudentModal.css";

export default function AddStudentModal({ onClose, onSave }) {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [majorId, setMajorId] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await onSave({
        roll_no: rollNo.trim(),
        name: name.trim(),
        major_id: majorId.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="stuModalOverlay" onClick={onClose}>
      <div className="stuModal" onClick={(e) => e.stopPropagation()}>
        <div className="stuModalTop">
          <h3>Add Student</h3>
          <button className="stuModalClose" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="stuModalForm">
          <label>
            Roll Number
            <input value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
          </label>

          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Major ID
            <input value={majorId} onChange={(e) => setMajorId(e.target.value)} />
          </label>

          {error && <p className="stuModalError">{error}</p>}

          <button type="submit" className="stuModalSave">Save</button>
        </form>
      </div>
    </div>
  );
}