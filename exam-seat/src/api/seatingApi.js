
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/student`;

async function handleJsonResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json();
}

async function handleTextResponse(response) {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || "Request failed");
  }
  return text;
}

export async function fetchSeatingRooms() {
  const response = await fetch(`${BASE_URL}/list-seating-rooms`);
  return handleJsonResponse(response);
}

export async function fetchSavedSeatingPlan(roomId) {
  const response = await fetch(`${BASE_URL}/view-plan/${roomId}`);
  return handleJsonResponse(response);
}

export async function generateSeatingPlan(roomId) {
  const response = await fetch(`${BASE_URL}/generate-plan/${roomId}`);
  return handleJsonResponse(response);
}

export async function deleteSeatingPlanByRoom(roomId) {
  const response = await fetch(`${BASE_URL}/delete-room-plan/${roomId}`, {
    method: "DELETE",
  });
  return handleTextResponse(response);
}