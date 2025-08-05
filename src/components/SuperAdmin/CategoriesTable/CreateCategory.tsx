import { useEffect, useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import CategoryImageUpload from "./CategoryImageUpload";
import { useTranslation } from "react-i18next";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useCreateCategory } from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import TextArea from "../../common/input/TextArea";
import {
  Category,
  CategoryInputData,
  ClientErrors,
  ServerErrors,
} from "../../../types/Categories";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";

export default function CreateCategory() {
  const { t } = useTranslation(["CreateCategory", "Meta"]);
  const [categoryData, setCategoryData] = useState<CategoryInputData>({
    name: "",
    description: "",
    commission_rate: "",
    parent_id: "",
    image: null as File | null,
    status: "active",
    appears_in_website: false,
  });

  const [errorFetchingCategories, setErrorFetchingCategories] = useState("");

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
  const [clientErrors, setClientErrors] = useState<ClientErrors>({
    name: "",
    description: "",
    commission_rate: "",
    parent_id: "",
    image: "",
    status: "",
    appears_in_website: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    data,
    isError: isCategoriesError,
    error: categoriesError,
  } = useAllCategories();
  const categories = data?.original || [];
  console.log(data);

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
  };

  const handleSelectChange = (value: string) => {
    setCategoryData((prev) => ({ ...prev, parent_id: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!categoryData.name) newErrors.name = t("category.errors.name");
    if (!categoryData.description)
      newErrors.description = t("category.errors.description");
    if (!categoryData.image) newErrors.image = t("category.errors.image");
    if (!categoryData.commission_rate) {
      newErrors.commission_rate = t("category.errors.commissionRequired");
    } else if (+categoryData.commission_rate > 100) {
      newErrors.commission_rate = t("category.errors.commissionMax");
    }
    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutateAsync: createCategory } = useCreateCategory();
  const isCurrentlyOnline = useCheckOnline();
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
    if (!isCurrentlyOnline()) {
      toast.error(t("category.errors.no_internet"));
      return;
    }
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
      await createCategory(formData);
      navigate("/super_admin/categories", {
        state: { successCreate: t("category.success") },
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

  return (
    <div>
      <SEO
        title={{
          ar: "تشطيبة - إنشاء فئة جديدة (سوبر أدمن)",
          en: "Tashtiba - Create New Category (Super Admin)",
        }}
        description={{
          ar: "صفحة إنشاء فئة منتجات جديدة بواسطة المشرف العام في تشطيبة. أدخل تفاصيل الفئة واللجنة، وقم بتحميل الصورة.",
          en: "Create a new product category by Super Admin on Tashtiba. Enter category details, commission, and upload image.",
        }}
        keywords={{
          ar: [
            "إنشاء فئة",
            "إضافة تصنيف",
            "فئة جديدة",
            "سوبر أدمن",
            "إدارة الفئات",
            "عمولة الفئة",
            "تشطيبة",
          ],
          en: [
            "create category",
            "add new category",
            "new category",
            "super admin",
            "category management",
            "category commission",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
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
          <p className="text-red-500 text-sm mt-4">{errors.global}</p>
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
              placeholder={t("category.namePlaceholder")}
              onChange={handleChange}
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
              placeholder={t("category.commissionPlaceholder")}
              onChange={handleChange}
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
              placeholder={t("category.descPlaceholder")}
              value={categoryData.description}
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
          <div>
            <Label>{t("category.parent")}</Label>
            <Select
              options={categories?.map((cat: Category) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              value={categoryData.parent_id!!}
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
          <CategoryImageUpload
            file={categoryData.image as File | null}
            onFileChange={handleImageChange}
          />
          {clientErrors.image && (
            <p className="text-red-500 text-sm mt-1">{clientErrors.image}</p>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 flex gap-4 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiPlus size={20} />
          {loading ? t("category.submitting") : t("category.submit")}
        </button>
      </form>
    </div>
  );
}
