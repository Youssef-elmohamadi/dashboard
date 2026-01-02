import React, { useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";
import SEO from "../../common/SEO/seo";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";
import { Car, ClientErrors, ServerErrors, TransportInputData, TruckTypes } from "../../../types/transports";
import { useCreateTransportationPrice } from "../../../hooks/Api/SuperAdmin/useTransports/useSuperAdminTransports";
import Select from "../../common/form/Select";
import Checkbox from "../../common/input/Checkbox";
const CreateTransport = () => {
  const { t } = useTranslation(["CreateTransport"]);
  const [transportData, setTransportData] = useState<TransportInputData>({
    area_ar:"",
    area_en:"",
    is_free:false,
    vehicle_type:"",
    fixed_price:"",
  });
  const truckTypes:TruckTypes = [
  { name: "جامبو (نقل كبير)", value: "jumbo" },
  { name: "تانكر (عربية صهريج)", value: "tanker" },
  { name: "سطحة (نقل مفتوح)", value: "flatbed" },
  { name: "كونتينر (حاوية شحن)", value: "container" },
  { name: "تلاجة (نقل مبرد)", value: "refrigerated" }
];
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ServerErrors>({
    area_ar: [],
    area_en: [],
    is_free: [],
    vehicle_type: [],
    fixed_price: [],
    global: "",
    general: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    area_ar: "",
    area_en: "",
    is_free: false,
    vehicle_type: "",
    fixed_price: "",
  });
const validate = () => {
    const newErrors: ClientErrors = {
      area_ar: "",
      area_en: "",
      is_free: false,
      vehicle_type: "",
      fixed_price: "",
    };

    if (!transportData.area_ar) newErrors.area_ar = t("transport.errors.name");
    if (!transportData.area_en) newErrors.area_en = t("transport.errors.name");
    if (!transportData.vehicle_type) newErrors.vehicle_type = t("transport.errors.position");
    if (!transportData.is_free && !transportData.fixed_price) {
      newErrors.fixed_price = t("transport.errors.status");
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((val) => val === "");
  };
  const { mutateAsync: createTransport } = useCreateTransportationPrice();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransportData((prev) => ({ ...prev, [name]: value }));
  };


  const isCurrentlyOnline = useCheckOnline();
  const navigate =useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      area_ar: [],
      area_en: [],
      is_free: [],
      vehicle_type: [],
      fixed_price: [],
      global: "",
      general: "",
    });

    if (!isCurrentlyOnline()) {
      toast.error(t("Createtransport:transport.errors.no_internet"));
      return;
    }
    setIsSubmitting(true);
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("area_ar", transportData.area_ar);
    formData.append("area_en", transportData.area_en);
    formData.append("is_free", transportData.is_free ? "1" : "0");
    formData.append("vehicle_type", transportData.vehicle_type);
    formData.append("fixed_price", transportData.fixed_price.toString());
    try {
      await createTransport(formData);
      navigate("/super_admin/transport", {
        state: { successCreate: t("transport.success") },
      });
    } catch (error: any) {
      console.error("Error creating Transport:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({ ...prev, global: t("Transport.errors.global") }));
        return;
      }
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("Transport.errors.general"),
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title={{
          ar: " إنشاء سعر نقل جديد (سوبر أدمن)",
          en: "Create New transport (Super Admin)",
        }}
        description={{
          ar: "صفحة إنشاء سعر نقل جديد بواسطة المشرف العام في تشطيبة. أدخل التفاصيل، نوع الرابط، الموضع، وقم بتحميل الصورة.",
          en: "Create a new Transportation Price by Super Admin on Tashtiba. Enter details, link type, position, and upload image.",
        }}
        keywords={{
          ar: [
            "إنشاء سعر نقل",
            "إضافة سعر نقل جديد",
            "سعر نقل جديد",
            "سوبر أدمن",
            "إدارة اسعار نقلات",
            "نقل الموقع",
            "تشطيبة",
          ],
          en: [
            "create Transportation Price",
            "add new Transportation Price",
            "new Transportation Price ",
            "super admin",
            "Transportation Price  management",
            "website Transportation",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("transport.title")}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {errors.global && (
          <p className="text-red-500 text-sm text-center">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="title">{t("transport.area_ar")}</Label>
            <Input
              name="area_ar"
              value={transportData.area_ar}
              onChange={handleChange}
              placeholder={t("transport.area_ar_placeholder")}
            />
            {errors.area_ar?.[0] && (
              <p className="text-red-500 text-sm mt-1">
                {t("transport.errors.areaRequired")}
              </p>
            )}
            {clientSideErrors.area_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.area_ar}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="title">{t("transport.area_en")}</Label>
            <Input
              name="area_en"
              value={transportData.area_en}
              onChange={handleChange}
              placeholder={t("transport.area_en_placeholder")}
            />
            {errors.area_en?.[0] && (
              <p className="text-red-500 text-sm mt-1">
                {t("transport.errors.areaRequired")}
              </p>
            )}
            {clientSideErrors.area_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.area_en}
              </p>
            )}
          </div>
                               <div>
              <Label htmlFor="">{t("transport.vehicle_type")}</Label>
              <Select
                options={truckTypes?.map((vehicle: Car) => ({
                  value: vehicle.value,
                  label: vehicle.name,
                }))}
                value={transportData.vehicle_type}
                onChange={(value) =>
                  setTransportData((prev) => ({ ...prev, vehicle_type: value }))
                }
                placeholder={t("transport.vehicle_type_placeholder")}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.vehicle_type[0] && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicle_type[0]}</p>
              )}
              {clientSideErrors.vehicle_type && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.vehicle_type}
                </p>
              )}
            </div>
          <div>
            <Label htmlFor="fixed_price">{t("transport.fixed_price")}</Label>
<Input
  name="fixed_price"
  value={transportData.fixed_price}
  onChange={handleChange}
  placeholder={t("transport.fixed_price_placeholder")}
  type="number"
  disabled={transportData.is_free} // تعطيل الحقل
  className={transportData.is_free ? "bg-gray-100 cursor-not-allowed" : ""} // تنسيق اختياري ليوضح أنه معطل
/>
            {errors.fixed_price[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.fixed_price[0]}</p>
            )}
            {clientSideErrors.fixed_price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.fixed_price}
              </p>
            )}
          </div>

           <div className="flex gap-2 items-center">
              <Label htmlFor="is_free">
                {t("transport.is_free")}
              </Label>
              <Checkbox
                checked={transportData.is_free}
onChange={(checked) =>
    setTransportData((prev) => ({
      ...prev,
      is_free: checked,
      fixed_price: checked ? "" : prev.fixed_price, // تصفير السعر إذا تم اختيار مجاني
    }))
  }
                id="is_free"
              />
              {errors.is_free && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.is_free[0]}
                </p>
              )}
            </div>

        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? t("transport.submitting") : t("transport.submit")}
        </Button>
      </form>
    </div>
  );
};

export default CreateTransport;
