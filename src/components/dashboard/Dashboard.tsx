import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Gift, User, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Navigation from "./Navigation";
import CardsSection from "./CardsSection";
import AccountSection from "./AccountSection";

interface DashboardProps {
  userName?: string;
  userPhone?: string;
  userPoints?: number;
  initialTab?: string;
  avatarUrl?: string;
}

const Dashboard = ({
  userName,
  userPhone,
  userPoints = 0,
  initialTab = "cards",
  avatarUrl,
}: DashboardProps) => {
  // Get user data from localStorage or API
  const [userData, setUserData] = useState({
    name: userName || "User",
    phone: userPhone || "",
    email: "",
    avatarUrl:
      avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData({
            name: user.name || "User",
            phone: user.phone || "",
            email: user.email || "",
            avatarUrl:
              avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "User"}`,
          });
        }

        // Then try to get fresh data from API
        const { getUserProfile } = await import("../../api/user");
        const response = await getUserProfile();

        if (response.success && response.user) {
          setUserData({
            name: response.user.name || "User",
            phone: response.user.phone || "",
            email: response.user.email || "",
            avatarUrl:
              avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.name || "User"}`,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Only fetch if not provided as props
    if (!userName || !userPhone) {
      fetchUserData();
    }
  }, [userName, userPhone, avatarUrl]);
  const [activeTab, setActiveTab] = useState(initialTab);

  // User data is now managed in state

  // Animation variants for tab transitions
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Navigation bar */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Welcome banner */}
      <div className="bg-white text-gray-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
              مرحباً بك، {userData.phone || userData.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              مرحبًا بك في برنامج الولاء الرقمي
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Home Section */}
        {activeTab === "home" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabContentVariants}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm w-full">
              <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                ExpressWin
              </h2>
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
                <h3 className="text-xl font-bold mb-4 text-purple-700">
                  مرحباً بك في برنامج الولاء الرقمي
                </h3>
                <p className="text-gray-700 mb-4">
                  برنامج ExpressWin هو برنامج ولاء رقمي يتيح لك جمع النقاط
                  واستبدالها بهدايا ومكافآت قيمة.
                </p>
                <p className="text-gray-700 mb-4">
                  يمكنك تفعيل بطاقات الولاء الخاصة بك وإدارة هداياك بكل سهولة من
                  خلال حسابك الشخصي.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">تفعيل البطاقات</h4>
                    <p className="text-sm text-gray-600">
                      قم بتفعيل بطاقات الولاء الخاصة بك
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">استخدام الهدايا</h4>
                    <p className="text-sm text-gray-600">
                      استمتع بالهدايا والمكافآت المتنوعة
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">إدارة حسابك</h4>
                    <p className="text-sm text-gray-600">
                      تحكم في إعدادات حسابك الشخصي
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button
                  onClick={() => setActiveTab("cards")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 shadow-sm"
                >
                  استعرض الهدايا والبطاقات
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cards Section */}
        {activeTab === "cards" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabContentVariants}
          >
            <CardsSection />
          </motion.div>
        )}

        {/* Account Section */}
        {activeTab === "account" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabContentVariants}
          >
            <AccountSection userData={userData} />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ExpressWin. جميع الحقوق محفوظة.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="/privacy-policy"
              className="text-gray-500 hover:text-purple-600 text-sm"
            >
              سياسة الخصوصية
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-500 hover:text-purple-600 text-sm"
            >
              شروط الخدمة
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const phoneNumber = "+212660094154";
                const message = "استفسار من تطبيق ExpressWin";
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                  "_blank",
                );
              }}
              className="text-gray-500 hover:text-purple-600 text-sm"
            >
              اتصل بنا
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
