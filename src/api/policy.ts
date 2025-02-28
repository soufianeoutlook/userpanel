import { API_BASE_URL, ENDPOINTS } from "./config";

// Types
export interface PolicyPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Get policy page by slug
export const getPolicyPage = async (
  slug: string,
): Promise<{ success: boolean; page?: PolicyPage; message?: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.GET_POLICY}?slug=${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, page: data.page };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch policy page",
      };
    }
  } catch (error) {
    console.error(`Error fetching policy page (${slug}):`, error);
    return { success: false, message: "Network error. Please try again." };
  }
};
