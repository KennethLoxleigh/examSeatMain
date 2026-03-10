import { useEffect, useState, Fragment } from "react";
import "./Invigilator.css";

import AddInvigilatorModal from "./AddInviModal.jsx";

import {
  fetchInvigilators,
  addInvigilator,
  updateInvigilator,
  deleteInvigilator,
} from "../api/inviApi.js";

export default function Invigilator() {
  const [invigilators, setInvigilators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  // dropdown update state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editError, setEditError] = useState("");

  async function loadInvigilators() {
    setLoading(true);
    setStatus("");
    try {
      const data = await fetchInvigilators();
      setInvigilators(data);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvigilators();
  }, []);

  async function handleAddFromModal(payload) {
    const msg = await addInvigilator({
      invigilatorName: payload.invigilatorName,
      department: payload.department,
    });
    setStatus(msg);
    await loadInvigilators();
  }

  function startEdit(inv) {
    setEditError("");
    setStatus("");
    setEditingId(inv.invigilatorId);
    setEditName(inv.invigilatorName ?? "");
    setEditDept(inv.department ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDept("");
    setEditError("");
  }

  async function saveEdit(invigilatorId) {
    setEditError("");
    setStatus("");

    if (!editName.trim()) return setEditError("Name is required.");
    if (!editDept.trim()) return setEditError("Department is required.");

    try {
      const msg = await updateInvigilator(invigilatorId, {
        invigilatorName: editName.trim(),
        department: editDept.trim(),
      });
      setStatus(msg);
      cancelEdit();
      await loadInvigilators();
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function removeInvigilator(invigilatorId) {
    setStatus("");
    try {
      const msg = await deleteInvigilator(invigilatorId);
      setStatus(msg);

      if (editingId === invigilatorId) cancelEdit();

      await loadInvigilators();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="inviWrapper">
        <div className="inviHeadLeft">Invigilators</div>
        <div className="inviHeadRight">
          <button className="inviAddBtn" onClick={() => setShowAdd(true)}>
            Add Invigilator
          </button>
        </div>
      </div>

      {status && <p style={{ color: "white", paddingLeft: 20 }}>{status}</p>}

      {/* Table Header row (your existing UI) */}
      <div className="inviList">

        <div style={{ paddingLeft: 80, paddingRight: 80, marginTop: 10 }}>
            <table
                border="1"
                cellPadding="10"

                style={{ width: "100%", color: "white", borderCollapse: "collapse" }}
            >
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Rank (ID)</th>
                    <th>Department</th>
                    <th style={{ width: 240 }}></th> {/* no Action header */}
                </tr>
                </thead>

                <tbody>
                {loading ? (
                    <tr>
                    <td colSpan={4} style={{ padding: 10 }}>
                        Loading...
                    </td>
                    </tr>
                ) : (
                    invigilators.map((inv) => (
                    <Fragment key={inv.invigilatorId}>
                        <tr>
                        <td>{inv.invigilatorName}</td>
                        <td>{inv.invigilatorId}</td>
                        <td>{inv.department}</td>
                        <td>
                            <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => startEdit(inv)}>Update</button>
                            <button onClick={() => removeInvigilator(inv.invigilatorId)}>
                                Remove
                            </button>
                            </div>
                        </td>
                        </tr>

                        {editingId === inv.invigilatorId && (
                            <tr>
                                <td colSpan={4}>
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
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>ID</div>
                                        <input value={inv.invigilatorId} disabled />
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Name</div>
                                        <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Department</div>
                                        <input
                                        value={editDept}
                                        onChange={(e) => setEditDept(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
                                        <button type="button" onClick={() => saveEdit(inv.invigilatorId)}>
                                        Save
                                        </button>
                                        <button type="button" onClick={cancelEdit}>
                                        Cancel
                                        </button>
                                    </div>
                                    </div>

                                    {editError && (
                                    <p style={{ marginTop: 8, color: "#ff6b6b" }}>{editError}</p>
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
      {/* Add modal */}
      {showAdd && (
        <AddInvigilatorModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddFromModal}
        />
      )}
    </>
  );
}