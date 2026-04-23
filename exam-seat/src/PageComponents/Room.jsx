import { useEffect, useState, Fragment } from "react";
import "./Room.css";

import AddRoomModal from "./AddRoomModal.jsx";
import { fetchRooms, addRoom, updateRoom, deleteRoom } from "../api/roomApi.js";

export default function Room({ onRoomCountChange }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  // dropdown update
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({
    roomName: "",
    floor: "",
    rowCapacity: "",
    columnCapacity: "",
    numOfInvigilators: "",
    maxMajor: "",
  });
  const [editError, setEditError] = useState("");

  async function loadRooms() {
    setLoading(true);
    setStatus("");
    try {
      const data = await fetchRooms();

const roomList = Array.isArray(data)
  ? data
  : Array.isArray(data?.rooms)
  ? data.rooms
  : [];

setRooms(roomList);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
  if (onRoomCountChange) {
    onRoomCountChange(rooms.length);
  }
}, [rooms, onRoomCountChange]);

  async function handleAddFromModal(payload) {
    const msg = await addRoom(payload);
    setStatus(msg);
    await loadRooms();
  }

  function startEdit(r) {
    setEditError("");
    setStatus("");
    setEditingId(r.roomId);

    setEdit({
      roomName: r.roomName ?? "",
      floor: r.floor ?? "",
      rowCapacity: String(r.rowCapacity ?? ""),
      columnCapacity: String(r.columnCapacity ?? ""),
      numOfInvigilators: String(r.numOfInvigilators ?? ""),
      maxMajor: r.maxMajor ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEdit({
      roomName: "",
      floor: "",
      rowCapacity: "",
      columnCapacity: "",
      numOfInvigilators: "",
      maxMajor: "",
    });
    setEditError("");
  }

  async function saveEdit(roomId) {
    setEditError("");
    setStatus("");

    if (!edit.roomName.trim()) return setEditError("Room name is required.");
    if (!edit.floor.trim()) return setEditError("Floor is required.");
    if (Number.isNaN(Number(edit.rowCapacity))) return setEditError("Row capacity must be a number.");
    if (Number.isNaN(Number(edit.columnCapacity))) return setEditError("Column capacity must be a number.");
    if (Number.isNaN(Number(edit.numOfInvigilators))) return setEditError("Number of invigilators must be a number.");

    try {
      const msg = await updateRoom(roomId, {
        roomName: edit.roomName.trim(),
        floor: edit.floor.trim(),
        rowCapacity: Number(edit.rowCapacity),
        columnCapacity: Number(edit.columnCapacity),
        numOfInvigilators: Number(edit.numOfInvigilators),
        maxMajor: edit.maxMajor.trim(),
      });

      setStatus(msg);
      cancelEdit();
      await loadRooms();
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function removeRoom(roomId) {
    setStatus("");
    try {
      const msg = await deleteRoom(roomId);
      setStatus(msg);
      if (editingId === roomId) cancelEdit();
      await loadRooms();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <div className="roomWrapper">
        <div className="roomHeadLeft">Rooms</div>

        <div className="roomHeadRight">
          <button className="roomAddBtn" onClick={() => setShowAdd(true)}>
            Add Room
          </button>
        </div>
      </div>

      {status && <p style={{ paddingLeft: 20 }}>{status}</p>}

      <div className="roomList">
        
      

      {/* table rows */}
      <div style={{ paddingLeft: 80, paddingRight: 40, marginTop: 10 }}>
        <table className="roomTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Floor</th>
                <th>Roll Capacity</th>
                <th>Column Capacity</th>
                <th>Number Of Invigilators</th>
                <th>Maximum Major</th>
                <th className="roomActionHead"></th>
              </tr>
            </thead>

            <tbody>
            {loading ? (
                <tr>
                <td colSpan={5} style={{ padding: 10 }}>
                    Loading...
                </td>
                </tr>
            ) : (
                <>
                {rooms.map((r) => (
                    <Fragment key={r.roomId}>
                    <tr>
                        <td>{r.roomName}</td>
                        <td>{r.floor}</td>
                        <td>{r.rowCapacity}</td>
                        <td>{r.columnCapacity}</td>
                        <td>{r.numOfInvigilators}</td>
                        <td>{r.maxMajor}</td>
                        <td className="roomActionCell">
                          <div className="roomActionButtons">
                            <button
                              type="button"
                              className="roomUpdateBtn"
                              onClick={() => startEdit(r)}
                            >
                              Update
                            </button>

                            <button
                              type="button"
                              className="roomRemoveBtn"
                              onClick={() => removeRoom(r.roomId)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                    </tr>

                    {editingId === r.roomId && (
                    <tr className="roomEditRow">
                      <td colSpan={7} className="roomEditCell">
                        <div
                            style={{
                            marginTop: 8,
                            padding: 12,
                            border: "1px solid #999",
                            borderRadius: 8,
                            }}
                        >
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <div>
                                <div style={{ fontSize: 12 }}>Name</div>
                                <input
                                value={edit.roomName}
                                onChange={(e) => setEdit({ ...edit, roomName: e.target.value })}
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 12 }}>Floor</div>
                                <input
                                value={edit.floor}
                                onChange={(e) => setEdit({ ...edit, floor: e.target.value })}
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 12 }}>Row Capacity</div>
                                <input
                                value={edit.rowCapacity}
                                onChange={(e) => setEdit({ ...edit, rowCapacity: e.target.value })}
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 12 }}>Column Capacity</div>
                                <input
                                value={edit.columnCapacity}
                                onChange={(e) => setEdit({ ...edit, columnCapacity: e.target.value })}
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 12 }}>Number of Invigilators</div>
                                <input
                                value={edit.numOfInvigilators}
                                onChange={(e) =>
                                    setEdit({ ...edit, numOfInvigilators: e.target.value })
                                }
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 12 }}>Maximum Major</div>
                                <input
                                value={edit.maxMajor}
                                onChange={(e) => setEdit({ ...edit, maxMajor: e.target.value })}
                                />
                            </div>

                            <div className="roomEditActions">
                              <button
                                type="button"
                                className="roomSaveBtn"
                                onClick={() => saveEdit(r.roomId)}
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                className="roomCancelBtn"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                            </div>

                            {editError && <p className="roomEditError">{editError}</p>}
                        </div>
                        </td>
                    </tr>
                    )}
                    </Fragment>
                ))}
                </>
            )}
            </tbody>
        </table>
        </div>
      </div>

      {showAdd && (
        <AddRoomModal onClose={() => setShowAdd(false)} onSave={handleAddFromModal} />
      )}
    </>
  );
}