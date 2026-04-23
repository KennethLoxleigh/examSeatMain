import { useEffect, useState, Fragment } from "react";
import "./Invigilator.css";

import AddInvigilatorModal from "./AddInviModal.jsx";

import {
  fetchInvigilators,
  addInvigilator,
  updateInvigilator,
  deleteInvigilator,
} from "../api/inviApi.js";

const RANK_OPTIONS = ["CHIEF", "SENIOR", "ASSISTANT"];

function formatRank(rank) {
  if (!rank) return "";
  return rank.charAt(0) + rank.slice(1).toLowerCase();
}

export default function Invigilator({ onInvigilatorCountChange }) {
  const [invigilators, setInvigilators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  // dropdown update state
  const [editingId, setEditingId] = useState(null);
const [editName, setEditName] = useState("");
const [editRank, setEditRank] = useState("CHIEF");
const [editDept, setEditDept] = useState("");
const [editError, setEditError] = useState("");

  

  async function loadInvigilators() {
    setLoading(true);
    setStatus("");
    try {
      const data = await fetchInvigilators();

const invigilatorList = Array.isArray(data)
  ? data
  : Array.isArray(data?.invigilators)
  ? data.invigilators
  : [];

setInvigilators(invigilatorList);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvigilators();
  }, []);

  useEffect(() => {
  if (onInvigilatorCountChange) {
    onInvigilatorCountChange(invigilators.length);
  }
}, [invigilators, onInvigilatorCountChange]);

  async function handleAddFromModal(payload) {
  const msg = await addInvigilator({
    invigilatorName: payload.invigilatorName,
    rank: payload.rank,
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
  setEditRank(inv.rank ?? "CHIEF");
  setEditDept(inv.department ?? "");
}

  function cancelEdit() {
  setEditingId(null);
  setEditName("");
  setEditRank("CHIEF");
  setEditDept("");
  setEditError("");
}

  async function saveEdit(invigilatorId) {
  setEditError("");
  setStatus("");

  if (!editName.trim()) return setEditError("Name is required.");
  if (!editRank.trim()) return setEditError("Rank is required.");
  if (!editDept.trim()) return setEditError("Department is required.");

  try {
    const msg = await updateInvigilator(invigilatorId, {
      invigilatorName: editName.trim(),
      rank: editRank,
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

        <div style={{ paddingLeft: 80, paddingRight: 40, marginTop: 10 }}>
            <table className="inviTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rank</th>
                    <th>Department</th>
                    <th className="inviActionHead"></th>
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
                        <td>{formatRank(inv.rank)}</td>
                        <td>{inv.department}</td>
                        <td className="inviActionCell">
                          <div className="inviActionButtons">
                            <button
                              type="button"
                              className="inviUpdateBtn"
                              onClick={() => startEdit(inv)}
                            >
                              Update
                            </button>

                            <button
                              type="button"
                              className="inviRemoveBtn"
                              onClick={() => removeInvigilator(inv.invigilatorId)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        </tr>

                        {editingId === inv.invigilatorId && (
                          <tr className="inviEditRow">
                            <td colSpan={4} className="inviEditCell">
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
                                      <div style={{ fontSize: 12, marginBottom: 4 }}>Rank</div>
                                      <select
                                        value={editRank}
                                        onChange={(e) => setEditRank(e.target.value)}
                                      >
                                        {RANK_OPTIONS.map((rank) => (
                                          <option key={rank} value={rank}>
                                            {formatRank(rank)}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Department</div>
                                        <input
                                        value={editDept}
                                        onChange={(e) => setEditDept(e.target.value)}
                                        />
                                    </div>

                                    <div className="inviEditActions">
                                      <button
                                        type="button"
                                        className="inviSaveBtn"
                                        onClick={() => saveEdit(inv.invigilatorId)}
                                      >
                                        Save
                                      </button>

                                      <button
                                        type="button"
                                        className="inviCancelBtn"
                                        onClick={cancelEdit}
                                      >
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