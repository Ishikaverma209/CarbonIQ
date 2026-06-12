const API_URL = import.meta.env.VITE_API_URL || '';

const getHeaders = (user) => {
  const headers = { 'Content-Type': 'application/json' };
  if (user?.id) {
    headers['x-user-id'] = user.id;
    headers['x-user-name'] = user.name || '';
    headers['x-user-email'] = user.email || '';
  }
  return headers;
};

export const apiGet = async (path, user) => {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export const apiPost = async (path, body, user) => {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(user),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export const apiPut = async (path, body, user) => {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(user),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export const isBackendAvailable = () => !!API_URL;
