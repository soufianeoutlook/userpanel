import React, { useState } from "react";
import { ArrowLeft, ArrowRight, UserPlus, Check } from "lucide-react";
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

interface SignupScreenProps {
  onSignup?: (phoneNumber: string, pin: string) => Promise<boolean>;
  onBack?: () => void;
}

const SignupScreen = ({
  onSignup = async () => true,
  onBack = () => {},
}: SignupScreenProps) => {
  const [step, setStep] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handlePhoneComplete = (value: string) => {
    setPhoneNumber(value);
  };

  const handlePinComplete = (value: string) => {
    setPin(value);
  };

  const handleConfirmPinComplete = (value: string) => {
    setConfirmPin(value);
  };

  const handleNextStep = () => {
    if (step === 1 && phoneNumber.length === 10) {
      setStep(2);
      setError("");
    } else if (step === 2 && pin.length === 4) {
      setStep(3);
      setError("");
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      setError("PINs do not match. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await onSignup(phoneNumber, pin);
      if (result) {
        setSuccess(true);
        // Reset after success
        setTimeout(() => {
          setSuccess(false);
          // Redirect or other action could be performed here
        }, 2000);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === i ? "bg-primary text-white" : step > i ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
              >
                {step > i ? <Check className="h-4 w-4" /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`w-8 h-1 ${step > i ? "bg-green-100" : "bg-gray-100"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Enter Your Phone Number
              </h2>
              <p className="text-gray-500">
                We'll use this to identify your account
              </p>
            </div>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              onComplete={handlePhoneComplete}
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Create Your PIN</h2>
              <p className="text-gray-500">
                Choose a 4-digit PIN to secure your account
              </p>
            </div>
            <PinPad onPinComplete={handlePinComplete} onPinChange={setPin} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Confirm Your PIN</h2>
              <p className="text-gray-500">Enter your PIN again to confirm</p>
            </div>
            <PinPad
              onPinComplete={handleConfirmPinComplete}
              onPinChange={setConfirmPin}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center">Account Created!</h2>
            <p className="text-gray-500 text-center">
              Your account has been successfully created. You can now log in
              with your phone number and PIN.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <UserPlus className="h-6 w-6 text-primary" />
          Create Account
        </CardTitle>
        <CardDescription>
          Sign up for our digital loyalty program
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderStepIndicator()}
        {renderStepContent()}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={handleNextStep}
            disabled={step === 1 ? phoneNumber.length < 10 : pin.length < 4}
            className="bg-primary text-white flex items-center gap-1"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || confirmPin.length < 4}
            className="bg-primary text-white"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SignupScreen;
