import React, { useState, useRef, useEffect } from "react";
import { Phone } from "lucide-react";
import { Input } from "../ui/input";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInput = ({
  value = "",
  onChange = () => {},
  onComplete = () => {},
  placeholder = "Enter your phone number",
  required = false,
  disabled = false,
}: PhoneInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "");

    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      const formatted = formatPhoneNumber(rawValue);
      setInputValue(formatted);
      onChange(digitsOnly);

      // If we have a complete phone number, trigger onComplete
      if (digitsOnly.length === 10) {
        onComplete(digitsOnly);
      }
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Phone
            className={`h-5 w-5 ${isFocused ? "text-primary" : "text-gray-400"}`}
          />
        </div>
        <Input
          ref={inputRef}
          type="tel"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pr-10 pl-4 py-2 border-2 focus:border-primary focus:ring-primary text-right"
          required={required}
          disabled={disabled}
          aria-label="Phone number"
          maxLength={14} // (XXX) XXX-XXXX = 14 characters
        />
      </div>

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500">الصيغة: (XXX) XXX-XXXX</p>
    </div>
  );
};

export default PhoneInput;
