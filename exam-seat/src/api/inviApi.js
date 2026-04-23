// exam-seat/src/api/invigilatorApi.js

// If you are using .env like:
// VITE_API_BASE_URL=http://192.168.x.x:8080
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/invigilator`;
const ASSIGNMENT_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/invigilatorAssignment`;

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
  // Expected shape:
// { invigilatorName: "Name", rank: "CHIEF", department: "Dept" }
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

export async function checkInvigilatorName(invigilatorName) {
  const cleanName = invigilatorName.trim().toLowerCase();

  // 1) First check if the invigilator exists
  const invRes = await handleResponse(
    await fetch(`${BASE_URL}/list-invigilator`, { method: "GET" })
  );

  const invigilators = await invRes.json();

  const found = invigilators.find(
    (item) =>
      item.invigilatorName?.trim().toLowerCase() === cleanName
  );

  if (!found) {
    return { ok: false, message: "Invigilator not found" };
  }

  // 2) Then check duties
  const dutyRes = await fetch(
    `${ASSIGNMENT_URL}/my-duties/${encodeURIComponent(invigilatorName)}`
  );

  // if backend says bad request / no assignments,
  // treat it as valid login with empty duties
  if (!dutyRes.ok) {
    const msg = await dutyRes.text().catch(() => "");

    if (
      msg.toLowerCase().includes("no assignments found") ||
      msg.toLowerCase().includes("no duties found")
    ) {
      return { ok: true, data: [] };
    }

    return { ok: false, message: msg || "Failed to fetch invigilator duties" };
  }

  const duties = await dutyRes.json();
  return { ok: true, data: Array.isArray(duties) ? duties : [] };
}