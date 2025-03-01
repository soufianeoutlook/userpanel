// API configuration
export const API_BASE_URL = "http://localhost:5000/api";

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",

  // Users
  USER_PROFILE: "/users/profile",
  UPDATE_USER: "/users/update",
  DELETE_USER: "/users/delete",

  // Cards
  GET_CARDS: "/cards",
  ACTIVATE_CARD: "/cards/activate",
  USE_CARD: "/cards/use",

  // Gifts
  GET_GIFTS: "/gifts",
  ACTIVATE_GIFT: "/gifts/activate",
  USE_GIFT: "/gifts/use",

  // Policy pages
  GET_POLICY: "/policy",
};
