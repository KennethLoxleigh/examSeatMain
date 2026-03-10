import { useEffect, useState } from "react";
import "./Student.css";
import AddStudentModal from "./AddStudentModal.jsx";

// ✅ IMPORTANT: pick ONE import based on your folder:
// If Student.jsx is at src/PageComponents/Student.jsx use this:
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api/studentApi.js";

// If Student.jsx is at src/AdminPages/PageComponents/Student.jsx use this instead:
// import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../../api/studentApi.js";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // add modal
  const [showAdd, setShowAdd] = useState(false);

  // edit dropdown per-row
  const [editingRollNo, setEditingRollNo] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMajorId, setEditMajorId] = useState("");
  const [editError, setEditError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setStatus("");
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // AddStudentModal returns: { roll_no, name, major_id } :contentReference[oaicite:3]{index=3}
  async function handleAddFromModal(payload) {
    const msg = await addStudent({
      rollNo: payload.roll_no.trim(),
      name: payload.name.trim(),
      majorId: payload.major_id.trim(),
    });

    setStatus(msg);
    await loadStudents();
  }

  function startEdit(student) {
    setEditError("");
    setStatus("");
    setEditingRollNo(student.rollNo);
    setEditName(student.name ?? "");
    setEditMajorId(String(student.majorId ?? ""));
  }

  function cancelEdit() {
    setEditingRollNo(null);
    setEditName("");
    setEditMajorId("");
    setEditError("");
  }

  async function saveEdit(rollNo) {
    setEditError("");
    setStatus("");

    if (!editName.trim()) return setEditError("Name is required.");
    if (!editMajorId.trim()) return setEditError("Major ID is required.");

    try {
      const msg = await updateStudent({
        rollNo,
        name: editName.trim(),
        majorId: editMajorId.trim(),
      });
      setStatus(msg);
      cancelEdit();
      await loadStudents();
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function removeStudent(rollNo) {
    setStatus("");
    try {
      const msg = await deleteStudent(rollNo);
      setStatus(msg);

      if (editingRollNo === rollNo) cancelEdit();

      await loadStudents();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <div className="stuWrapper">
        <div className="stuHeadLeft">Students</div>
        <div className="stuHeadRight">
          <button className="stuAddBtn" onClick={() => setShowAdd(true)}>
            Add Student
          </button>
        </div>
      </div>

      {status && <p style={{ color: "white", paddingLeft: 20 }}>{status}</p>}

      <div className="stuList">

        <div style={{ paddingLeft: 80, paddingRight: 80, marginTop: 10 }}>
            <table
                border="1"
                cellPadding="10"
                style={{ width: "100%", color: "white", borderCollapse: "collapse" }}
            >
                <thead>
                <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Major ID</th>
                    <th style={{ width: 240 }}></th> {/* no "Action" header */}
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
                    <>
                    {students.map((s) => (
                        <tr key={s.rollNo}>
                        <td>{s.rollNo}</td>
                        <td>{s.name}</td>
                        <td>{s.majorId}</td>
                        <td>
                            <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => startEdit(s)}>Update</button>
                            <button onClick={() => removeStudent(s.rollNo)}>Remove</button>
                            </div>
                        </td>
                        </tr>
                    ))}

                    {editingRollNo &&
                        students
                            .filter((s) => s.rollNo === editingRollNo)
                            .map((s) => (
                            <tr key={`${s.rollNo}-edit`}>
                                <td colSpan={4}>
                                <div
                                    style={{
                                    marginTop: 8,
                                    padding: 12,
                                    border: "1px solid white",
                                    borderRadius: 8,
                                    }}
                                >
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Roll No</div>
                                        <input value={s.rollNo} disabled />
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Name</div>
                                        <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Major ID</div>
                                        <input
                                        value={editMajorId}
                                        onChange={(e) => setEditMajorId(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
                                        <button onClick={() => saveEdit(s.rollNo)}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </div>
                                    </div>

                                    {editError && (
                                    <p style={{ marginTop: 8, color: "#ff6b6b" }}>{editError}</p>
                                    )}
                                </div>
                                </td>
                            </tr>
                            ))}
                    </>
                )}
                </tbody>
            </table>
        </div>
      </div>

      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddFromModal}
        />
      )}
    </>
  );
}