import React, { useState } from "react";
import { Home, CreditCard, Gift, User } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navigation = ({
  activeTab = "rewards",
  onTabChange = () => {},
}: NavigationProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange(tab);
  };

  const tabs = [
    {
      id: "home",
      label: "الرئيسية",
      icon: <Home className="h-5 w-5" />,
      tooltip: "الصفحة الرئيسية",
    },
    {
      id: "cards",
      label: "الهدايا والبطاقات",
      icon: <CreditCard className="h-5 w-5" />,
      tooltip: "إدارة الهدايا وبطاقات الولاء الخاصة بك",
    },
    {
      id: "account",
      label: "الحساب",
      icon: <User className="h-5 w-5" />,
      tooltip: "عرض تفاصيل حسابك",
    },
  ];

  return (
    <div className="bg-white w-full sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="ExpressWin"
                className="h-8"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150x50?text=ExpressWin";
                }}
              />
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center justify-center flex-1 mx-4">
            <nav className="flex space-x-reverse space-x-4 md:space-x-8">
              <TooltipProvider>
                {tabs.map((tab) => (
                  <Tooltip key={tab.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex flex-col items-center py-2 px-3 text-sm rounded-md transition-colors shadow-sm",
                          currentTab === tab.id
                            ? "text-purple-700 bg-gray-100 border-b-2 border-purple-700"
                            : "text-gray-600 hover:text-purple-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleTabChange(tab.id)}
                      >
                        {tab.icon}
                        <span className="mt-1">{tab.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tab.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </div>

          {/* User profile/notifications placeholder */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600 shadow-sm">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
