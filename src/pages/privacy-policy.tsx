import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const { getPolicyPage } = await import("../api/policy");
        const response = await getPolicyPage("privacy-policy");

        if (response.success && response.page) {
          setContent(response.page.content);
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    };

    fetchPrivacyPolicy();
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

        <h1 className="text-3xl font-bold mb-6 text-purple-700">
          سياسة الخصوصية
        </h1>

        <div className="prose max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <>
              <p className="mb-4">
                نحن في ExpressWin نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية.
                تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند
                استخدام تطبيقنا وخدماتنا.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                المعلومات التي نجمعها
              </h2>
              <p className="mb-4">
                نجمع المعلومات التالية عند استخدامك لتطبيقنا:
              </p>
              <ul className="list-disc mr-6 mb-4">
                <li>معلومات التسجيل (رقم الهاتف، الاسم)</li>
                <li>معلومات الاستخدام (البطاقات المفعلة، الهدايا المستخدمة)</li>
                <li>معلومات الجهاز والتصفح</li>
              </ul>

              <h2 className="text-xl font-bold mt-6 mb-3">
                كيفية استخدام المعلومات
              </h2>
              <p className="mb-4">
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc mr-6 mb-4">
                <li>توفير وتحسين خدماتنا</li>
                <li>إدارة حسابك وبطاقات الولاء الخاصة بك</li>
                <li>التواصل معك بخصوص العروض والتحديثات</li>
                <li>تحليل استخدام التطبيق وتحسين تجربة المستخدم</li>
              </ul>

              <h2 className="text-xl font-bold mt-6 mb-3">مشاركة المعلومات</h2>
              <p className="mb-4">
                لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
              </p>
              <ul className="list-disc mr-6 mb-4">
                <li>بموافقتك الصريحة</li>
                <li>مع شركائنا في برنامج الولاء لتقديم الخدمات</li>
                <li>عند الضرورة للامتثال للقوانين والأنظمة</li>
              </ul>

              <h2 className="text-xl font-bold mt-6 mb-3">أمان البيانات</h2>
              <p className="mb-4">
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير
                المصرح به أو التعديل أو الإفصاح أو الإتلاف.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">حقوقك</h2>
              <p className="mb-4">
                لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. يمكنك
                أيضًا الاعتراض على معالجة بياناتك أو طلب تقييد المعالجة.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                التغييرات على سياسة الخصوصية
              </h2>
              <p className="mb-4">
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي
                تغييرات جوهرية من خلال إشعار على تطبيقنا أو عبر البريد
                الإلكتروني.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">اتصل بنا</h2>
              <p className="mb-4">
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا
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

export default PrivacyPolicy;
