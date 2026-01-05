import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  LuUpload,
  LuArrowLeft,
  LuShieldCheck,
  LuHeadphones,
  LuLoader,
  LuX,
} from "react-icons/lu";
import Label from "../../../components/common/form/Label";
import Input from "../../../components/common/input/InputField";
import { useCreateRequest } from "../../../hooks/Api/EndUser/useQuotation/useQuotation";
import { toast } from "react-toastify";

interface RFQFormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  description: string;
  files: File[];
}

const RequestQuotation = () => {
  const { t } = useTranslation(["EndUserQuotaion"]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // الهوك الخاص بإرسال البيانات
  const { mutate, isLoading: isSubmitting } = useCreateRequest();

  const [formData, setFormData] = useState<RFQFormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    description: "",
    files: [],
  });

  // حالة أخطاء الفالديشن (Front-end)
  const [errors, setErrors] = useState<
    Partial<Record<keyof RFQFormData, string>>
  >({});

  const [backendErrors, setBackendErrors] = useState<any>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RFQFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!formData.description.trim()) newErrors.description = "وصف الطلب مطلوب";

    // فالديشن الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (formData.files.length === 0) {
      toast.error("يرجى رفع ملف المقايسة أو صورة واحدة على الأقل");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند البدء في الكتابة
    if (errors[name as keyof RFQFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
    }
  };
  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("description", formData.description);

    formData.files.forEach((file, index) => {
     data.append(`files[${index}]`, file);
    });
    console.log("FormData files:", Array.from(data.entries()));

    mutate(data, {
      onSuccess: () => {
        toast.success("تم إرسال طلبك بنجاح");
        setFormData({
          name: "",
          phone: "",
          address: "",
          email: "",
          description: "",
          files: [],
        });
      },
      onError: (err: any) => {
        const serverErrors = err?.response?.data?.errors;
        if (Array.isArray(serverErrors)) setBackendErrors(serverErrors);
        toast.error("فشل الإرسال، يرجى مراجعة الملفات");
      },
    });
  };

  return (
    <div className="bg-white flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-[45%] bg-[#0a0a0a] relative p-5 md:p-10 flex flex-col items-center md:items-start overflow-hidden border-b lg:border-b-0 lg:border-e border-white/5">
        <div className="absolute -top-24 -right-24 w-[500px] h-[300px] bg-[#d62828] opacity-[0.07] blur-[120px] rounded-full" />
        <div className="relative pt-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d62828]"></span>
            </span>
            <span className="text-[#d62828] text-[11px] font-black uppercase tracking-[0.2em]">
              {t("priority_service", "خدمة تسعير أولوية")}
            </span>
          </div>

          <div className="space-y-6 mt-6">
            <h1 className="text-2xl md:text-4xl xl:text-5xl font-black text-white leading-[1.2] tracking-tight">
              ابدأ رحلة <br />
              <span className="text-[#d62828] drop-shadow-sm">
                تشطيب بيتك
              </span>{" "}
              <br />
              بضغطة واحدة
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md font-medium opacity-80">
              ارفع مقايستك الآن، وسيقوم فريقنا الفني بدراسة مشروعك وتقديم عرض
              أسعار
              <span className="text-white font-bold"> شامل وتفصيلي </span>{" "}
              مجاناً.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-10">
            {[
              {
                icon: <LuShieldCheck />,
                title: "خصوصية بياناتك",
                desc: "تشفير كامل لكافة الملفات",
              },
              {
                icon: <LuHeadphones />,
                title: "دعم فني متخصص",
                desc: "متاحون للرد على استفساراتك",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
              >
                <span className="text-[#d62828] text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-white text-sm font-black">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. جانب النموذج */}
      <div className="lg:w-[55%] p-3 md:p-6 lg:p-12 flex flex-col justify-center bg-white relative">
        <div className="max-w-xl w-full mx-auto space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              بيانات الطلب
            </h2>
            <div className="h-1 w-12 bg-[#d62828] rounded-full" />
            <p className="text-brand-400 text-xs font-bold uppercase tracking-widest pt-2">
              يرجى ملء الحقول لضمان دقة التسعير
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* الحقول الديناميكية */}
              {[
                {
                  name: "name",
                  label: "الاسم بالكامل",
                  placeholder: "يوسف محمد",
                  type: "text",
                },
                {
                  name: "phone",
                  label: "رقم الهاتف",
                  placeholder: "01xxxxxxxxx",
                  type: "tel",
                },
                {
                  name: "email",
                  label: "البريد الإلكتروني",
                  placeholder: "youssef@example.com",
                  type: "email",
                },
                {
                  name: "address",
                  label: "العنوان",
                  placeholder: "القاهرة، المعادي",
                  type: "text",
                },
              ].map((input) => (
                <div key={input.name} className="group space-y-2">
                  <Label
                    className={
                      errors[input.name as keyof RFQFormData]
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {input.label}
                  </Label>
                  <Input
                    name={input.name}
                    value={formData[input.name as keyof RFQFormData] as string}
                    onChange={handleInputChange}
                    placeholder={input.placeholder}
                    type={input.type}
                    className={
                      errors[input.name as keyof RFQFormData]
                        ? "border-red-500 focus:ring-red-200"
                        : ""
                    }
                  />
                  {(errors[input.name as keyof RFQFormData] ||
                    backendErrors?.[input.name]) && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors[input.name as keyof RFQFormData] ||
                        backendErrors?.[input.name]?.[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* وصف الطلب (TextArea) */}
            <div className="space-y-2">
              <Label>وصف الطلب</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="اكتب تفاصيل مشروعك هنا..."
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl min-h-[120px] outline-none transition-all ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-100 focus:border-[#d62828]/20"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] font-bold">
                  {errors.description}
                </p>
              )}
            </div>

            {/* منطقة الرفع */}
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center gap-4 bg-gray-50/50 group-hover:bg-red-50/10 group-hover:border-[#d62828]/20 transition-all duration-500">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-xl shadow-black/5 flex items-center justify-center text-[#d62828] group-hover:rotate-12 transition-transform duration-500">
                  <LuUpload className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-black text-gray-800">
                    ارفع المقايسة أو الصور هنا
                  </p>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    PDF, Excel, Images (Max 15MB)
                  </p>
                  {formData.files.length > 0 && (
                    <p className="text-[#d62828] text-[11px] mt-2 font-bold animate-pulse">
                      تم اختيار {formData.files.length} ملفات
                    </p>
                  )}
                </div>
              </div>
            </div>

            {formData.files.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100"
                  >
                    <span className="text-[10px] font-black text-[#d62828] truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-[#d62828] hover:scale-125 transition-transform"
                    >
                      <LuX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* زر الإرسال */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d62828] disabled:bg-gray-400 text-white py-6 rounded-2xl text-[15px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-200/60 hover:bg-black hover:shadow-black/20 transition-all duration-500 flex items-center justify-center gap-4 group"
              >
                {isSubmitting ? (
                  <LuLoader className="animate-spin w-6 h-6" />
                ) : (
                  "إرسال الطلب الآن"
                )}
                {!isSubmitting && (
                  <>
                    <LuArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-2 rtl:block hidden" />
                    <LuArrowLeft className="w-6 h-6 transition-transform group-hover:translate-x-2 ltr:block hidden rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestQuotation;
