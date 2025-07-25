import { useState } from "react";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../common/ImageUpload";
import { useCreateBrand } from "../../../hooks/Api/Admin/useBrands/useBrands";
// import PageMeta from "../../common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component
import {
  BrandClientSideErrors,
  BrandFormErrors,
  MutateBrand,
} from "../../../types/Brands";

export default function CreateBrand() {
  const { t } = useTranslation(["CreateBrand", "Meta"]); // استخدام الـ namespaces هنا

  const [brandData, setBrandData] = useState<MutateBrand>({
    name: "",
    status: "",
    image: null,
  });

  const [errors, setErrors] = useState<BrandFormErrors>({
    name: [],
    status: [],
    image: [],
    global: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [clientSideErrors, setClientSideErrors] =
    useState<BrandClientSideErrors>({
      name: "",
      status: "",
    });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setBrandData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setBrandData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      status: "",
    };
    if (!brandData.name) {
      newErrors.name = t("CreateBrand:errors.name"); // إضافة namespace
    } else if (!brandData.status) {
      newErrors.status = t("CreateBrand:errors.status"); // إضافة namespace
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const { mutateAsync } = useCreateBrand();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const brandFormData = new FormData();
      brandFormData.append("name", brandData.name);
      brandFormData.append("status", brandData.status || "active");

      if (brandData.image) {
        brandFormData.append("image", brandData.image);
      }

      await mutateAsync(brandFormData);
      navigate("/admin/brands", {
        state: { successCreate: t("CreateBrand:create_success") }, // إضافة namespace
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("CreateBrand:errors.global"), // إضافة namespace
        });
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
        setErrors((prev) => ({ ...prev, general: t("CreateBrand:errors.general") })); // إضافة namespace
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - إنشاء ماركة جديدة",
          en: "Tashtiba - Create New Brand",
        }}
        description={{
          ar: "صفحة إنشاء ماركة (براند) جديدة للمنتجات في تشطيبة. أدخل اسم الماركة وحالتها، وقم بتحميل الشعار.",
          en: "Create a new product brand on Tashtiba. Enter the brand name, status, and upload the logo.",
        }}
        keywords={{
          ar: [
            "إنشاء ماركة",
            "إضافة براند",
            "ماركة جديدة",
            "إدارة الماركات",
            "تشطيبة",
            "منتجات",
            "شعار",
          ],
          en: [
            "create brand",
            "add new brand",
            "new product brand",
            "brand management",
            "Tashtiba",
            "products",
            "logo",
          ],
        }}
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateBrand:create_title")} {/* إضافة namespace */}
        </h3>
      </div>
      {errors.global && (
        <p className="text-red-500 text-sm mt-4 text-center">{errors.global}</p>
      )}
      {errors.general && (
        <p className="text-red-500 text-sm mt-4 text-center">
          {errors.general}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 pt-3">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="name">{t("CreateBrand:name_label")}</Label> {/* إضافة namespace */}
            <Input
              type="text"
              name="name"
              id="name"
              value={brandData.name}
              onChange={handleChange}
              placeholder={t("CreateBrand:name_placeholder")}
            />
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
            {errors.name[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("CreateBrand:errors.name_unique")} {/* إضافة namespace */}
              </p>
            )}
          </div>
          <div>
            <Label>{t("CreateBrand:status_label")}</Label> {/* إضافة namespace */}
            <Select
              options={[
                { label: t("CreateBrand:status_active"), value: "active" }, // إضافة namespace
                { label: t("CreateBrand:status_inactive"), value: "inactive" }, // إضافة namespace
              ]}
              onChange={handleSelectChange}
              placeholder={t("CreateBrand:status_label")}
              value={brandData.status}
            />
            {clientSideErrors.status && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.status}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>{t("CreateBrand:image_label")}</Label> {/* إضافة namespace */}
          <ImageUpload file={brandData.image} onFileChange={handleFileChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("CreateBrand:loading_button") : t("CreateBrand:submit_button")} {/* إضافة namespace */}
        </button>
      </form>
    </div>
  );
}