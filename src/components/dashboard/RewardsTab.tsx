import React, { useState, useEffect } from "react";
import { Gift, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Reward {
  id: string;
  name: string;
  code: string;
  expiryDate: string;
  status: "active" | "used" | "expired";
}

interface RewardsTabProps {
  rewards?: Reward[];
}

const RewardsTab = ({ rewards: propRewards }: RewardsTabProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rewards from API
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { getUserGifts } = await import("../../api/gifts");
        const userGifts = await getUserGifts();

        // Transform API data to component format
        const formattedRewards = userGifts
          .filter((gift) => !gift.used_date) // Only show unused gifts
          .map((userGift) => ({
            id: userGift.id.toString(),
            name: userGift.gift.name,
            code: userGift.gift.serial_number,
            expiryDate: userGift.gift.expiry_date
              ? new Date(userGift.gift.expiry_date).toLocaleDateString("ar-SA")
              : "30 يوم",
            status: "active",
          }));

        setRewards(formattedRewards);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        // Use default rewards if API fails
        setRewards([
          {
            id: "1",
            name: "هدية عيد الميلاد",
            code: "GIFT1234",
            expiryDate: "30 يوم",
            status: "active",
          },
          {
            id: "2",
            name: "هدية الترحيب",
            code: "GIFT5678",
            expiryDate: "15 يوم",
            status: "active",
          },
          {
            id: "3",
            name: "هدية المناسبات",
            code: "GIFT9012",
            expiryDate: "7 أيام",
            status: "active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Use prop rewards if provided (for testing/storybook)
  useEffect(() => {
    if (propRewards) {
      setRewards(propRewards);
      setLoading(false);
    }
  }, [propRewards]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <Card key={reward.id} className="overflow-hidden">
          <CardHeader className="pb-2 bg-purple-50">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{reward.name}</CardTitle>
              <div className="bg-purple-100 p-2 rounded-full">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">رقم الهدية</span>
              <span className="font-medium">{reward.code}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">المدة المتبقية</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 ml-1" />
                <span className="font-medium">{reward.expiryDate}</span>
              </div>
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              onClick={() => {
                const phoneNumber = "+966123456789"; // Example phone number
                const message = `Gift: ${reward.code}, User: USER123`;
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                  "_blank",
                );
              }}
            >
              استخدام الهدية
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RewardsTab;
