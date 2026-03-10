// exam-seat/src/api/roomApi.js

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/room`;

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

export async function fetchRooms() {
  const res = await handleResponse(await fetch(`${BASE_URL}/list-room`));
  return res.json();
}

export async function addRoom(room) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/add-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })
  );
  return res.text();
}

export async function deleteRoom(roomId) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/delete-room/${roomId}`, { method: "DELETE" })
  );
  return res.text();
}

export async function updateRoom(roomId, room) {
  const res = await handleResponse(
    await fetch(`${BASE_URL}/update-room/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    })
  );
  return res.text();
}