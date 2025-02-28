import React, { useState, useEffect } from "react";
import {
  CreditCard,
  PlusCircle,
  Search,
  Info,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { CardActivationButton } from "./CardActivation";
import { GiftActivationButton } from "./GiftActivation";
import RewardsTab from "./RewardsTab";
import UsedTab from "./UsedTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

interface LoyaltyCard {
  id: string;
  name: string;
  cardNumber: string;
  expiryDate: string;
  points: number;
  status: "active" | "inactive" | "expired";
  type: "standard";
  description?: string;
}

interface CardsSectionProps {
  cards?: LoyaltyCard[];
}

const CardsSection = ({ cards: propCards }: CardsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { getUserCards } = await import("../../api/cards");
        const userCards = await getUserCards();

        // Transform API data to component format
        const formattedCards = userCards.map((userCard) => ({
          id: userCard.id.toString(),
          name: userCard.card.name,
          cardNumber: userCard.card.serial_number,
          expiryDate: "30 يوم", // This would come from the API in a real app
          points: userCard.current_stamps,
          status: userCard.card.status === "active" ? "active" : "expired",
          type: "standard",
          description: userCard.card.description || undefined,
        }));

        setCards(formattedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
        // Use default cards if API fails
        setCards([
          {
            id: "1",
            name: "بطاقة الولاء الذهبية",
            cardNumber: "1234567",
            expiryDate: "30 يوم",
            points: 8,
            status: "active",
            type: "standard",
          },
          {
            id: "2",
            name: "بطاقة القهوة",
            cardNumber: "7654321",
            expiryDate: "15 يوم",
            points: 5,
            status: "active",
            type: "standard",
          },
          {
            id: "3",
            name: "بطاقة المطعم",
            cardNumber: "9876543",
            expiryDate: "منتهية",
            points: 0,
            status: "expired",
            type: "standard",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Use prop cards if provided (for testing/storybook)
  useEffect(() => {
    if (propCards) {
      setCards(propCards);
      setLoading(false);
    }
  }, [propCards]);

  // Filter cards based on search query and active tab
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.includes(searchQuery);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && card.status === "active";
    if (activeTab === "expired")
      return matchesSearch && card.status === "expired";

    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            الهدايا والبطاقات
          </h2>
          <p className="text-gray-500 mt-1">
            إدارة الهدايا وبطاقات الولاء الخاصة بك
          </p>
        </div>

        <div className="flex gap-2">
          <CardActivationButton />
          <GiftActivationButton />
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="البحث عن البطاقات بالاسم أو الرقم..."
            className="pr-10 bg-gray-50 text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md shadow-sm">
          <TabsTrigger
            value="all"
            className="flex items-center justify-center gap-1"
          >
            <CreditCard className="h-4 w-4" />
            بطاقاتي
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="flex items-center justify-center gap-1"
          >
            <Gift className="h-4 w-4" />
            هداياي
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="h-4 w-4" />
            المستخدمة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                لا توجد بطاقات
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "جرب مصطلح بحث مختلف"
                  : "أضف بطاقة ولاء جديدة للبدء"}
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mx-auto"
              >
                {searchQuery ? "مسح البحث" : "أضف بطاقتك الأولى"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className={`overflow-hidden ${card.status === "expired" ? "opacity-70" : ""}`}
                >
                  <CardHeader className="pb-2 bg-purple-50">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                      <Badge className={getStatusColor(card.status)}>
                        {card.status === "active" ? "نشط" : "منتهي"}
                      </Badge>
                    </div>
                    <CardDescription>{card.cardNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        المدة المتبقية
                      </span>
                      <span className="font-medium">{card.expiryDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">الطوابع</span>
                      <div className="flex gap-1">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full ${i < card.points ? "bg-purple-600" : "bg-gray-200"}`}
                            />
                          ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowCardDetails(true);
                      }}
                      className="shadow-sm"
                    >
                      <Info className="h-4 w-4 ml-1" />
                      التفاصيل
                    </Button>
                    {card.status !== "expired" && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        onClick={() => {
                          const phoneNumber = "+966123456789"; // Example phone number
                          const message = `Card: ${card.cardNumber}, User: ${card.id}`;
                          window.open(
                            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                            "_blank",
                          );
                        }}
                      >
                        استخدام البطاقة
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <RewardsTab />
        </TabsContent>

        <TabsContent value="expired">
          <UsedTab />
        </TabsContent>
      </Tabs>

      {filteredCards.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            عرض المزيد
          </Button>
        </div>
      )}

      {/* Card Details Dialog */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="sm:max-w-md">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCard.name}</DialogTitle>
                <DialogDescription>
                  رقم البطاقة: {selectedCard.cardNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-700 mb-4">
                  {selectedCard.description ||
                    "بطاقة ولاء تتيح لك جمع الطوابع والحصول على مكافآت عند اكتمال جمع الطوابع المطلوبة. استخدم البطاقة في كل زيارة للحصول على طابع جديد."}
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">الحالة:</span>
                    <span className="font-medium">
                      {selectedCard.status === "active" ? "نشط" : "منتهي"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">المدة المتبقية:</span>
                    <span className="font-medium">
                      {selectedCard.expiryDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الطوابع المجمعة:</span>
                    <span className="font-medium">
                      {selectedCard.points} من 10
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCardDetails(false)}
                >
                  إغلاق
                </Button>
                {selectedCard.status !== "expired" && (
                  <Button
                    className="bg-primary text-white"
                    onClick={() => {
                      const phoneNumber = "+966123456789";
                      const message = `Card: ${selectedCard.cardNumber}, User: ${selectedCard.id}`;
                      window.open(
                        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                        "_blank",
                      );
                      setShowCardDetails(false);
                    }}
                  >
                    استخدام البطاقة
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardsSection;
