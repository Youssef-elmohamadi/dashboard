import React, { useState, useEffect } from "react";
import { createBanner } from "../../../api/SuperAdminApi/Banners/_requests";
import { getAllCategories } from "../../../api/SuperAdminApi/Categories/_requests";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../form/Select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";

interface Category {
  id: string;
  name: string;
}

const CreateBanner = () => {
    const { t } = useTranslation(["CreateBanner"]);
    const [bannerData, setBannerData] = useState({
        title: "",
        link_type: "external",
        url: "",
        link_id: "",
        position: "",
        is_active: "1",
    });
    const [errors, setErrors] = useState<Record<string, string[] | string>>({});
  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) setCategories(response.data.data.original);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!bannerData.title) newErrors.title = t("banner.errors.name");
    if (!bannerData.link_type)
      newErrors.link_type = t("banner.errors.linkType");
    if (!bannerData.position) newErrors.position = t("banner.errors.position");
    if (!bannerData.is_active) newErrors.is_active = t("banner.errors.status");

    if (bannerData.link_type === "external" && !bannerData.url) {
      newErrors.url = t("banner.errors.url");
    }
    if (bannerData.link_type === "category" && !bannerData.link_id) {
      newErrors.link_id = t("banner.errors.category");
    }
    if (!imageFile) {
      newErrors.image = t("banner.errors.image");
    }

    setClientSideErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", bannerData.title);
    if (imageFile) formData.append("image", imageFile);
    formData.append("link_type", bannerData.link_type);
    formData.append("is_active", bannerData.is_active);

    if (bannerData.link_type === "external") {
      formData.append("url", bannerData.url);
    } else {
      formData.append("link_id", bannerData.link_id);
    }
    formData.append("position", bannerData.position);
    try {
      await createBanner(formData);
      navigate("/super_admin/banners", {
        state: { successCreate: t("banner.success") },
      });
    } catch (error: any) {
      console.error("Error creating banner:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({ global: t("banner.errors.global") });
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

        setErrors(formattedErrors);
      } else {
        setErrors({ general: t("banner.errors.general") });
      }
    }
  };

  return (
    <div>
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("banner.title")}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="title">{t("banner.name")}</Label>
            <Input
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              placeholder={t("banner.titlePlaceholder")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {t("banner.errors.titleTaken")}
              </p>
            )}
            {clientSideErrors.title && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="link_type">{t("banner.linkType")}</Label>
            <Select
              defaultValue={bannerData.link_type}
              onChange={(value) =>
                setBannerData((prev) => ({ ...prev, link_type: value }))
              }
              options={[
                {
                  value: "external",
                  label: t("banner.options.externalOption"),
                },
                {
                  value: "category",
                  label: t("banner.options.categoryOption"),
                },
              ]}
              placeholder={t("banner.linkTypePlaceholder")}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {errors.link_type && (
              <p className="text-red-500 text-sm mt-1">{errors.link_type}</p>
            )}
            {clientSideErrors.link_type && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.link_type}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bannerData.link_type === "external" && (
            <div>
              <Label htmlFor="url">{t("banner.url")}</Label>
              <Input
                name="url"
                value={bannerData.url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
              )}
              {clientSideErrors.url && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.url}
                </p>
              )}
            </div>
          )}

          {bannerData.link_type === "category" && (
            <div>
              <Label htmlFor="link_id">{t("banner.category")}</Label>
              <Select
                options={categories.map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))}
                defaultValue={bannerData.link_id}
                onChange={(value) =>
                  setBannerData((prev) => ({ ...prev, link_id: value }))
                }
                placeholder={t("banner.categoryPlaceholder")}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.link_id && (
                <p className="text-red-500 text-sm mt-1">{errors.link_id}</p>
              )}
              {clientSideErrors.link_id && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.link_id}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="position">{t("banner.position")}</Label>
            <Select
              defaultValue={bannerData.position}
              onChange={(value) =>
                setBannerData((prev) => ({ ...prev, position: value }))
              }
              options={categories.map((cat) => ({
                value: cat.id,
                label: `Before ${cat.name}`,
              }))}
              placeholder={t("banner.positionPlaceholder")}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
            {clientSideErrors.position && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.position}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="is_active">{t("banner.status")}</Label>
            <Select
              defaultValue={bannerData.is_active}
              onChange={(value) =>
                setBannerData((prev) => ({ ...prev, is_active: value }))
              }
              options={[
                { value: "1", label: t("banner.options.active") },
                { value: "0", label: t("banner.options.inactive") },
              ]}
              placeholder={t("banner.statusPlaceholder")}
            />
            {errors.is_active && (
              <p className="text-red-500 text-sm mt-1">{errors.is_active}</p>
            )}
            {clientSideErrors.is_active && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.is_active}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="image">{t("banner.bannerImage")}</Label>
          <Input type="file" onChange={handleImageChange} />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {t("banner.errors.invalidImage")}
            </p>
          )}
          {clientSideErrors.image && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.image}
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-80 mt-2 rounded"
            />
          )}
        </div>
        {errors.global && (
          <p className="text-red-500 text-sm">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        <Button type="submit" className="lg:w-1/4 ">
          {t("banner.submit")}
        </Button>
      </form>
    </div>
  );
};

export default CreateBanner;
