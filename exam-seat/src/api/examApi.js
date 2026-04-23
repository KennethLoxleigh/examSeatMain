// src/api/examApi.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/api/v1/exam`;

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `HTTP ${response.status} ${response.statusText}`);
  }
  return response;
}

export async function fetchExams() {
  const response = await handleResponse(
    await fetch(`${BASE_URL}/list-exam`)
  );
  return response.json();
}

export async function addExam(exam) {
  const payload = {
    examId: exam.examId,
    subject: exam.subject,
    examDate: exam.examDate,
    examTime: exam.examTime,
  };

  const response = await handleResponse(
    await fetch(`${BASE_URL}/add-exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  );

  return response.text();
}

export async function updateExam(examId, exam) {
  const payload = {
    examId: exam.examId,
    subject: exam.subject,
    examDate: exam.examDate,
    examTime: exam.examTime,
  };

  const response = await handleResponse(
    await fetch(`${BASE_URL}/update-exam/${encodeURIComponent(examId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  );

  return response.text();
}

export async function deleteExam(examId) {
  const response = await handleResponse(
    await fetch(`${BASE_URL}/delete-exam/${encodeURIComponent(examId)}`, {
      method: "DELETE",
    })
  );

  return response.text();
}

export async function deleteAllExams() {
  const response = await handleResponse(
    await fetch(`${BASE_URL}/delete-all/exam`, {
      method: "DELETE",
    })
  );

  return response.text();
}