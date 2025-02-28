import React, { useState } from "react";
import { Gift, Award, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import GiftRedemption from "./GiftRedemption";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "gift" | "discount" | "experience";
  isNew?: boolean;
  image?: string;
}

interface RewardsSectionProps {
  userName?: string;
  userPoints?: number;
  rewards?: Reward[];
  onRedeemReward?: (rewardId: string) => Promise<boolean>;
}

const RewardsSection = ({
  userName = "Valued Member",
  userPoints = 1250,
  rewards = defaultRewards,
  onRedeemReward,
}: RewardsSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showGiftRedemption, setShowGiftRedemption] = useState<boolean>(false);

  const filteredRewards =
    activeTab === "all"
      ? rewards
      : rewards.filter((reward) => reward.category === activeTab);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full min-h-[700px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            المكافآت الخاصة بك
          </h2>
          <p className="text-gray-600">اكتشف واستبدل مكافآت الولاء الخاصة بك</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            onClick={() => setShowGiftRedemption(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <Gift className="mr-2 h-5 w-5" />
            استخدام هدية
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="gift">Gifts</TabsTrigger>
          <TabsTrigger value="discount">Discounts</TabsTrigger>
          <TabsTrigger value="experience">Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRewards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No rewards available in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RewardCard reward={reward} onRedeem={onRedeemReward} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Gift redemption dialog */}
      {showGiftRedemption && (
        <GiftRedemption
          isOpen={showGiftRedemption}
          onRedeem={async (code) => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setShowGiftRedemption(false);
            return true;
          }}
        />
      )}
    </div>
  );
};

interface RewardCardProps {
  reward: Reward;
  onRedeem?: (rewardId: string) => Promise<boolean>;
}

const RewardCard = ({ reward, onRedeem }: RewardCardProps) => {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (!onRedeem) return;

    setIsRedeeming(true);
    try {
      await onRedeem(reward.id);
      // Success handling would go here
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsRedeeming(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gift":
        return <Gift className="h-4 w-4" />;
      case "discount":
        return <Award className="h-4 w-4" />;
      case "experience":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      {reward.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={reward.image}
            alt={reward.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{reward.title}</CardTitle>
          {reward.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            {getCategoryIcon(reward.category)}
            {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
            {reward.points} points
          </Badge>
        </div>
        <CardDescription className="mt-2">{reward.description}</CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto pt-4">
        <Button
          onClick={handleRedeem}
          disabled={isRedeeming}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        >
          {isRedeeming ? "Processing..." : "Redeem Reward"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Default rewards data
const defaultRewards: Reward[] = [
  {
    id: "1",
    title: "$10 Gift Card",
    description:
      "Redeem your points for a $10 gift card to use on your next purchase.",
    points: 500,
    category: "gift",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "2",
    title: "15% Discount",
    description: "Get 15% off your next purchase when you redeem this reward.",
    points: 300,
    category: "discount",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    title: "VIP Experience",
    description:
      "Enjoy a VIP shopping experience with a personal shopper and exclusive access.",
    points: 1000,
    category: "experience",
    image:
      "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "4",
    title: "Free Shipping",
    description:
      "Get free shipping on your next order, no minimum purchase required.",
    points: 200,
    category: "discount",
  },
  {
    id: "5",
    title: "Mystery Box",
    description:
      "Redeem your points for a surprise mystery box filled with goodies.",
    points: 750,
    category: "gift",
    isNew: true,
  },
  {
    id: "6",
    title: "Early Access",
    description:
      "Get early access to new products and collections before they're available to the public.",
    points: 400,
    category: "experience",
  },
];

export default RewardsSection;
