import { API_BASE_URL, ENDPOINTS } from "./config";

// Types
export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    branch: string;
    is_active: boolean;
    join_date: string;
  };
  token?: string;
  message?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    phone: string;
  };
  token?: string;
  message?: string;
}

// Login with phone and PIN
export const login = async (
  phone: string,
  pin: string,
): Promise<LoginResponse> => {
  try {
    console.log(
      `Attempting to login with API URL: ${API_BASE_URL}${ENDPOINTS.LOGIN}`,
    );
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, pin }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      // Store token in localStorage if login successful
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");
      }
      return data;
    } else {
      return {
        success: false,
        message: data.message || "رقم PIN غير صحيح. يرجى المحاولة مرة أخرى.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        "خطأ في الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
    };
  }
};

// Signup with phone and PIN
export const signup = async (
  phone: string,
  pin: string,
): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SIGNUP}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, pin, branch: "01" }), // Default branch
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage if signup successful
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");
      }
      return data;
    } else {
      return { success: false, message: data.message || "Signup failed" };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuthenticated") === "true";
};
