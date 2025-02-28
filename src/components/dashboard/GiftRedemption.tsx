import React, { useState } from "react";
import { Gift, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface GiftRedemptionProps {
  onRedeem?: (code: string) => Promise<boolean>;
  isOpen?: boolean;
}

const GiftRedemption = ({ onRedeem, isOpen = true }: GiftRedemptionProps) => {
  const [giftCode, setGiftCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Call the API to activate the gift
      const { activateGift } = await import("../../api/gifts");
      const response = await activateGift(giftCode);

      if (response.success) {
        setIsSuccess(true);
        // Reset after 2 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setGiftCode("");
        }, 2000);
      } else {
        setError(response.message || "Invalid gift code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
            <Gift className="mr-2 h-5 w-5" />
            استخدام هدية
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-purple-700">
              استخدام الهدية الخاصة بك
            </DialogTitle>
            <DialogDescription className="text-center">
              أدخل رمز الهدية أدناه للمطالبة بمكافأتك.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="giftCode"
                placeholder="أدخل رمز الهدية (مثال: GIFT123)"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                className="text-center uppercase tracking-wider"
                disabled={isSubmitting || isSuccess}
                required
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            <DialogFooter className="flex justify-center sm:justify-center">
              {isSuccess ? (
                <Button
                  className="bg-green-500 hover:bg-green-600 w-full"
                  disabled
                >
                  <Check className="mr-2 h-5 w-5" />
                  تم استخدام الهدية!
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  disabled={!giftCode.trim() || isSubmitting}
                >
                  {isSubmitting ? "جاري المعالجة..." : "استخدام الهدية"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview of available gifts/rewards */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          الهدايا المتاحة
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-md p-3 flex items-center"
            >
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">هدية رقم #{item}</h4>
                <p className="text-sm text-gray-500">
                  رقم الهدية: GIFT{item}23
                </p>
              </div>
              <Button
                size="sm"
                className="bg-primary text-white"
                onClick={() => {
                  const phoneNumber = "+966123456789"; // Example phone number
                  const message = `Gift: GIFT${item}23, User: USER123`;
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                    "_blank",
                  );
                }}
              >
                استخدام الهدية
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftRedemption;
