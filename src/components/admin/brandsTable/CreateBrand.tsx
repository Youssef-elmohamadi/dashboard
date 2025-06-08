import { useState } from "react";
import { useTranslation } from "react-i18next";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { useNavigate } from "react-router-dom";
import BrandImageUpload from "./BrandImageUpload";
import { useCreateBrand } from "../../../hooks/Api/Admin/useBrands/useBrands";
import PageMeta from "../../common/PageMeta";

export default function CreateBrand() {
  const { t } = useTranslation(["CreateBrand"]);

  const [brandData, setBrandData] = useState<{
    name: string;
    status: string;
    image: File | null;
  }>({
    name: "",
    status: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: [] as string[],
    status: [] as string[],
    image: [] as string[],
    global: "" as string,
    general: "" as string,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [clientSideErrors, setClientSideErrors] = useState({
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
      newErrors.name = t("errors.name");
    } else if (!brandData.status) {
      newErrors.status = t("errors.status");
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
        state: { successCreate: t("create_success") },
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("errors.global"),
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
        setErrors((prev) => ({ ...prev, general: t("errors.general") }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <PageMeta title={t("main_title")} description="Create Brand" />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("create_title")}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 pt-3">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="name">{t("name_label")}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={brandData.name}
              onChange={handleChange}
              placeholder={t("name_placeholder")}
            />
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
            {errors.name[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("errors.name_unique")}
              </p>
            )}
          </div>
          <div>
            <Label>{t("status_label")}</Label>
            <Select
              options={[
                { label: t("status_active"), value: "active" },
                { label: t("status_inactive"), value: "inactive" },
              ]}
              onChange={handleSelectChange}
              placeholder={t("status_label")}
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
          <Label>{t("image_label")}</Label>
          <BrandImageUpload
            file={brandData.image}
            onFileChange={handleFileChange}
          />
        </div>

        {errors.global && (
          <p className="text-red-500 text-sm mt-4">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("loading_button") : t("submit_button")}
        </button>
      </form>
    </div>
  );
}
