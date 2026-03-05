const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getStudents() {
  const res = await fetch(`${API_BASE}/api/students`);
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load students");
  return data.students;
}

export async function addStudent(student) {
  const res = await fetch(`${API_BASE}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.message || "Failed to add student");
  return true;
}