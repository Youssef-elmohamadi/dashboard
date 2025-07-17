import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import ImageUpload from "../../common/ImageUpload";
import {
  useGetBrandById,
  useUpdateBrand,
} from "../../../hooks/Api/Admin/useBrands/useBrands";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // Commented out PageMeta import
import SEO from "../../../components/common/SEO/seo"; // Imported SEO component
import { AxiosError } from "axios";
import {
  BrandApiError,
  BrandClientSideErrors,
  BrandFormErrors,
  MutateBrand,
} from "../../../types/Brands";

const UpdateBrandPage = () => {
  const { t } = useTranslation(["UpdateBrand", "Meta"]); // Using namespaces here
  const { id } = useParams();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(false);
  const [updateData, setUpdateData] = useState<MutateBrand>({
    name: "",
    status: "active",
    image: "",
  });
  const [errors, setErrors] = useState<BrandFormErrors>({
    name: [],
    status: [],
    image: [],
    global: "",
    general: "",
  });
  const [clientSideErrors, setClientSideErrors] =
    useState<BrandClientSideErrors>({
      name: "",
      status: "",
    });
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError, error } = useGetBrandById(id);

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error, t]);
  const brandData = data?.data?.data;
  useEffect(() => {
    setUpdateData({
      name: brandData?.name || "",
      status: brandData?.status || "active",
      image: brandData?.image,
    });
  }, [brandData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setUpdateData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      status: value as "active" | "inactive",
    }));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      status: "",
    };
    if (!updateData.name) {
      newErrors.name = t("UpdateBrand:errors.name"); // Added namespace
    } else if (!updateData.status) {
      newErrors.status = t("UpdateBrand:errors.status"); // Added namespace
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };
  const { mutateAsync } = useUpdateBrand(id!);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("status", updateData.status);
      formData.append("_method", "PUT"); // Required for Laravel PUT with FormData

      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }

      await mutateAsync({ brandData: formData, id: id! });
      navigate("/admin/brands", {
        state: { successEdit: t("UpdateBrand:update_success") }, // Added namespace
      });
    } catch (error: any) {
      console.error("Error updating brand:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("UpdateBrand:errors.global"), // Added namespace
        });
        return;
      }
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: BrandApiError) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateBrand:errors.general"),
        })); // Added namespace
      }
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تحديث ماركة - معرف غير موجود",
            en: "Tashtiba - Update Brand - ID Missing",
          }}
          description={{
            ar: "صفحة تحديث الماركة تتطلب معرف ماركة صالح. يرجى التأكد من توفير المعرف.",
            en: "The brand update page requires a valid brand ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تحديث ماركة",
              "خطأ معرف",
              "ماركة غير صالحة",
              "تشطيبة",
              "إدارة الماركات",
            ],
            en: [
              "update brand",
              "ID error",
              "invalid brand",
              "Tashtiba",
              "brand management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateBrand:no_data")} {/* Added namespace */}
        </div>
      </>
    );
  }

  if (isLoading)
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تحديث ماركة",
            en: "Tashtiba - Update Brand",
          }}
          description={{
            ar: "جارٍ تحميل بيانات الماركة للتحديث في تشطيبة. يرجى الانتظار.",
            en: "Loading brand data for update in Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تحديث ماركة",
              "تحميل بيانات",
              "إدارة الماركات",
              "تشطيبة",
              "التحميل",
            ],
            en: [
              "update brand",
              "loading data",
              "brand management",
              "Tashtiba",
              "loading",
            ],
          }}
        />
        <p className="text-center mt-5">{t("UpdateBrand:loading")}</p>{" "}
        {/* Added namespace */}
      </>
    );

  if (!brandData && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - ماركة غير موجودة",
            en: "Tashtiba - Brand Not Found",
          }}
          description={{
            ar: "الماركة المطلوبة للتحديث غير موجودة في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested brand for update was not found in Tashtiba system. Please check the ID.",
          }}
          keywords={{
            ar: [
              "ماركة غير موجودة",
              "خطأ",
              "تحديث ماركة",
              "تشطيبة",
              "إدارة الماركات",
            ],
            en: [
              "brand not found",
              "error",
              "update brand",
              "Tashtiba",
              "brand management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateBrand:not_found")} {/* Added namespace */}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - خطأ عام في تحديث الماركة",
            en: "Tashtiba - General Brand Update Error",
          }}
          description={{
            ar: "حدث خطأ غير متوقع أثناء تحديث الماركة في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "An unexpected error occurred while updating the brand in Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: ["خطأ تحديث ماركة", "مشكلة تقنية", "تشطيبة", "فشل التحديث"],
            en: [
              "brand update error",
              "technical issue",
              "Tashtiba",
              "update failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateBrand:errors.general")} {/* Added namespace */}
        </div>
      </>
    );
  }

  return (
    <div>
      <SEO // PageMeta replaced with SEO, and data directly set
        title={{
          ar: "تشطيبة - تحديث ماركة",
          en: "Tashtiba - Update Brand",
        }}
        description={{
          ar: "صفحة تحديث بيانات الماركة في نظام تشطيبة. قم بتعديل اسم الماركة، حالتها، وشعارها.",
          en: "Update brand details in Tashtiba system. Modify brand name, status, and logo.",
        }}
        keywords={{
          ar: [
            "تحديث ماركة",
            "تعديل براند",
            "إدارة الماركات",
            "تشطيبة",
            "منتجات",
            "تعديل شعار",
          ],
          en: [
            "update brand",
            "edit brand",
            "brand management",
            "Tashtiba",
            "products",
            "update logo",
          ],
        }}
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateBrand:update_title")} {/* Added namespace */}
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
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="name">{t("UpdateBrand:name_label")}</Label>{" "}
            {/* Added namespace */}
            <Input
              type="text"
              name="name"
              id="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder={t("UpdateBrand:name_placeholder_edit")}
            />
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
            {errors.name[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("UpdateBrand:errors.unique_name")} {/* Added namespace */}
              </p>
            )}
          </div>

          <div>
            <Label>{t("UpdateBrand:status_label")}</Label>{" "}
            {/* Added namespace */}
            <Select
              options={[
                { label: t("UpdateBrand:status_active"), value: "active" }, // Added namespace
                { label: t("UpdateBrand:status_inactive"), value: "inactive" }, // Added namespace
              ]}
              onChange={handleSelectChange}
              placeholder={t("UpdateBrand:status_label")}
              defaultValue={updateData.status}
            />
            {clientSideErrors.status && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.status}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div className="w-full">
            <Label>{t("UpdateBrand:image_label")}</Label>{" "}
            {/* Added namespace */}
            <ImageUpload
              file={updateData.image}
              onFileChange={handleFileChange}
            />
          </div>

          <div>
            {typeof updateData.image === "string" && updateData.image && (
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-400 font-medium mb-4 text-sm">
                  {t("UpdateBrand:current_image")} {/* Added namespace */}
                </p>
                <img
                  src={updateData.image}
                  alt="Brand Preview"
                  className="w-32 h-32 object-cover rounded border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? t("UpdateBrand:loading_button")
            : t("UpdateBrand:submit_button")}{" "}
          {/* Added namespace */}
        </button>
      </form>
    </div>
  );
};

export default UpdateBrandPage;
