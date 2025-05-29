import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { updateCategory } from "../../../api/SuperAdminApi/Categories/_requests";
import CategoryImageUpload from "./CategoryImageUpload";
import {
  useGetCategoryById,
  useUpdateCategory,
} from "../../../hooks/useSuperAdminCategpries";
import { useAllCategories } from "../../../hooks/useCategories";

export default function UpdateCategory() {
  const { t } = useTranslation(["UpdateCategory"]);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    commission_rate: "",
    parent_id: "",
    image: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  //const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: allCategory } = useAllCategories();
  const categories = allCategory?.data.data.original;

  const { data, isError, error } = useGetCategoryById(id);

  const Category = data?.data.data.original;

  useEffect(() => {
    if (!Category) return;
    setCategoryData({
      name: Category.name || "",
      description: Category.description || "",
      commission_rate: Category.commission_rate || "",
      parent_id: Category.parent_id ? Category.parent_id.toString() : "",
      image: null,
    });
    setPreviewImage(Category.image);
  }, [Category]);
  if (isError) {
    const status = error?.response?.status;
    if (status === 403 || status === 401) {
      setErrors({
        ...errors,
        global: t("category.errors.global"),
      });
    }
  }
  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       const [categoryRes, allCategoriesRes] = await Promise.all([
  //         getCategoryById(id),
  //         getAllCategories(),
  //       ]);

  //       const data = categoryRes.data.data.original;
  //       setCategoryData({
  //         name: data.name || "",
  //         description: data.description || "",
  //         commission_rate: data.commission_rate || "",
  //         parent_id: data.parent_id ? data.parent_id.toString() : "",
  //         image: null,
  //       });

  //       setPreviewImage(data.image);
  //       //setCategories(allCategoriesRes.data.data.original);
  //     } catch (err) {
  //       console.error("Error fetching category data", err);
  //     }
  //   };

  //   fetchInitialData();
  // }, [id]);

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
  const { mutateAsync } = useUpdateCategory(id);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("commission_rate", categoryData.commission_rate);
    if (categoryData.parent_id)
      formData.append("parent_id", categoryData.parent_id);
    if (categoryData.image) formData.append("image", categoryData.image);
    try {
      setLoading(true);
      await updateCategory(formData, id);
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
        setErrors(formattedErrors);
      } else {
        setErrors({ general: [t("category.errors.general")] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("category.title")}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex flex-col items-center"
      >
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
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
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
              value={categoryData.commission_rate}
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
            <textarea
              name="description"
              value={categoryData.description}
              placeholder={t("category.descPlaceholder")}
              onChange={handleChange}
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
              options={categories?.map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              value={categoryData.parent_id}
              onChange={handleSelectChange}
              placeholder={t("category.selectParent")}
            />
            {errors.parent_id && (
              <p className="text-red-500 text-sm mt-1">{errors.parent_id[0]}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <Label>{t("category.image")}</Label>
          <div className="flex items-start gap-6">
            <div className="w-40 h-40 rounded border border-gray-200 overflow-hidden">
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
                file={categoryData.image}
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
