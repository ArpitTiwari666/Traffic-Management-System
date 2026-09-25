// src/api.js

// ============================================================
// CITYVISION AI - API CONFIGURATION
// ============================================================

// Production backend on Render
const PRODUCTION_API = "https://cityvision-backend-a18f.onrender.com";

// Local backend for development
const LOCAL_API = "http://127.0.0.1:8000";

// Use Render when the frontend is deployed.
// Use localhost when running the frontend locally.
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API
    : PRODUCTION_API;

const TOKEN_KEY = "cityvision_token";

// ============================================================
// AUTH TOKEN
// ============================================================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ============================================================
// LOGIN
// ============================================================

export async function login(username, password) {
  const body = new URLSearchParams();

  body.append("username", username);
  body.append("password", password);

  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    let message = "Login failed";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore invalid JSON response
    }

    throw new Error(message);
  }

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }

  return data;
}

// ============================================================
// GENERIC API REQUEST
// ============================================================

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // Add JWT token when available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Automatically convert normal JS objects to JSON
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers["Content-Type"] = "application/json";

    options = {
      ...options,
      body: JSON.stringify(options.body),
    };
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    // Network/CORS/server unavailable
    throw new Error(
      `Unable to connect to CityVision backend at ${API_BASE}`
    );
  }

  // Authentication expired
  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (data?.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      // Ignore invalid JSON response
    }

    throw new Error(message);
  }

  // No content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ============================================================
// WEBSOCKET
// ============================================================

export function wsUrl(path = "/ws/feed") {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return `ws://127.0.0.1:8000${path}`;
  }

  // Render uses HTTPS, therefore WebSocket must use WSS
  return `wss://cityvision-backend-a18f.onrender.com${path}`;
}

// ============================================================
// API ENDPOINT HELPERS
// ============================================================

export const API_ENDPOINTS = {
  health: "/api/health",

  login: "/api/auth/login",

  dashboard: {
    summary: "/api/dashboard/summary",
    activityFeed: "/api/dashboard/activity-feed",
  },

  cameras: "/api/cameras",
  vehicles: "/api/vehicles",
  gis: "/api/gis",
  analytics: "/api/analytics",
  alerts: "/api/alerts",
  reports: "/api/reports",
  settings: "/api/settings",

  websocket: "/ws/feed",
};

// ============================================================
// EXPORT
// ============================================================

export { API_BASE };