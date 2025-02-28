import React, { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const securityFormSchema = z
  .object({
    currentPin: z.string().length(4, "PIN must be exactly 4 digits"),
    newPin: z.string().length(4, "PIN must be exactly 4 digits"),
    confirmPin: z.string().length(4, "PIN must be exactly 4 digits"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New PIN and confirm PIN must match",
    path: ["confirmPin"],
  });

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

interface AccountSectionProps {
  userData?: {
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
}

const AccountSection = ({
  userData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
}: AccountSectionProps) => {
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPin: "",
      newPin: "",
      confirmPin: "",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
    },
  });

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      const { updateUserProfile } = await import("../../api/user");
      const response = await updateUserProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      if (response.success) {
        alert("Profile updated successfully");
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const onSecuritySubmit = async (data: z.infer<typeof securityFormSchema>) => {
    try {
      const { updateUserPin } = await import("../../api/user");
      const response = await updateUserPin(data.currentPin, data.newPin);

      if (response.success) {
        alert("PIN updated successfully");
        securityForm.reset({ currentPin: "", newPin: "", confirmPin: "" });
      } else {
        alert(response.message || "Failed to update PIN");
      }
    } catch (error) {
      console.error("Update PIN error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const onNotificationSubmit = (
    data: z.infer<typeof notificationFormSchema>,
  ) => {
    console.log("Notification preferences updated:", data);
    // In a real app, this would call an API to update notification preferences
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
          <AvatarFallback>
            {userData.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-gray-500">{userData.phone}</p>
        </div>
      </div>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">الملف الشخصي</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">المساعدة</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
              <CardDescription>
                تحديث معلوماتك الشخصية وتفاصيل الاتصال الخاصة بك.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4">
                    حفظ التغييرات
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>حذف الحساب</CardTitle>
              <CardDescription>
                احذف حسابك بشكل نهائي من النظام.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md border-red-200">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <CreditCard className="h-6 w-6 text-red-500" />
                      <span className="absolute -top-1 -right-1 animate-ping h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">حذف الحساب</p>
                      <p className="text-sm text-gray-500">
                        سيتم حذف جميع بياناتك بشكل نهائي
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (
                        confirm(
                          "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",
                        )
                      ) {
                        try {
                          const { deleteUserAccount } = await import(
                            "../../api/user"
                          );
                          const response = await deleteUserAccount();

                          if (response.success) {
                            alert("تم حذف حسابك بنجاح");
                            window.location.href = "/";
                          } else {
                            alert(
                              response.message || "Failed to delete account",
                            );
                          }
                        } catch (error) {
                          console.error("Delete account error:", error);
                          alert("An error occurred. Please try again.");
                        }
                      }
                    }}
                  >
                    حذف الحساب
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تغيير رمز PIN</CardTitle>
              <CardDescription>
                قم بتحديث رمز PIN المكون من 4 أرقام لأمان حسابك.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={securityForm.control}
                    name="currentPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رمز PIN الحالي</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="newPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رمز PIN الجديد</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="confirmPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد رمز PIN الجديد</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4">
                    تحديث رمز PIN
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات الحساب</CardTitle>
              <CardDescription>إدارة إعدادات أمان حسابك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">تسجيل الخروج</h3>
                  <p className="text-sm text-gray-500">
                    تسجيل الخروج من جميع الأجهزة
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    const { logout } = require("../../api/auth");
                    logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
              <CardDescription>
                إدارة كيفية تلقي الإشعارات والتحديثات.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">إشعارات البريد الإلكتروني</p>
                        <p className="text-sm text-gray-500">
                          تلقي التحديثات عبر البريد الإلكتروني
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={notificationForm.watch("emailNotifications")}
                          onChange={(e) =>
                            notificationForm.setValue(
                              "emailNotifications",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">إشعارات الرسائل النصية</p>
                        <p className="text-sm text-gray-500">
                          تلقي التحديثات عبر الرسائل النصية
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="smsNotifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={notificationForm.watch("smsNotifications")}
                          onChange={(e) =>
                            notificationForm.setValue(
                              "smsNotifications",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">الإشعارات المباشرة</p>
                        <p className="text-sm text-gray-500">
                          تلقي التحديثات على جهازك
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="pushNotifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={notificationForm.watch("pushNotifications")}
                          onChange={(e) =>
                            notificationForm.setValue(
                              "pushNotifications",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4"
                    onClick={() => {
                      // In a real app, this would call an API to save preferences
                      alert("تم حفظ التفضيلات بنجاح");
                    }}
                  >
                    حفظ التفضيلات
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المساعدة والدعم</CardTitle>
              <CardDescription>
                احصل على المساعدة بخصوص حساب برنامج الولاء الخاص بك.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">الأسئلة الشائعة</h3>
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm">
                        كيف يمكنني استبدال مكافآتي؟
                      </p>
                      <p className="text-sm text-gray-500">
                        يمكنك استبدال المكافآت عن طريق إدخال رمز الهدية الخاص بك
                        في قسم المكافآت.
                      </p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm">
                        كيف يمكنني تفعيل بطاقة ولاء جديدة؟
                      </p>
                      <p className="text-sm text-gray-500">
                        انتقل إلى قسم البطاقات وانقر على "إضافة بطاقة جديدة"
                        لتفعيل بطاقة ولاء جديدة.
                      </p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm">
                        نسيت رمز PIN الخاص بي، ماذا أفعل؟
                      </p>
                      <p className="text-sm text-gray-500">
                        اتصل بدعم العملاء للحصول على المساعدة في إعادة تعيين رمز
                        PIN الخاص بك.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">اتصل بالدعم</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    هل تحتاج إلى مزيد من المساعدة؟ فريق الدعم لدينا متاح
                    لمساعدتك.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const phoneNumber = "+212660094154";
                      const message = "طلب دعم من تطبيق ExpressWin";
                      window.open(
                        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                        "_blank",
                      );
                    }}
                  >
                    <HelpCircle className="h-4 w-4 ml-2" />
                    اتصل بالدعم
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSection;
