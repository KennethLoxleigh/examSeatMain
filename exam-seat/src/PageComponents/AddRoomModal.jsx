import { useState } from "react";
import "./AddStudentModal.css"; // reuse same modal styling

export default function AddRoomModal({ onClose, onSave }) {
  const [roomName, setRoomName] = useState("");
  const [floor, setFloor] = useState("");
  const [rowCapacity, setRowCapacity] = useState("");
  const [columnCapacity, setColumnCapacity] = useState("");
  const [numOfInvigilators, setNumOfInvigilators] = useState("");
  const [maxMajor, setMaxMajor] = useState("");
  const [error, setError] = useState("");
  

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomName.trim()) return setError("Room name is required.");
    if (!floor.trim()) return setError("Floor is required.");

    try {
      await onSave({
        roomName: roomName.trim(),
        floor: floor.trim(),
        rowCapacity: Number(rowCapacity),
        columnCapacity: Number(columnCapacity),
        numOfInvigilators: Number(numOfInvigilators),
        maxMajor: maxMajor.trim(),
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
          <h3>Add Room</h3>
          <button className="stuModalClose" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="stuModalForm">
          <label>
            Room Name
            <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          </label>

          <label>
            Floor
            <input value={floor} onChange={(e) => setFloor(e.target.value)} />
          </label>

          <label>
            Row Capacity
            <input value={rowCapacity} onChange={(e) => setRowCapacity(e.target.value)} />
          </label>

          <label>
            Column Capacity
            <input value={columnCapacity} onChange={(e) => setColumnCapacity(e.target.value)} />
          </label>

            <label>
            Number of Invigilators
            <input
                value={numOfInvigilators}
                onChange={(e) => setNumOfInvigilators(e.target.value)}
            />
            </label>

            <label>
            Max Major
            <input
                value={maxMajor}
                onChange={(e) => setMaxMajor(e.target.value)}
            />
            </label>

          {error && <p className="stuModalError">{error}</p>}
          <button type="submit" className="stuModalSave">Save</button>
        </form>
      </div>
    </div>
  );
}