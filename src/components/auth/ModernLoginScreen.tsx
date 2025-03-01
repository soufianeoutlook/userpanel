import React, { useState } from "react";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

interface LoginScreenProps {
  onLogin?: (phoneNumber: string, pin: string) => void;
  onSignupClick?: () => void;
  isLoading?: boolean;
  error?: string;
}

const ModernLoginScreen = ({
  onLogin = () => {},
  onSignupClick = () => {},
  isLoading = false,
  error = "",
}: LoginScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [phoneError, setPhoneError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setPhoneError("");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleContinue = () => {
    if (phoneNumber.length < 10) {
      setPhoneError("الرجاء إدخال رقم هاتف صحيح مكون من 10 أرقام");
      return;
    }
    setPhoneError("");
    setStep("pin");
  };

  const handleLogin = () => {
    if (phoneNumber.length === 10 && pin.length === 4) {
      try {
        console.log("Attempting login with:", { phone: phoneNumber, pin });
        onLogin(phoneNumber, pin);
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    } else if (pin.length < 4) {
      setLoginError("الرجاء إدخال رمز PIN مكون من 4 أرقام");
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setPin("");
    setLoginError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "phone") {
        handleContinue();
      } else if (step === "pin") {
        handleLogin();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full shadow-md border-0 bg-white overflow-hidden">
        {/* Background image with person holding gift */}
        <div className="relative h-48 bg-purple-600 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Person holding gift"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/50 to-purple-900/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-2">ExpressWin</h1>
              <p className="text-lg">برنامج الولاء الرقمي</p>
            </div>
          </div>
        </div>

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {step === "phone" ? "مرحباً بك" : "أدخل رمز PIN"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {step === "phone"
              ? "سجل دخولك للوصول إلى مكافآت الولاء الخاصة بك"
              : "الرجاء إدخال رمز PIN المكون من 4 أرقام للمتابعة"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {step === "phone" ? (
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="أدخل رقم هاتفك"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onKeyPress={handleKeyPress}
                  className="pr-10 text-right bg-gray-50 h-12"
                  maxLength={10}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 text-right">
                الصيغة: XXXXXXXXXX
              </p>
              {phoneError && (
                <p className="text-red-500 text-sm text-center">{phoneError}</p>
              )}
              <Button
                onClick={handleContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4 flex items-center justify-center gap-2 shadow-sm h-12"
                disabled={isLoading || phoneNumber.length < 10}
              >
                متابعة
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-500">
                  رقم الهاتف: {phoneNumber}
                </p>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="أدخل رمز PIN المكون من 4 أرقام"
                  value={pin}
                  onChange={handlePinChange}
                  onKeyPress={handleKeyPress}
                  className="pr-10 text-right bg-gray-50 h-12"
                  maxLength={4}
                  required
                />
              </div>
              {(error || loginError) && (
                <p className="text-red-500 text-sm text-center">
                  {error || loginError}
                </p>
              )}
              <Button
                onClick={handleLogin}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4 flex items-center justify-center gap-2 shadow-sm h-12"
                disabled={isLoading || pin.length < 4}
              >
                تسجيل الدخول
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleBackToPhone}
                className="w-full text-gray-500 hover:text-gray-700 mt-2 shadow-sm"
                disabled={isLoading}
              >
                العودة إلى رقم الهاتف
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
          <div className="w-full border-t border-gray-200 my-2" />
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Button
                variant="link"
                onClick={() => {
                  const phoneNumber = "+212660094154";
                  const message = "أريد التسجيل في برنامج الولاء";
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                    "_blank",
                  );
                }}
                className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-800"
              >
                التسجيل
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ModernLoginScreen;
