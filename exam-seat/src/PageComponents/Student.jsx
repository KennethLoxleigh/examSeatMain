import { Fragment, useEffect, useState } from "react";
import "./Student.css";
import AddStudentModal from "./AddStudentModal.jsx";
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi.js";

export default function Student({ onStudentCountChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const [editingRollNo, setEditingRollNo] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMajorId, setEditMajorId] = useState("");
  const [editError, setEditError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setStatus("");

    try {
      const data = await fetchStudents();

      const studentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.students)
        ? data.students
        : [];

      setStudents(studentList);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (onStudentCountChange) {
      onStudentCountChange(students.length);
    }
  }, [students, onStudentCountChange]);

  async function handleAddFromModal(payload) {
    try {
      const msg = await addStudent({
        rollNo: payload.roll_no?.trim(),
        name: payload.name?.trim(),
        majorId: payload.major_id?.trim(),
      });

      if (typeof msg === "string") {
        setStatus(msg);
      }

      setShowAdd(false);
      await loadStudents();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  function startEdit(student) {
    const rollNo = student.rollNo ?? student.roll_no ?? "";
    const name = student.name ?? "";
    const majorId = student.majorId ?? student.major_id ?? "";

    setEditingRollNo(rollNo);
    setEditName(name);
    setEditMajorId(String(majorId));
    setEditError("");
    setStatus("");
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

    if (!editName.trim()) {
      setEditError("Name is required.");
      return;
    }

    if (!editMajorId.trim()) {
      setEditError("Major ID is required.");
      return;
    }

    try {
      const msg = await updateStudent({
        rollNo,
        name: editName.trim(),
        majorId: editMajorId.trim(),
      });

      if (typeof msg === "string") {
        setStatus(msg);
      }

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

      if (typeof msg === "string") {
        setStatus(msg);
      }

      if (editingRollNo === rollNo) {
        cancelEdit();
      }

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

      {status && <p style={{ paddingLeft: "20px" }}>{status}</p>}

      <div className="stuList">
        <div className="stuTableWrap">
          <table className="stuTable">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Major ID</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="stuEmptyCell">
                    Loading...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="stuEmptyCell">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const rollNo = s.rollNo ?? s.roll_no ?? "";
                  const name = s.name ?? "";
                  const majorId = s.majorId ?? s.major_id ?? "";

                  return (
                    <Fragment key={rollNo}>
                      <tr>
                        <td>{rollNo}</td>
                        <td>{name}</td>
                        <td>{majorId}</td>
                        <td>
                          <div className="stuActionBtns">
                            <button
                              onClick={() => startEdit(s)}
                              className="updateBtn"
                              type="button"
                            >
                              Update
                            </button>

                            <button
                              onClick={() => removeStudent(rollNo)}
                              className="removeBtn"
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editingRollNo === rollNo && (
                        <tr className="stuEditRow">
                          <td colSpan={4} className="stuEditCell">
                            <div className="stuEditBox">
                              <div className="stuEditForm">
                                <div>
                                  <div className="stuEditLabel">Roll No</div>
                                  <input value={rollNo} disabled />
                                </div>

                                <div>
                                  <div className="stuEditLabel">Name</div>
                                  <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                  />
                                </div>

                                <div>
                                  <div className="stuEditLabel">Major ID</div>
                                  <input
                                    value={editMajorId}
                                    onChange={(e) =>
                                      setEditMajorId(e.target.value)
                                    }
                                  />
                                </div>

                                <div className="stuEditActions">
                                  <button
                                    type="button"
                                    className="stuSaveBtn"
                                    onClick={() => saveEdit(rollNo)}
                                  >
                                    Save
                                  </button>

                                  <button
                                    type="button"
                                    className="stuCancelBtn"
                                    onClick={cancelEdit}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              {editError && (
                                <p className="stuEditError">{editError}</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
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