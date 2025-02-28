import React, { useState } from "react";
import { PlusCircle, CreditCard, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(4, "Card code must be at least 4 characters")
    .max(19, "Card code cannot exceed 19 characters"),
});

type CardActivationFormValues = z.infer<typeof formSchema>;

interface CardActivationProps {
  onActivate?: (data: CardActivationFormValues) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CardActivation = ({
  onActivate = () => {},
  isOpen = true,
  onOpenChange = () => {},
}: CardActivationProps) => {
  const [success, setSuccess] = useState(false);

  const form = useForm<CardActivationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
    },
  });

  const handleSubmit = async (data: CardActivationFormValues) => {
    try {
      // Call the API to activate the card
      const { activateCard } = await import("../../api/cards");
      const response = await activateCard(data.cardNumber);

      if (response.success) {
        onActivate(data);
        setSuccess(true);

        // Reset success state after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(false);
          form.reset();
        }, 2000);
      } else {
        alert(response.message || "Failed to activate card");
      }
    } catch (error) {
      console.error("Card activation error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            تفعيل بطاقة ولاء جديدة
          </DialogTitle>
          <DialogDescription>
            أدخل رمز البطاقة أدناه لتفعيل بطاقة الولاء الجديدة الخاصة بك.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-center">
              تم تفعيل البطاقة بنجاح!
            </h3>
            <p className="text-sm text-gray-500 text-center">
              تمت إضافة بطاقة الولاء إلى حسابك بنجاح.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز البطاقة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل رمز البطاقة"
                        {...field}
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-primary text-white">
                  إضافة وتفعيل
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Standalone button to trigger the card activation dialog
export const CardActivationButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
      >
        <CreditCard className="h-4 w-4 ml-2" />
        إضافة بطاقة جديدة
      </Button>
      <CardActivation
        isOpen={open}
        onOpenChange={setOpen}
        onActivate={(data) => console.log("Card activated:", data)}
      />
    </>
  );
};

export default CardActivation;
