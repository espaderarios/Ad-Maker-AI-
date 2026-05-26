const API_BASE = import.meta.env.VITE_WORKER_BASE || import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export class APIClient {
  static getToken() {
    return localStorage.getItem('token');
  }

  static getHeaders(token = null) {
    const headers = { 'Content-Type': 'application/json' };
    const authToken = token || this.getToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return headers;
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(options.token),
    });

    if (!response.ok) {
      let errMsg = 'Request failed';
      try {
        const error = await response.json();
        errMsg = error.error || error.message || errMsg;
      } catch (e) {
        // ignore parse error
      }
      throw new Error(errMsg);
    }

    // Attempt to parse JSON, but handle empty bodies gracefully
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  static get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
