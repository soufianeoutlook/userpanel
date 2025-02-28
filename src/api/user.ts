import { API_BASE_URL, ENDPOINTS } from "./config";

// Types
export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  branch: string;
  is_active: boolean;
  join_date: string;
  created_at: string;
  updated_at: string;
}

// Get user profile
export const getUserProfile = async (): Promise<{
  success: boolean;
  user?: User;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER_PROFILE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Update stored user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch user profile",
      };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Update user profile
export const updateUserProfile = async (
  userData: Partial<User>,
): Promise<{ success: boolean; user?: User; message?: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_USER}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      // Update stored user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } else {
      return {
        success: false,
        message: data.message || "Failed to update user profile",
      };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Update user PIN
export const updateUserPin = async (
  currentPin: string,
  newPin: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_USER}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ current_pin: currentPin, new_pin: newPin }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "PIN updated successfully" };
    } else {
      return {
        success: false,
        message: data.message || "Failed to update PIN",
      };
    }
  } catch (error) {
    console.error("Error updating PIN:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Delete user account
export const deleteUserAccount = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE_USER}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      return { success: true, message: "Account deleted successfully" };
    } else {
      return {
        success: false,
        message: data.message || "Failed to delete account",
      };
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};
