import React, { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PhoneInput from "./PhoneInput";
import PinPad from "./PinPad";

interface LoginScreenProps {
  onLogin?: (phoneNumber: string, pin: string) => void;
  onSignupClick?: () => void;
  isLoading?: boolean;
  error?: string;
}

const LoginScreen = ({
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

  const handlePhoneComplete = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");
  };

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value.length === 4) {
      handleLogin();
    }
  };

  const handleContinue = () => {
    if (phoneNumber.length < 10) {
      setPhoneError("الرجاء إدخال رقم هاتف صحيح مكون من 10 أرقام");
      return;
    }

    // For simplicity, we'll just proceed to PIN screen
    // This avoids network errors if the backend is not running
    setPhoneError("");
    setStep("pin");
  };

  const handleLogin = async () => {
    if (phoneNumber.length === 10 && pin.length === 4) {
      try {
        console.log("Attempting login with:", { phone: phoneNumber, pin });
        onLogin(phoneNumber, pin);
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setPin("");
    setLoginError("");
  };

  return (
    <div className="w-full max-w-md">
      <Card className="w-full max-w-md shadow-md border-0">
        <CardHeader className="text-center pb-2">
          <img
            src="/logo.png"
            alt="ExpressWin"
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%2250%22%20viewBox%3D%220%200%20150%2050%22%3E%3Crect%20fill%3D%22%23a855f7%22%20width%3D%22150%22%20height%3D%2250%22%2F%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22Arial%2CSans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EExpressWin%3C%2Ftext%3E%3C%2Fsvg%3E";
            }}
          />
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
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                onComplete={handlePhoneComplete}
                placeholder="أدخل رقم هاتفك"
                required
              />
              {phoneError && (
                <p className="text-red-500 text-sm text-center">{phoneError}</p>
              )}
              <Button
                onClick={handleContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4 flex items-center justify-center gap-2 shadow-sm"
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
              <PinPad
                onPinChange={setPin}
                onPinComplete={handlePinComplete}
                disabled={isLoading}
              />
              {(error || loginError) && (
                <p className="text-red-500 text-sm text-center">
                  {error || loginError}
                </p>
              )}
              <Button
                onClick={handleLogin}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4 flex items-center justify-center gap-2 shadow-sm"
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

export default LoginScreen;
