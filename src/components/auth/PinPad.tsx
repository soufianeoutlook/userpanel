import React, { useState } from "react";
import { Button } from "../ui/button";
import { Delete } from "lucide-react";

interface PinPadProps {
  onPinComplete?: (pin: string) => void;
  onPinChange?: (pin: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const PinPad = ({
  onPinComplete = () => {},
  onPinChange = () => {},
  maxLength = 4,
  disabled = false,
}: PinPadProps) => {
  const [pin, setPin] = useState<string>("");

  const handleNumberClick = (number: number) => {
    if (disabled || pin.length >= maxLength) return;

    const newPin = pin + number.toString();
    setPin(newPin);
    onPinChange(newPin);

    if (newPin.length === maxLength) {
      onPinComplete(newPin);
    }
  };

  const handleBackspace = () => {
    if (disabled || pin.length === 0) return;

    const newPin = pin.slice(0, -1);
    setPin(newPin);
    onPinChange(newPin);
  };

  const handleClear = () => {
    if (disabled) return;

    setPin("");
    onPinChange("");
  };

  // Generate numbers 1-9 and then 0
  const numbers = [...Array(9).keys()].map((i) => i + 1).concat([0]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md mx-auto">
      {/* PIN display */}
      <div className="flex justify-center mb-6 gap-3">
        {Array(maxLength)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${pin.length > index ? "border-primary bg-primary/10" : "border-gray-300"}`}
            >
              {pin.length > index ? (
                <div className="w-4 h-4 rounded-full bg-primary"></div>
              ) : null}
            </div>
          ))}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4">
        {numbers.map((number) => (
          <Button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="h-16 text-2xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm"
            variant="outline"
            disabled={disabled}
          >
            {number}
          </Button>
        ))}

        {/* Clear button */}
        <Button
          onClick={handleClear}
          className="h-16 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm"
          variant="outline"
          disabled={disabled}
        >
          مسح
        </Button>

        {/* Backspace button */}
        <Button
          onClick={handleBackspace}
          className="h-16 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800"
          variant="outline"
          disabled={disabled}
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>

      {/* Additional information */}
      <p className="text-center text-sm text-gray-500 mt-6">
        أدخل رمز PIN المكون من 4 أرقام للمصادقة
      </p>
    </div>
  );
};

export default PinPad;
