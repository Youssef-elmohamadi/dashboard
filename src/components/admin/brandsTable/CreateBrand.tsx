import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../common/ImageUpload";
import { useCreateBrand } from "../../../hooks/Api/Admin/useBrands/useBrands";
import SEO from "../../../components/common/SEO/seo";
import {
  BrandClientSideErrors,
  BrandFormErrors,
  MutateBrand,
} from "../../../types/Brands";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";

export default function CreateBrand() {
  const { t } = useTranslation(["CreateBrand", "Meta"]);

  const [brandData, setBrandData] = useState<MutateBrand>({
    name_ar: "",
    name_en: "",
    status: "",
    image: null,
  });

  const [errors, setErrors] = useState<BrandFormErrors>({
    name_ar: [],
    name_en: [],
    status: [],
    image: [],
    global: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [clientSideErrors, setClientSideErrors] =
    useState<BrandClientSideErrors>({
      name_ar: "",
      name_en: "",
      status: "",
      image: "",
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
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const validate = () => {
    const newErrors = {
      name_ar: "",
      name_en: "",
      status: "",
      image: "",
    };

    if (!brandData.name_ar) {
      newErrors.name_ar = t("CreateBrand:errors.name");
    }

    if (!brandData.name_en) {
      newErrors.name_en = t("CreateBrand:errors.name");
    }

    if (!brandData.status) {
      newErrors.status = t("CreateBrand:errors.status");
    }

    if (!brandData.image) {
      newErrors.image = t("CreateBrand:errors.image");
    }

    const isValid = Object.values(newErrors).every((error) => error === "");
    setClientSideErrors(newErrors);
    return { isValid, newErrors };
  };

  const focusOnError = (errors: Record<string, string | string[]>) => {
    const errorEntry = Object.entries(errors).find(
      ([_, value]) =>
        (typeof value === "string" && value !== "") ||
        (Array.isArray(value) && value.length > 0)
    );

    if (errorEntry) {
      const fieldName = errorEntry[0];
      const ref = inputRefs?.current[fieldName];
      ref?.focus();
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          ref.focus({ preventScroll: true });
        }, 300);
      }
    }
  };
  const { mutateAsync } = useCreateBrand();
  const isCurrentlyOnline = useCheckOnline();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentlyOnline()) {
      toast.error(t("CreateBrand:errors.no_internet"));
      setLoading(false);
      return;
    }
    const { isValid, newErrors } = validate();
    if (!isValid) {
      focusOnError(newErrors);
      return;
    }
    try {
      setLoading(true);
      const brandFormData = new FormData();
      brandFormData.append("name_ar", brandData.name_ar);
      brandFormData.append("name_en", brandData.name_en);
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
        focusOnError(formattedErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("CreateBrand:errors.general"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SEO
        title={{
          ar: " إنشاء ماركة جديدة",
          en: "Create New Brand",
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
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateBrand:create_title")}
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
            <Label htmlFor="name_ar">{t("CreateBrand:name_label_ar")}</Label>{" "}
            <Input
              type="text"
              name="name_ar"
              id="name_ar"
              value={brandData.name_ar}
              onChange={handleChange}
              placeholder={t("CreateBrand:name_placeholder_ar")}
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["name_ar"] = el;
                }
              }}
            />
            {clientSideErrors.name_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name_ar}
              </p>
            )}
            {errors.name_ar[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("CreateBrand:errors.name_unique_ar")}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="name_en">{t("CreateBrand:name_label_en")}</Label>{" "}
            <Input
              type="text"
              name="name_en"
              id="name_en"
              value={brandData.name_en}
              onChange={handleChange}
              placeholder={t("CreateBrand:name_placeholder_en")}
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["name_en"] = el;
                }
              }}
            />
            {clientSideErrors.name_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name_en}
              </p>
            )}
            {errors.name_en[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("CreateBrand:errors.name_unique_en")}
              </p>
            )}
          </div>
          <div>
            <Label>{t("CreateBrand:status_label")}</Label>{" "}
            <Select
              options={[
                { label: t("CreateBrand:status_active"), value: "active" },
                {
                  label: t("CreateBrand:status_inactive"),
                  value: "inactive",
                },
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
          <Label>{t("CreateBrand:image_label")}</Label>
          <ImageUpload file={brandData.image} onFileChange={handleFileChange} />
          {clientSideErrors.image && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.image}
            </p>
          )}
          {errors.image[0] && (
            <p className="text-red-600 text-sm mt-1">
              {t("CreateBrand:errors.image_valid")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded  disabled:opacity-50"
        >
          {loading
            ? t("CreateBrand:loading_button")
            : t("CreateBrand:submit_button")}{" "}
        </button>
      </form>
    </div>
  );
}
