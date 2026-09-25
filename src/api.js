// src/api.js

// ============================================================
// CityVision AI - Frontend API Configuration
// ============================================================

const API_BASE_URL =
  "https://cityvision-backend-a18f.onrender.com";


// ============================================================
// Token Management
// ============================================================

const TOKEN_KEY = "cityvision_token";
const USER_KEY = "cityvision_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}


// ============================================================
// Build API URL
// ============================================================

function buildUrl(path = "") {
  if (!path) {
    return API_BASE_URL;
  }

  // Already an absolute URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}


// ============================================================
// Common API Request
// ============================================================

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Add JSON content type only when a body exists.
  if (
    options.body &&
    !headers["Content-Type"] &&
    !headers["content-type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  // Add authentication token when available.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      mode: "cors",
    });
  } catch (error) {
    console.error("CityVision API connection error:", error);

    throw new Error(
      `Unable to connect to CityVision backend at ${API_BASE_URL}`
    );
  }

  // ==========================================================
  // Unauthorized
  // ==========================================================

  if (response.status === 401) {
    clearToken();
    clearUser();

    window.dispatchEvent(
      new CustomEvent("cityvision:unauthorized")
    );

    throw new Error("Session expired. Please login again.");
  }

  // ==========================================================
  // Other HTTP errors
  // ==========================================================

  if (!response.ok) {
    let message = `API request failed (${response.status})`;

    try {
      const errorData = await response.json();

      message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        message;
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  // ==========================================================
  // Empty response
  // ==========================================================

  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  // JSON response
  if (contentType.includes("application/json")) {
    return await response.json();
  }

  // Text response
  return await response.text();
}


// ============================================================
// Login
// ============================================================

export async function login(username, password) {
  let response;

  try {
    response = await fetch(
      buildUrl("/api/auth/login"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );
  } catch (error) {
    console.error("CityVision login connection error:", error);

    throw new Error(
      `Unable to connect to CityVision backend at ${API_BASE_URL}`
    );
  }

  // ==========================================================
  // Login failed
  // ==========================================================

  if (!response.ok) {
    let message = "Login failed";

    try {
      const errorData = await response.json();

      message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        message;
    } catch {
      // Ignore invalid/non-JSON response.
    }

    throw new Error(message);
  }

  // ==========================================================
  // Read login response
  // ==========================================================

  const data = await response.json();

  // Support common FastAPI authentication formats.
  const token =
    data?.access_token ||
    data?.token ||
    data?.accessToken ||
    null;

  if (token) {
    setToken(token);
  }

  // ==========================================================
  // Store user information
  // ==========================================================

  if (data?.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );
  } else if (data?.username) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        username: data.username,
        role: data.role || "ADMIN",
      })
    );
  } else {
    // Fallback user object
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        username,
        role: data?.role || "ADMIN",
      })
    );
  }

  return data;
}


// ============================================================
// Logout
// ============================================================

export function logout() {
  clearToken();
  clearUser();

  window.dispatchEvent(
    new CustomEvent("cityvision:logout")
  );
}


// ============================================================
// WebSocket URL
// ============================================================

export function wsUrl(path = "") {
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";

  const wsBase = API_BASE_URL.replace(
    /^https?:\/\//i,
    (protocol) =>
      protocol.toLowerCase() === "https://"
        ? "wss://"
        : "ws://"
  );

  return `${wsBase}${normalizedPath}`;
}


// ============================================================
// Backend Health Check
// ============================================================

export async function checkHealth() {
  return apiFetch("/api/health");
}


// ============================================================
// Root Backend Check
// ============================================================

export async function checkBackend() {
  return apiFetch("/");
}


// ============================================================
// Default Export
// ============================================================

export default {
  API_BASE_URL,
  apiFetch,
  login,
  logout,
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  clearUser,
  wsUrl,
  checkHealth,
  checkBackend,
};