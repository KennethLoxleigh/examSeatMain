const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/seating`;

async function handleResponse(res) {
  if (res.ok) return res;

  let message = `HTTP ${res.status} ${res.statusText}`;

  try {
    const data = await res.json();

    const trace = data.trace || "";
    const backendMessage = data.message || "";
    const backendError = data.error || "";

    if (
      trace.includes("No seating plan found for this room") ||
      backendMessage.includes("No seating plan found for this room")
    ) {
      message =
        "No saved seating plan for this room. Please click Generate Plan first.";
    } else {
      message = backendMessage || backendError || message;
    }
  } catch {
    const text = await res.text().catch(() => "");

    if (text.includes("No seating plan found for this room")) {
      message =
        "No saved seating plan for this room. Please click Generate Plan first.";
    } else if (text) {
      message = text;
    }
  }

  throw new Error(message);
}

export async function fetchSeatingRooms() {
  const res = await fetch(`${BASE_URL}/list-seating-rooms`);
  await handleResponse(res);
  return res.json();
}

export async function fetchSavedSeatingPlan(roomId) {
  const res = await fetch(`${BASE_URL}/view-plan/${roomId}`);
  await handleResponse(res);
  return res.json();
}

export async function generateSeatingPlan(roomId) {
  const res = await fetch(`${BASE_URL}/generate-plan/${roomId}`);
  await handleResponse(res);
  return res.json();
}

export async function downloadSeatingPlanPdf(roomId, roomName) {
  const res = await fetch(`${BASE_URL}/download-plan-pdf/${roomId}`);
  await handleResponse(res);

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${roomName || "seating-plan"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}