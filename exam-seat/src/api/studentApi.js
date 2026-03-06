// src/api/studentApi.js

//const BASE_URL = "http://localhost:8080/api/v1/student"; 

// If you're using Vite, you can do:

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/student`;

async function handleResponse(res) {
  if (!res.ok) {
    // Try to read server error text (helpful for debugging)
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

// GET: returns JSON (List<Student>)
export async function fetchStudents() {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/list-student`, { method: "GET" })
  );
  return res.json(); // <-- JSON array of students
}

// POST: returns String (plain text)
export async function addStudent(student) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/add-student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student), // { rollNo, name, majorId }
    })
  );
  return res.text(); // <-- "success adding student"
}

// DELETE: returns String (plain text)
export async function deleteStudent(rollNo) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/delete-student/${encodeURIComponent(rollNo)}`, {
      method: "DELETE",
    })
  );
  return res.text(); // <-- "Student with roll no X deleted"
}

// PUT: returns String (plain text)
export async function updateStudent(student) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/update-student`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    })
  );
  return res.text(); // <-- "Student with roll no X updated"
}

// POST: returns String (plain text)
export async function resetAllStudents() {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/reset-all`, { method: "POST" })
  );
  return res.text();
}

// POST: returns String (plain text)
export async function resetRoom(roomId) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/reset-room/${roomId}`, { method: "POST" })
  );
  return res.text();
}