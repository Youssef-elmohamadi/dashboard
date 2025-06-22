import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import FileInput from "../../form/input/FileInput";
import TextArea from "../../form/input/TextArea";
import { FiDelete } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Select from "../../form/Select";
import { useCreateProduct } from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import PageMeta from "../../common/PageMeta";
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
type Attribute = { label: string; value: string };

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock_quantity: string;
  category_id: string;
  brand_id: string;
  status: string;
  is_featured: boolean;
};

export default function CreateProducts() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    name: [] as string[],
    price: [] as string[],
    description: [] as string[],
    category_id: [] as string[],
    brand_id: [] as string[],
    stock_quantity: [] as string[],
    status: [] as string[],
    is_featured: [] as string[],
    general: "" as string,
    global: "" as string,
  });
  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({});
  const { t } = useTranslation(["CreateProduct"]);
  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    status: "inactive",
    is_featured: false,
  });

  const navigate = useNavigate();
  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.original;
  const { data: allBrands } = useAllBrands();
  const brands = allBrands?.data;
  const addTag = () => {
    setTags([...tags, ""]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAttributeChange = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const removeAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productData.name) newErrors.name = t("validation.name");
    if (!productData.price) newErrors.price = t("validation.price");
    if (!productData.stock_quantity)
      newErrors.stock_quantity = t("validation.stock_quantity");
    if (!productData.category_id)
      newErrors.category_id = t("validation.category_id");
    if (!productData.brand_id) newErrors.brand_id = t("validation.brand_id");
    if (!productData.description)
      newErrors.description = t("validation.description");
    setClientSideErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const { mutateAsync } = useCreateProduct();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "is_featured") {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");
    images.forEach((image) => formData.append("images[]", image));
    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name]`, attr.label);
      formData.append(`attributes[${i}][value]`, attr.value);
    });
    tags
      .filter((tag) => tag.trim() !== "")
      .forEach((tag, i) => formData.append(`tags[${i}]`, tag));
    try {
      await mutateAsync(formData);
      navigate("/admin/products", {
        state: { successCreate: t("success_create") },
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

        setErrors((prev) => ({ ...prev, formattedErrors }));
      } else {
        setErrors({ ...errors, general: t("errors.general") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <PageMeta title={t("main_title")} description="Update Role" />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("title")}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">{t("form.name")}</Label>
            <Input
              name="name"
              value={productData.name}
              placeholder={t("placeholders.name")}
              onChange={handleChange}
              id="name"
            />
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">{t("form.price")}</Label>
            <Input
              type="text"
              name="price"
              placeholder={t("placeholders.price")}
              value={productData.price}
              onChange={handleChange}
              id="price"
            />
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="discount_price">{t("form.discount_price")}</Label>
            <Input
              type="text"
              name="discount_price"
              placeholder={t("placeholders.discount_price")}
              value={productData.discount_price}
              onChange={handleChange}
              id="discount_price"
            />
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="stock_quantity">{t("form.stock_quantity")}</Label>
            <Input
              type="text"
              name="stock_quantity"
              placeholder={t("placeholders.stock_quantity")}
              value={productData.stock_quantity}
              onChange={handleChange}
              id="stock_quantity"
            />
            {clientSideErrors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.stock_quantity}
              </p>
            )}
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity[0]}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category_id">{t("form.category")}</Label>
            <Select
              options={categories?.map((category: Category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={(value) => handleSelectChange(value, "category_id")}
              value={productData.category_id}
              placeholder={t("form.select_category")}
            />
            {clientSideErrors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.category_id}
              </p>
            )}
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category_id[0]}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">{t("form.brand")}</Label>
            <Select
              options={brands?.map((brand: Brand) => ({
                label: brand.name,
                value: String(brand.id),
              }))}
              onChange={(value) => handleSelectChange(value, "brand_id")}
              value={productData.brand_id}
              placeholder={t("form.select_brand")}
            />
            {clientSideErrors.brand_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.brand_id}
              </p>
            )}
            {errors.brand_id && (
              <p className="text-red-500 text-sm mt-1">{errors.brand_id[0]}</p>
            )}
          </div>
          {/* <div>
            <Label htmlFor="status">{t("form.status")}</Label>
            <Select
              options={[
                { value: "active", label: t("form.status_active") },
                { value: "inactive", label: t("form.status_inactive") },
              ]}
              onChange={(value) => handleSelectChange(value, "status")}
              value={productData.status}
              placeholder={t("form.select_status")}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
            )}
          </div> */}
          <div className="flex gap-2 items-center">
            <Label htmlFor="is_featured">{t("form.is_featured")}</Label>
            <Checkbox
              checked={productData.is_featured}
              onChange={(checked) =>
                setProductData((prev) => ({ ...prev, is_featured: checked }))
              }
              id="is_featured"
            />
            {errors.is_featured && (
              <p className="text-red-500 text-sm mt-1">{errors.brand_id[0]}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="">{t("form.upload_images")}</Label>
          <FileInput multiple={true} onChange={handleImageChange} />
          <div className="flex gap-4 mt-2 flex-wrap">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-40 w-40 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-bl"
                >
                  <FiDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description">{t("form.description")}</Label>
          <TextArea
            name="description"
            placeholder={t("placeholders.description")}
            value={productData.description}
            onChange={(value) =>
              setProductData((prev) => ({ ...prev, description: value }))
            }
          />
          {clientSideErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.description}
            </p>
          )}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
          )}
        </div>

        <div>
          <Label>{t("form.attributes")}</Label>
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <Input
                placeholder={t("placeholders.attribute_label")}
                value={attr.label}
                onChange={(e) =>
                  handleAttributeChange(index, "label", e.target.value)
                }
              />
              <Input
                placeholder={t("placeholders.attribute_value")}
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="text-red-600 text-xl"
              >
                <FiDelete className="text-red-600 text-xl" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setAttributes([...attributes, { label: "", value: "" }])
            }
            className="text-blue-500 mt-1"
          >
            {t("form.add_attribute")}
          </button>
        </div>

        <div>
          {tags.length > 0 && (
            <div>
              <Label>{t("form.tags")}</Label>
              {tags.map((tag, index) => (
                <div key={index} className="mb-2 flex gap-2 items-center">
                  <Input
                    placeholder={t("placeholders.tag")}
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-600 text-xl"
                  >
                    <FiDelete className="text-red-600 text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={addTag} className="text-blue-500 mt-1">
            {t("form.add_tag")}
          </button>
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
          className="rounded-lg bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 w-1/4 mx-auto"
        >
          {loading ? t("form.creating_button") : t("form.create_button")}
        </button>
      </form>
    </div>
  );
}
