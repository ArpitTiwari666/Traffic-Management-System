// src/api.js

// ============================================================
// CityVision AI API Configuration
// ============================================================

const LOCAL_API_BASE = "http://127.0.0.1:8000";
const PRODUCTION_API_BASE = "https://cityvision-backend-a18f.onrender.com";

// Automatically use Render in production and localhost during development.
export const API_BASE = import.meta.env.PROD
  ? PRODUCTION_API_BASE
  : LOCAL_API_BASE;

const TOKEN_KEY = "cityvision_token";

// ============================================================
// Authentication Token
// ============================================================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ============================================================
// Login
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
      // Ignore JSON parsing errors
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
// Generic API Request
// ============================================================

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Automatically encode normal JS objects as JSON.
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
    throw new Error(
      `Unable to connect to CityVision backend at ${API_BASE}`
    );
  }

  // Token expired / authentication required.
  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();
      message = data.detail || data.message || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ============================================================
// WebSocket
// ============================================================

export function wsUrl(path = "/ws/feed") {
  const production = import.meta.env.PROD;

  if (production) {
    return `wss://cityvision-backend-a18f.onrender.com${path}`;
  }

  return `ws://127.0.0.1:8000${path}`;
}

// ============================================================
// Health Check
// ============================================================

export async function healthCheck() {
  return apiFetch("/api/health");
}