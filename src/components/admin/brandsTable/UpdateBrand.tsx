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
import SEO from "../../../components/common/SEO/seo";
import { AxiosError } from "axios";
import {
  BrandApiError,
  BrandClientSideErrors,
  BrandFormErrors,
  MutateBrand,
} from "../../../types/Brands";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";

const UpdateBrandPage = () => {
  const { t } = useTranslation(["UpdateBrand", "Meta"]);
  const { id } = useParams();
  const navigate = useNavigate();

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
      image: "",
    });
  const [loading, setLoading] = useState(false);

  const {
    data: brandResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBrandById(id);
  const brandData = brandResponse?.data?.data;

  const { mutateAsync } = useUpdateBrand(id!);

  useEffect(() => {
    if (brandData) {
      setUpdateData({
        name: brandData.name || "",
        status: brandData.status || "active",
        image: brandData.image,
      });
    }
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
    const newErrors: BrandClientSideErrors = { name: "", status: "", image: "" };
    if (!updateData.name) {
      newErrors.name = t("UpdateBrand:errors.name");
    }
    if (!updateData.status) {
      newErrors.status = t("UpdateBrand:errors.status");
    }
    if (!updateData.image) {
      newErrors.image = t("UpdateBrand:errors.image");
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("status", updateData.status);

      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }

      await mutateAsync({ brandData: formData, id: id! });
      navigate("/admin/brands", {
        state: { successEdit: t("UpdateBrand:update_success") },
      });
    } catch (error: any) {
      console.error("Error updating brand:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateBrand:errors.global"),
        }));
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
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getPageStatus = () => {
    if (!id) return PageStatus.NOT_FOUND;
    if (isLoading) return PageStatus.LOADING;
    if (isError) return PageStatus.ERROR;
    if (!brandData) return PageStatus.NOT_FOUND;
    return PageStatus.SUCCESS;
  };

  const getErrorMessage = (): string | undefined => {
    if (isError) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401 || status === 403) {
        return t("UpdateBrand:errors.global");
      }
      return t("UpdateBrand:errors.general");
    }
    return undefined;
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <>
      <SEO
        title={{
          ar: `تحديث ماركة ${updateData.name || ""}`,
          en: `Update Brand ${updateData.name || ""}`,
        }}
        description={{
          ar: `صفحة تحديث بيانات الماركة ${
            updateData.name || ""
          } في نظام تشطيبة. قم بتعديل اسم الماركة، حالتها، وشعارها.`,
          en: `Update brand details for ${
            updateData.name || ""
          } in Tashtiba system. Modify brand name, status, and logo.`,
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
        robotsTag="noindex, nofollow"
      />

      <PageStatusHandler
        status={getPageStatus()}
        loadingText={t("UpdateBrand:loading")}
        notFoundText={t("UpdateBrand:not_found")}
        errorMessage={getErrorMessage()}
        onRetry={handleRetry}
      >
        <div className="p-4 border-b dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("UpdateBrand:update_title")}
          </h3>
        </div>

        {errors.global && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.global}
          </p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.general}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
            <div>
              <Label htmlFor="name">{t("UpdateBrand:name_label")}</Label>
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
                  {t("UpdateBrand:errors.unique_name")}
                </p>
              )}
            </div>

            <div>
              <Label>{t("UpdateBrand:status_label")}</Label>
              <Select
                options={[
                  { label: t("UpdateBrand:status_active"), value: "active" },
                  {
                    label: t("UpdateBrand:status_inactive"),
                    value: "inactive",
                  },
                ]}
                onChange={handleSelectChange}
                placeholder={t("UpdateBrand:status_label")}
                value={updateData.status}
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
              <Label>{t("UpdateBrand:image_label")}</Label>
              <ImageUpload
                file={updateData.image}
                onFileChange={handleFileChange}
                />
                {clientSideErrors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {clientSideErrors.name}
                  </p>
                )}
                {errors.image[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {t("UpdateBrand:errors.unique_name")}
                  </p>
                )}
            </div>

            <div>
              {typeof updateData.image === "string" && updateData.image && (
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-400 font-medium mb-4 text-sm">
                    {t("UpdateBrand:current_image")}
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
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {loading
              ? t("UpdateBrand:loading_button")
              : t("UpdateBrand:submit_button")}
          </button>
        </form>
      </PageStatusHandler>
    </>
  );
};

export default UpdateBrandPage;
