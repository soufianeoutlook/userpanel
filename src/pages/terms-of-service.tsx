import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchTermsOfService = async () => {
      try {
        const { getPolicyPage } = await import("../api/policy");
        const response = await getPolicyPage("terms-of-service");

        if (response.success && response.page) {
          setContent(response.page.content);
        }
      } catch (error) {
        console.error("Error fetching terms of service:", error);
      }
    };

    fetchTermsOfService();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          العودة
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-purple-700">شروط الخدمة</h1>

        <div className="prose max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <>
              <p className="mb-4">
                مرحبًا بك في ExpressWin. تحكم شروط الخدمة هذه استخدامك لتطبيقنا
                وخدماتنا. باستخدام تطبيقنا، فإنك توافق على الالتزام بهذه الشروط.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">استخدام الخدمة</h2>
              <p className="mb-4">
                أنت توافق على استخدام خدماتنا وفقًا لجميع القوانين واللوائح
                المعمول بها. يجب أن تكون بعمر 18 عامًا على الأقل لاستخدام
                خدماتنا.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">حسابك</h2>
              <p className="mb-4">
                أنت مسؤول عن الحفاظ على سرية معلومات حسابك، بما في ذلك رقم PIN
                الخاص بك. أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">برنامج الولاء</h2>
              <p className="mb-4">يخضع برنامج الولاء لدينا للشروط التالية:</p>
              <ul className="list-disc mr-6 mb-4">
                <li>
                  يمكن استخدام بطاقات الولاء فقط من قبل صاحب الحساب المسجل
                </li>
                <li>
                  النقاط والمكافآت غير قابلة للتحويل ولا يمكن استبدالها بالنقد
                </li>
                <li>نحتفظ بالحق في تعديل أو إنهاء برنامج الولاء في أي وقت</li>
                <li>قد تنتهي صلاحية النقاط والمكافآت بعد فترة زمنية محددة</li>
              </ul>

              <h2 className="text-xl font-bold mt-6 mb-3">الملكية الفكرية</h2>
              <p className="mb-4">
                جميع المحتويات والمواد المتاحة في تطبيقنا، بما في ذلك النصوص
                والرسومات والشعارات والصور، هي ملكية لـ ExpressWin أو مرخصة لنا.
                لا يجوز نسخ أو توزيع أو تعديل هذه المواد دون إذن كتابي مسبق.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">إخلاء المسؤولية</h2>
              <p className="mb-4">
                يتم توفير خدماتنا "كما هي" و"كما هو متاح" دون أي ضمانات من أي
                نوع. لا نضمن أن خدماتنا ستكون غير منقطعة أو خالية من الأخطاء.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">تحديد المسؤولية</h2>
              <p className="mb-4">
                لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو
                خاصة أو تبعية ناتجة عن استخدامك لخدماتنا.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                التغييرات على الشروط
              </h2>
              <p className="mb-4">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنخطرك بأي تغييرات
                جوهرية من خلال إشعار على تطبيقنا أو عبر البريد الإلكتروني.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">اتصل بنا</h2>
              <p className="mb-4">
                إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يرجى التواصل معنا
                على:
              </p>
              <p className="mb-4">
                البريد الإلكتروني: info@expresswin.com
                <br />
                الهاتف: +966 123 456 789
              </p>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ExpressWin. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
