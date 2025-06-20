import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import ImageUpload from "../../common/ImageUpload";
import {
  useGetBrandById,
  useUpdateBrand,
} from "../../../hooks/Api/Admin/useBrands/useBrands";
import PageMeta from "../../common/PageMeta";
import { AxiosError } from "axios";
import {
  BrandApiError,
  BrandClientSideErrors,
  BrandFormErrors,
  MutateBrand,
} from "../../../types/Brands";

const UpdateBrandPage = () => {
  const { t } = useTranslation("UpdateBrand");
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
    });
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError, error } = useGetBrandById(id);
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("errors.global"),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("errors.general"),
        }));
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
      newErrors.name = t("errors.name");
    } else if (!updateData.status) {
      newErrors.status = t("errors.status");
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

      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }

      await mutateAsync({ brandData: formData, id: id! });
      navigate("/admin/brands");
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

        rawErrors.forEach((err: BrandApiError) => {
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

  if (isLoading)
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Brand" />
        <p className="text-center mt-5">{t("loading")}</p>;
      </>
    );

  return (
    <div>
      <PageMeta title={t("main_title")} description="Update Brand" />

      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("update_title")}
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
            <Label htmlFor="name">{t("name_label")}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder={t("name_placeholder_edit")}
            />
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
            {errors.name[0] && (
              <p className="text-red-600 text-sm mt-1">
                {t("errors.unique_name")}
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
            <Label>{t("image_label")}</Label>
            <ImageUpload
              file={updateData.image}
              onFileChange={handleFileChange}
            />
          </div>

          <div>
            {typeof updateData.image === "string" && updateData.image && (
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-400 font-medium mb-4 text-sm">
                  {t("current_image")}
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
          {loading ? t("loading_button") : t("submit_button")}
        </button>
      </form>
    </div>
  );
};

export default UpdateBrandPage;
