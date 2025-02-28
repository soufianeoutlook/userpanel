import React from "react";
import { Gift, Award, Star, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">ExpressWin</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            برنامج الولاء الرقمي الأمثل لمكافأة عملائك وزيادة ولائهم
          </p>
          <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold">
            ابدأ الآن
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            مميزات البرنامج
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                بطاقات ولاء رقمية
              </h3>
              <p className="text-gray-600">
                بطاقات ولاء سهلة الاستخدام يمكن للعملاء استخدامها عبر هواتفهم
                الذكية
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                هدايا وجوائز متنوعة
              </h3>
              <p className="text-gray-600">
                مجموعة متنوعة من الهدايا والمكافآت التي يمكن للعملاء الحصول
                عليها
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                نظام نقاط متطور
              </h3>
              <p className="text-gray-600">
                نظام نقاط مرن يمكن تخصيصه حسب احتياجات عملك وعملائك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            كيف يعمل البرنامج
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">التسجيل</h3>
              <p className="text-gray-600">يسجل العميل برقم هاتفه ورمز PIN</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">تفعيل البطاقات</h3>
              <p className="text-gray-600">
                يقوم بتفعيل بطاقات الولاء الخاصة به
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">جمع النقاط</h3>
              <p className="text-gray-600">يجمع النقاط مع كل عملية شراء</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">استبدال الهدايا</h3>
              <p className="text-gray-600">يستبدل النقاط بهدايا ومكافآت</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ابدأ في استخدام ExpressWin اليوم
          </h2>
          <p className="text-xl mb-8">
            انضم إلى آلاف العملاء السعداء واستمتع بتجربة ولاء فريدة
          </p>
          <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold">
            سجل الآن
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ExpressWin</h3>
            <p className="text-gray-300">
              برنامج الولاء الرقمي الأمثل لمكافأة عملائك وزيادة ولائهم
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  المميزات
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  كيف يعمل
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  تسجيل الدخول
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <p className="text-gray-300 mb-2">
              البريد الإلكتروني: info@expresswin.com
            </p>
            <p className="text-gray-300">الهاتف: +966 123 456 789</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} ExpressWin. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
