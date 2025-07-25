import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import CategoryImageUpload from "./CategoryImageUpload";
import {
  useGetCategoryById,
  useUpdateCategory,
} from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import TextArea from "../../common/input/TextArea";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";
import {
  Category,
  CategoryInputData,
  ClientErrors,
  ServerErrors,
} from "../../../types/Categories";
export default function UpdateCategory() {
  const { t } = useTranslation(["UpdateCategory", "Meta"]);
  const [categoryData, setCategoryData] = useState<CategoryInputData>({
    name: "",
    description: "",
    commission_rate: "",
    parent_id: "",
    image: null as File | null,
    status: "active", // or a default value like "active" if required
    appears_in_website: false, // or a default value as needed
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({
    name: "",
    description: "",
    commission_rate: "",
    parent_id: "",
    image: "",
    status: "",
    appears_in_website: "",
  });
  const [errors, setErrors] = useState<ServerErrors>({
    name: [],
    description: [],
    commission_rate: [],
    parent_id: [],
    image: [],
    status: [],
    appears_in_website: [],
    global: "",
    general: "",
  });
  const [errorFetchingCategories, setErrorFetchingCategories] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: categoriesData,
    isError: isCategoriesError,
    error: categoriesError,
  } = useAllCategories();
  const categories = categoriesData?.original;
  useEffect(() => {
    if (isCategoriesError && categoriesError instanceof AxiosError) {
      const status = categoriesError?.response?.status;
      if (status === 401 || status === 403) {
        setErrorFetchingCategories(t("category.errors.global"));
      } else {
        setErrorFetchingCategories(t("category.errors.fetching_categories"));
      }
    }
  }, [isCategoriesError, categoriesError, t]);

  const { data, isError, error, isLoading } = useGetCategoryById(id);

  const Category = data;

  useEffect(() => {
    if (!Category) return;
    setCategoryData({
      name: Category.name || "",
      description: Category.description || "",
      commission_rate: Category.commission_rate?.toString() || "",
      parent_id: Category.parent_id ? Category.parent_id.toString() : "",
      image: null,
      status: Category.status || "active",
      appears_in_website: Category.appears_in_website ?? false,
    });
    setPreviewImage(Category.image);
  }, [Category]);
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("category.errors.global"),
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("category.errors.general"),
        }));
      }
    }
  }, [isError, error, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setCategoryData((prev) => ({
      ...prev,
      image: file,
    }));
    if (file) setPreviewImage(null);
  };

  const handleSelectChange = (value: string) => {
    setCategoryData((prev) => ({ ...prev, parent_id: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!categoryData.name) newErrors.name = t("category.errors.name");
    if (!categoryData.description)
      newErrors.description = t("category.errors.description");
    if (!categoryData.commission_rate) {
      newErrors.commission_rate = t("category.errors.commissionRequired");
    } else if (+categoryData.commission_rate > 100) {
      newErrors.commission_rate = t("category.errors.commissionMax");
    }
    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const { mutateAsync } = useUpdateCategory(id!!);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      name: [],
      description: [],
      commission_rate: [],
      parent_id: [],
      image: [],
      status: [],
      appears_in_website: [],
      global: "",
      general: "",
    });
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("commission_rate", categoryData.commission_rate ?? "");
    if (categoryData.parent_id)
      formData.append("parent_id", categoryData.parent_id);
    if (categoryData.image) formData.append("image", categoryData.image);
    try {
      setLoading(true);
      await mutateAsync({ id: id!!, categoryData: formData });
      navigate("/super_admin/categories", {
        state: { successUpdate: t("category.success") },
      });
    } catch (error: any) {
      console.error("Error creating category:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("category.errors.global"),
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
        setErrors((prev) => ({
          ...prev,
          general: t("category.errors.general"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تحديث فئة - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Update Category - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل بيانات الفئة للتحديث بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading category data for update by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تحديث فئة",
              "تحميل فئة",
              "إدارة الفئات",
              "سوبر أدمن",
              "تصنيفات المنتجات",
            ],
            en: [
              "update category",
              "loading category",
              "category management",
              "super admin",
              "product classifications",
            ],
          }}
        />
        <p className="text-center mt-5">
          {t("category.loading") || "Loading..."}
        </p>
      </>
    );

  if (!data && !errors.general) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تحديث فئة - غير موجودة (سوبر أدمن)",
            en: "Tashtiba - Update Category - Not Found (Super Admin)",
          }}
          description={{
            ar: "الفئة المطلوبة للتحديث غير موجودة في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested category for update was not found on Tashtiba. Please verify the ID.",
          }}
          keywords={{
            ar: [
              "فئة غير موجودة",
              "تحديث فئة",
              "خطأ 404",
              "سوبر أدمن",
              "إدارة الفئات",
            ],
            en: [
              "category not found",
              "update category",
              "404 error",
              "super admin",
              "category management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (errors.global) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for global error state
          title={{
            ar: "تشطيبة - خطأ عام - تحديث فئة (سوبر أدمن)",
            en: "Tashtiba - Global Error - Update Category (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحديث الفئة بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred during category update by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة تقنية",
              "تحديث فئة",
              "سوبر أدمن",
              "فشل التحديث",
            ],
            en: [
              "global error",
              "technical issue",
              "update category",
              "super admin",
              "update failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {errors.global}
        </div>
      </>
    );
  }
  if (errors.general) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for general error state
          title={{
            ar: "تشطيبة - خطأ في تحديث الفئة (سوبر أدمن)",
            en: "Tashtiba - Category Update Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ أثناء محاولة تحديث بيانات الفئة بواسطة المشرف العام في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "An error occurred while attempting to update category data by Super Admin on Tashtiba. Please try again.",
          }}
          keywords={{
            ar: [
              "خطأ تحديث فئة",
              "مشكلة فئة",
              "تحديث تشطيبة",
              "سوبر أدمن",
              "فشل التعديل",
            ],
            en: [
              "category update error",
              "category issue",
              "Tashtiba update",
              "super admin",
              "update failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {errors.general}
        </div>
      </>
    );
  }

  return (
    <div>
      <SEO
        title={{
          ar: `تشطيبة - تحديث فئة ${Category?.name || ""}`,
          en: `Tashtiba - Update Category ${Category?.name || ""}`,
        }}
        description={{
          ar: `صفحة تحديث الفئة "${
            Category?.name || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة. عدّل تفاصيل الفئة والعمولة والصورة.`,
          en: `Update category "${
            Category?.name || "unknown"
          }" by Super Admin on Tashtiba. Modify category details, commission, and image.`,
        }}
        keywords={{
          ar: [
            `تحديث فئة ${Category?.name || ""}`,
            "تعديل تصنيف",
            "إدارة الفئات",
            "سوبر أدمن",
            "عمولة الفئة",
            "تشطيبة",
          ],
          en: [
            `update category ${Category?.name || ""}`,
            "edit category",
            "category management",
            "super admin",
            "category commission",
            "Tashtiba",
          ],
        }}
      />

      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("category.title")}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex flex-col items-center"
      >
        {errors.global && (
          <p className="text-error-500 text-sm mt-1">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          <div>
            <Label>{t("category.name")}</Label>
            <Input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              placeholder={t("category.namePlaceholder")}
            />
            {errors.name[0] && (
              <p className="text-red-500 text-sm mt-1">
                {t("category.errors.nameTaken")}
              </p>
            )}
            {clientErrors.name && (
              <p className="text-red-500 text-sm mt-1">{clientErrors.name}</p>
            )}
          </div>
          <div>
            <Label>{t("category.commission")}</Label>
            <Input
              type="number"
              name="commission_rate"
              value={categoryData?.commission_rate!!}
              onChange={handleChange}
              placeholder={t("category.commissionPlaceholder")}
            />
            {errors.commission_rate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.commission_rate[0]}
              </p>
            )}
            {clientErrors.commission_rate && (
              <p className="text-red-500 text-sm mt-1">
                {clientErrors.commission_rate}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          <div className="w-full">
            <Label>{t("category.description")}</Label>
            <TextArea
              name="description"
              value={categoryData.description}
              placeholder={t("category.descPlaceholder")}
              onChange={(value) =>
                setCategoryData((prev) => ({ ...prev, description: value }))
              }
              className="w-full mt-2 p-2 border border-gray-200 outline-0 rounded dark:bg-dark-900 dark:text-gray-400"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description[0]}
              </p>
            )}
            {clientErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {clientErrors.description}
              </p>
            )}
          </div>
          <div className="w-full">
            <Label>{t("category.parent")}</Label>
            <Select
              options={categories?.map((cat: Category) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              value={categoryData?.parent_id!!}
              onChange={handleSelectChange}
              placeholder={t("category.selectParent")}
            />
            {clientErrors.parent_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientErrors.parent_id}
              </p>
            )}
            {errors.parent_id && (
              <p className="text-red-500 text-sm mt-1">{errors.parent_id[0]}</p>
            )}
            {errorFetchingCategories && (
              <p className="text-red-500 text-sm mt-1">
                {errorFetchingCategories}
              </p>
            )}
          </div>
        </div>

        <div className="w-full">
          <Label>{t("category.image")}</Label>
          <div className="flex items-start gap-6">
            <div className="w-40 h-40 rounded border border-gray-200 dark:border-gray-800 overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <CategoryImageUpload
                file={categoryData.image as File}
                onFileChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 flex gap-4 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          <FiEdit size={20} />
          {loading ? t("category.submitting") : t("category.submit")}
        </button>
      </form>
    </div>
  );
}
