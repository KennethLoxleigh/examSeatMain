
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/invigilatorAssignment`;


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

export async function fetchAllAssignments() {
  const response = await fetch(`${BASE_URL}/list-assignment`);
  return handleJsonResponse(response);
}

export async function generateAssignmentPlan(examId) {
  const response = await fetch(`${BASE_URL}/generate-assignment/${examId}`, {
    method: "POST",
  });
  return handleTextResponse(response);
}

export async function deleteAssignmentById(assignmentId) {
  const response = await fetch(`${BASE_URL}/delete-assignment/${assignmentId}`, {
    method: "DELETE",
  });
  return handleTextResponse(response);
}

export async function deleteAssignmentsByExam(examId) {
  const response = await fetch(`${BASE_URL}/delete-room-assignment/${examId}`, {
    method: "DELETE",
  });
  return handleTextResponse(response);
}

export async function updateAssignmentById(assignmentId, assignmentData) {
  const response = await fetch(`${BASE_URL}/update-assignment/${assignmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assignmentData),
  });
  return handleTextResponse(response);
}

export async function downloadAssignmentsPdf() {
  const response = await fetch(`${BASE_URL}/download-pdf`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to download PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Invigilator_Assignments.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}