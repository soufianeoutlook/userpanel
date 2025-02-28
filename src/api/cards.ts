import { API_BASE_URL, ENDPOINTS } from "./config";

// Types
export interface StampCard {
  id: number;
  name: string;
  serial_number: string;
  description: string | null;
  image_url: string | null;
  total_stamps: number;
  status: "active" | "inactive";
  created_at: string;
  current_stamps?: number;
  activation_date?: string;
}

export interface UserStampCard {
  id: number;
  user_id: number;
  stamp_card_id: number;
  current_stamps: number;
  activation_date: string;
  card: StampCard;
}

// Get all cards for the current user
export const getUserCards = async (): Promise<UserStampCard[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_CARDS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }

    const data = await response.json();
    return data.cards || [];
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
};

// Activate a new card
export const activateCard = async (
  serialNumber: string,
): Promise<{ success: boolean; message: string; card?: StampCard }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACTIVATE_CARD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serial_number: serialNumber }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Card activated successfully",
        card: data.card,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to activate card",
      };
    }
  } catch (error) {
    console.error("Error activating card:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Use a card (increment stamps)
export const useCard = async (
  cardId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USE_CARD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ card_id: cardId }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Card used successfully" };
    } else {
      return { success: false, message: data.message || "Failed to use card" };
    }
  } catch (error) {
    console.error("Error using card:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};
