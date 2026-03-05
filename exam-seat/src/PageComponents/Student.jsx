import { useEffect, useState } from "react";
import "./Student.css";
import { getStudents, addStudent } from "./api.js";
import AddStudentModal from "./AddStudentModal";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const list = await getStudents();
      setStudents(list);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (student) => {
    await addStudent(student);
    await load(); // refresh table after insert
  };

  return (
    <>
      <div className="stuWrapper">
        <div className="stuHeadLeft">Students</div>

        <div className="stuHeadRight">
          <button className="stuAddBtn" onClick={() => setOpen(true)}>
            Add Student
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "salmon" }}>{err}</p>}

      <table className="stuList">
        <thead className="stuHeader">
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Major ID</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.roll_no}>
              <td>{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.major_id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && <AddStudentModal onClose={() => setOpen(false)} onSave={handleSave} />}
    </>
  );
}