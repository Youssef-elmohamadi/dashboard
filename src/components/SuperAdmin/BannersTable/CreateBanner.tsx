import React, { useEffect, useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";
import { useAllCategories } from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useCreateBanner } from "../../../hooks/Api/SuperAdmin/useBanners/useSuperAdminBanners";
import { AxiosError } from "axios";
import {
  BannerInput,
  ClientErrors,
  ServerErrors,
} from "../../../types/Banners";
import { Category } from "../../../types/Categories";
import SEO from "../../common/SEO/seo";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";

const CreateBanner = () => {
  const { t } = useTranslation(["CreateBanner", "Meta"]);
  const [bannerData, setBannerData] = useState<BannerInput>({
    title: "",
    image: "",
    link_type: "",
    url: "",
    link_id: "",
    position: "",
    is_active: "",
  });
  const [fetchingCategoriesError, setFetchingCategoriesError] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ServerErrors>({
    title: [],
    image: [],
    link_type: [],
    url: [],
    link_id: [],
    position: [],
    is_active: [],
    global: "",
    general: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    title: "",
    image: "",
    link_type: "",
    url: "",
    link_id: "",
    position: "",
    is_active: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();

  const {
    data: allCategories,
    isError: isErrorFetchingCategories,
    error: categoriesError,
  } = useAllCategories();

  const categories = allCategories?.original || [];

  useEffect(() => {
    if (isErrorFetchingCategories && categoriesError instanceof AxiosError) {
      const status = categoriesError?.response?.status;
      if (status === 401 || status === 403) {
        setFetchingCategoriesError(t("banner.errors.global"));
      } else {
        setFetchingCategoriesError(t("banner.errors.fetching_categories"));
      }
    }
  }, [isErrorFetchingCategories, categoriesError, t]);
  const validate = () => {
    const newErrors: ClientErrors = {
      title: "",
      image: "",
      link_type: "",
      url: "",
      link_id: "",
      position: "",
      is_active: "",
    };
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
    return Object.values(newErrors).every((val) => val === "");
  };
  const { mutateAsync: createBanner } = useCreateBanner();
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

  const isCurrentlyOnline = useCheckOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      title: [],
      image: [],
      link_type: [],
      url: [],
      link_id: [],
      position: [],
      is_active: [],
      global: "",
      general: "",
    });

    if (!isCurrentlyOnline()) {
      toast.error(t("CreateBanner:banner.errors.no_internet"));
      return;
    }
    setIsSubmitting(true);
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

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
        setErrors((prev) => ({ ...prev, global: t("banner.errors.global") }));
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
          general: t("banner.errors.general"),
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
          ar: " إنشاء بانر جديد (سوبر أدمن)",
          en: "Create New Banner (Super Admin)",
        }}
        description={{
          ar: "صفحة إنشاء بانر إعلاني جديد بواسطة المشرف العام في تشطيبة. أدخل التفاصيل، نوع الرابط، الموضع، وقم بتحميل الصورة.",
          en: "Create a new advertising banner by Super Admin on Tashtiba. Enter details, link type, position, and upload image.",
        }}
        keywords={{
          ar: [
            "إنشاء بانر",
            "إضافة إعلان",
            "بانر جديد",
            "سوبر أدمن",
            "إدارة البانرات",
            "إعلانات الموقع",
            "تشطيبة",
          ],
          en: [
            "create banner",
            "add new ad",
            "new banner",
            "super admin",
            "banner management",
            "website ads",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("banner.title")}
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
            <Label htmlFor="title">{t("banner.name")}</Label>
            <Input
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              placeholder={t("banner.titlePlaceholder")}
            />
            {errors.title?.[0] && (
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
              value={bannerData.link_type}
              onChange={(value) =>
                setBannerData((prev) => ({
                  ...prev,
                  link_type: value as "category" | "external",
                }))
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
            {errors.link_type[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.link_type[0]}</p>
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
              {errors.url[0] && (
                <p className="text-red-500 text-sm mt-1">{errors.url[0]}</p>
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
                options={categories?.map((cat: Category) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))}
                value={bannerData.link_id}
                onChange={(value) =>
                  setBannerData((prev) => ({ ...prev, link_id: value }))
                }
                placeholder={t("banner.categoryPlaceholder")}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {errors.link_id[0] && (
                <p className="text-red-500 text-sm mt-1">{errors.link_id[0]}</p>
              )}
              {clientSideErrors.link_id && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.link_id}
                </p>
              )}
              {fetchingCategoriesError && (
                <p className="text-red-500 text-sm mt-1">
                  {fetchingCategoriesError}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="position">{t("banner.position")}</Label>
            <Select
              value={bannerData.position}
              onChange={(value) =>
                setBannerData((prev) => ({ ...prev, position: value }))
              }
              options={categories?.map((cat: Category) => ({
                value: cat.id,
                label: `Before ${cat.name}`,
              }))}
              placeholder={t("banner.positionPlaceholder")}
            />
            {errors.position[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.position[0]}</p>
            )}
            {clientSideErrors.position && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.position}
              </p>
            )}
            {fetchingCategoriesError && (
              <p className="text-red-500 text-sm mt-1">
                {fetchingCategoriesError}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="is_active">{t("banner.status")}</Label>
            <Select
              value={bannerData.is_active}
              onChange={(value) =>
                setBannerData((prev) => ({ ...prev, is_active: value }))
              }
              options={[
                { value: "1", label: t("banner.options.active") },
                { value: "0", label: t("banner.options.inactive") },
              ]}
              placeholder={t("banner.statusPlaceholder")}
            />
            {errors.is_active[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.is_active[0]}</p>
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
          {errors.image[0] && (
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? t("banner.submitting") : t("banner.submit")}
        </Button>
      </form>
    </div>
  );
};

export default CreateBanner;
