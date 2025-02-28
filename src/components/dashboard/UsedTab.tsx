import React, { useState, useEffect } from "react";
import { Gift, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";

interface UsedItem {
  id: string;
  name: string;
  code: string;
  type: "gift" | "card";
  usedDate: string;
  status: "used" | "expired";
}

interface UsedTabProps {
  items?: UsedItem[];
}

const UsedTab = ({ items: propItems }: UsedTabProps) => {
  const [items, setItems] = useState<UsedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch used items from API
  useEffect(() => {
    const fetchUsedItems = async () => {
      try {
        // Fetch used gifts
        const { getUserGifts } = await import("../../api/gifts");
        const userGifts = await getUserGifts();

        // Transform API data to component format - only used gifts
        const usedGifts = userGifts
          .filter((gift) => gift.used_date) // Only show used gifts
          .map((userGift) => ({
            id: `gift-${userGift.id}`,
            name: userGift.gift.name,
            code: userGift.gift.serial_number,
            type: "gift" as const,
            usedDate: userGift.used_date
              ? new Date(userGift.used_date).toLocaleDateString("ar-SA")
              : "01/01/2023",
            status: "used" as const,
          }));

        // Fetch expired cards
        const { getUserCards } = await import("../../api/cards");
        const userCards = await getUserCards();

        // Transform API data - only expired cards
        const expiredCards = userCards
          .filter((card) => card.card.status === "inactive") // Only show inactive cards
          .map((userCard) => ({
            id: `card-${userCard.id}`,
            name: userCard.card.name,
            code: userCard.card.serial_number,
            type: "card" as const,
            usedDate: userCard.activation_date
              ? new Date(userCard.activation_date).toLocaleDateString("ar-SA")
              : "01/01/2023",
            status: "expired" as const,
          }));

        setItems([...usedGifts, ...expiredCards]);
      } catch (error) {
        console.error("Error fetching used items:", error);
        // Use default items if API fails
        setItems([
          {
            id: "1",
            name: "بطاقة الولاء الذهبية",
            code: "1234567",
            type: "card",
            usedDate: "15/06/2023",
            status: "used",
          },
          {
            id: "2",
            name: "هدية عيد الميلاد",
            code: "GIFT1234",
            type: "gift",
            usedDate: "20/05/2023",
            status: "used",
          },
          {
            id: "3",
            name: "بطاقة القهوة",
            code: "7654321",
            type: "card",
            usedDate: "01/04/2023",
            status: "expired",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsedItems();
  }, []);

  // Use prop items if provided (for testing/storybook)
  useEffect(() => {
    if (propItems) {
      setItems(propItems);
      setLoading(false);
    }
  }, [propItems]);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden opacity-80">
          <CardHeader className="pb-2 bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.code}</CardDescription>
              </div>
              <div className="flex items-center">
                <Badge
                  className={
                    item.status === "used"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {item.status === "used" ? "تم الاستخدام" : "منتهي الصلاحية"}
                </Badge>
                <div className="bg-gray-100 p-2 rounded-full ml-2">
                  {item.type === "gift" ? (
                    <Gift className="h-5 w-5 text-purple-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 ml-1" />
                <span className="text-sm text-gray-500">تاريخ الاستخدام:</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{item.usedDate}</span>
                {item.status === "used" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsedTab;
