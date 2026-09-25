// src/api.js

// ============================================================
// CityVision AI - Frontend API Configuration
// ============================================================

const API_BASE_URL =
  "https://cityvision-backend-a18f.onrender.com";


// ------------------------------------------------------------
// Token management
// ------------------------------------------------------------

const TOKEN_KEY = "cityvision_token";

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


// ------------------------------------------------------------
// Build API URL
// ------------------------------------------------------------

function buildUrl(path) {
  if (!path) {
    return API_BASE_URL;
  }

  // Already an absolute URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Make sure there is exactly one slash
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}


// ------------------------------------------------------------
// Common API request
// ------------------------------------------------------------

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);

  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  // Only add JSON content type when a body exists
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Send authentication token when available
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
    throw new Error(
      `Unable to connect to CityVision backend at ${API_BASE_URL}`
    );
  }

  // ----------------------------------------------------------
  // Handle unauthorized requests
  // ----------------------------------------------------------

  if (response.status === 401) {
    clearToken();

    window.dispatchEvent(
      new CustomEvent("cityvision:unauthorized")
    );

    throw new Error("Session expired. Please login again.");
  }

  // ----------------------------------------------------------
  // Handle other HTTP errors
  // ----------------------------------------------------------

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
      // Response was not JSON
    }

    throw new Error(message);
  }

  // ----------------------------------------------------------
  // Handle empty responses
  // ----------------------------------------------------------

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


// ------------------------------------------------------------
// Login
// ------------------------------------------------------------

export async function login(username, password) {
  const response = await fetch(
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

  if (!response.ok) {
    let message = "Login failed";

    try {
      const data = await response.json();

      message =
        data?.detail ||
        data?.message ||
        data?.error ||
        message;
    } catch {
      // Ignore invalid JSON response
    }

    throw new Error(message);
  }

  const data = await response.json();

  // Support common FastAPI token response formats
  const token =
    data?.access_token ||
    data?.token ||
    data?.accessToken ||
    null;

  if (token) {
    setToken(token);
  }

  // Store user information if supplied
  if (data?.user) {
    localStorage.setItem(
      "cityvision_user",
      JSON.stringify(data.user)
    );
  } else if (data?.username) {
    localStorage.setItem(
      "cityvision_user",
      JSON.stringify({
        username: data.username,
        role: data.role || "ADMIN",
      })
    );
  }

  return data;
}


// ------------------------------------------------------------
// WebSocket URL
// ------------------------------------------------------------

export function wsUrl(path = "") {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const wsBase = API_BASE_URL.replace(
    /^https?:\/\//i,
    (protocol) =>
      protocol.toLowerCase() === "https://"
        ? "wss://"
        : "ws://"
  );

  return `${wsBase}${normalizedPath}`;
}


// ------------------------------------------------------------
// Backend health check
// ------------------------------------------------------------

export async function checkHealth() {
  return apiFetch("/api/health");
}


// ------------------------------------------------------------
// Default export
// ------------------------------------------------------------

export default {
  API_BASE_URL,
  apiFetch,
  login,
  getToken,
  setToken,
  clearToken,
  wsUrl,
  checkHealth,
};