// exam-seat/src/api/invigilatorApi.js

// If you are using .env like:
// VITE_API_BASE_URL=http://192.168.x.x:8080
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/invigilator`;

// If you ever switch to Vite proxy (recommended), you can use this instead:
// const BASE_URL = `/api/v1/invigilator`;

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

/** GET: returns JSON (List<invigilator>) */
export async function fetchInvigilators() {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/list-invigilator`, { method: "GET" })
  );
  return res.json();
}

/** POST: returns String (plain text) */
export async function addInvigilator(invigilator) {
  // Expected shape (based on your controller/service):
  // { invigilatorName: "Name", department: "Dept" }
  const res = await handleResponse(
    await fetch(`${BASE_URL}/add-invigilator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invigilator),
    })
  );
  return res.text();
}

/** DELETE: returns String (plain text) */
export async function deleteInvigilator(invigilatorId) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/delete-invigilator/${invigilatorId}`, {
      method: "DELETE",
    })
  );
  return res.text();
}

/** PUT: returns String (plain text) */
export async function updateInvigilator(invigilatorId, invigilator) {
  // invigilator object should include:
  // { invigilatorName: "...", department: "..." }
  const res = await handleResponse(
    await fetch(`${BASE_URL}/update-invigilator/${invigilatorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invigilator),
    })
  );
  return res.text();
}