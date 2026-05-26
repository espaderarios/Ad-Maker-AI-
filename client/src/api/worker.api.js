const WORKER_BASE = import.meta.env.VITE_WORKER_BASE || '';

function getToken() {
  return localStorage.getItem('token');
}

export async function generateWithWorker(formData) {
  const url = WORKER_BASE ? `${WORKER_BASE}/ai/replicate` : `/api/worker/ai/replicate`;
  const token = getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Worker request failed');
  }

  return res.json();
}

export async function generateWithFal(formData) {
  const url = WORKER_BASE ? `${WORKER_BASE}/ai/fal` : `/api/worker/ai/fal`;
  const token = getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Worker request failed');
  }

  return res.json();
}

export default { generateWithWorker, generateWithFal };
