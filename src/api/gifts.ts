import { API_BASE_URL, ENDPOINTS } from "./config";

// Types
export interface GiftCard {
  id: number;
  name: string;
  serial_number: string;
  description: string | null;
  type: string | null;
  usage_limit: number;
  validity_days: number;
  status: "unclaimed" | "claimed" | "used";
  expiry_date: string | null;
  created_at: string;
  claim_date?: string;
  used_date?: string;
}

export interface UserGiftCard {
  id: number;
  user_id: number;
  gift_card_id: number;
  claim_date: string;
  used_date: string | null;
  gift: GiftCard;
}

// Get all gifts for the current user
export const getUserGifts = async (): Promise<UserGiftCard[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_GIFTS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch gifts");
    }

    const data = await response.json();
    return data.gifts || [];
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return [];
  }
};

// Activate a new gift
export const activateGift = async (
  serialNumber: string,
): Promise<{ success: boolean; message: string; gift?: GiftCard }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ACTIVATE_GIFT}`, {
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
        message: "Gift activated successfully",
        gift: data.gift,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to activate gift",
      };
    }
  } catch (error) {
    console.error("Error activating gift:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Use a gift
export const useGift = async (
  giftId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USE_GIFT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gift_id: giftId }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Gift used successfully" };
    } else {
      return { success: false, message: data.message || "Failed to use gift" };
    }
  } catch (error) {
    console.error("Error using gift:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};
