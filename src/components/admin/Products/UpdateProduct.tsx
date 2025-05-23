import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import FileInput from "../../../components/form/input/FileInput";
import { getAllCategories } from "../../../api/AdminApi/categoryApi/_requests";
import {
  showProduct,
  updateProduct,
} from "../../../api/AdminApi/products/_requests";
import { getAllBrands } from "../../../api/AdminApi/brandsApi/_requests";
import { FiDelete } from "react-icons/fi";
import { useTranslation } from "react-i18next";
type Category = {
  id: number;
  name: string;
  description: string | number | null;
  image?: [] | null;
};

type Brand = {
  id: number;
  name: string;
  status: string;
  images: string;
};

type Attribute = {
  label: string;
  value: string;
};

type Product = {
  id?: number;
  vendor_id?: number;
  name?: string;
  description?: string | number | undefined;
  category_id?: number | string;
  brand_id?: number | string;
  price?: number | string;
  discount_price?: number | null;
  stock_quantity?: number | string;
  status?: string;
  is_featured: boolean;
  rating?: number | null;
  views_count?: number | null;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  brand?: Brand;
  attributes?: any[];
  images?: string[];
  tags?: string[];
  variants?: any[];
};
const UpdateProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateProduct"]);
  const [productData, setProductData] = useState<Product>({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    status: "",
    is_featured: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [clientSideErrors, setClientSideErrors] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    status: "",
    is_featured: false,
  });
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          showProduct(Number(id)),
          getAllCategories(),
          getAllBrands(),
        ]);

        const product = productRes.data.data;

        setTags(
          product.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name
          )
        );

        setProductData(product);
        setExistingImages(product.images ?? []);
        setAttributes(
          product.attributes?.map((attr: any) => ({
            label: attr.attribute_name,
            value: attr.attribute_value,
          }))
        );
        setCategories(categoryRes.data.data.original);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
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

  const addAttribute = () =>
    setAttributes([...attributes, { label: "", value: "" }]);
  const addTag = () => setTags([...tags, ""]);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }
    setErrors({});

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (
        key !== "is_featured" &&
        key !== "slug" &&
        key !== "images" &&
        value !== null &&
        value !== undefined &&
        key !== "tags"
      ) {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");
    if (images.length > 0) {
      images.forEach((image) => formData.append("images[]", image));
    }
    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name]`, attr.label);
      formData.append(`attributes[${i}][value]`, attr.value);
    });
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    try {
      await updateProduct(formData, productData.id);
      navigate("/admin/products", {
        state: { successCreate: t("success_update") },
      });
    } catch (error: any) {
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

        setErrors(formattedErrors);
      } else {
        setErrors({ general: [t("errors.general")] });
      }
    }finally {
      setLoading(false);
    }
  };

  if (!productData) return <div className="p-6">{t("loading")}</div>;

  return (
    <div className="">
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("title")}
        </h3>
      </div>

      {errors.global && (
        <div className="text-red-600 mb-4">{errors.global}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">{t("form.name")}</Label>
            <Input
              name="name"
              placeholder={t("placeholders.name")}
              value={productData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="price">{t("form.price")}</Label>
            <Input
              name="price"
              placeholder={t("placeholders.price")}
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="stock_quantity">{t("form.stock_quantity")}</Label>
            <Input
              name="stock_quantity"
              placeholder={t("placeholders.stock_quantity")}
              value={productData.stock_quantity}
              onChange={handleChange}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity}
              </p>
            )}
            {clientSideErrors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.stock_quantity}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category_id">{t("form.category")}</Label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">{t("form.select_category")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
            {clientSideErrors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.category_id}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">{t("form.brand")}</Label>
            <select
              name="brand_id"
              value={productData.brand_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">{t("form.select_brand")}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
            {clientSideErrors.brand_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.brand_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">{t("form.description")}</Label>
            <Input
              name="description"
              value={productData.description}
              onChange={handleChange}
              placeholder={t("placeholders.description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            {clientSideErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.description}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="status">{t("form.status")}</Label>
            <select
              name="status"
              value={productData.status}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="active">{t("form.status_active")}</option>
              <option value="inactive">{t("form.status_inactive")}</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <Label htmlFor="is_featured">{t("form.is_featured")}</Label>
            <Checkbox
              checked={productData.is_featured === "1" ? true : false}
              onChange={(checked) =>
                setProductData((prev) => ({ ...prev, is_featured: checked }))
              }
            />
            {errors.is_featured && (
              <p className="text-red-500 text-sm mt-1">{errors.is_featured}</p>
            )}
            {clientSideErrors.is_featured && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.is_featured}
              </p>
            )}
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <Label>{t("form.existing_images")}</Label>
            <div className="flex gap-3 mt-3 flex-wrap">
              {existingImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Existing ${i}`}
                  className="w-32 h-32 text-gray-700 dark:text-gray-400 object-cover rounded border dark:border-gray-700"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div>
          <Label>{t("form.upload_images")}</Label>
          <FileInput multiple onChange={handleImageChange} />
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
          {clientSideErrors?.images && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors?.imagess}
            </p>
          )}

          <div className="flex gap-3 mt-3 flex-wrap">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-32 h-32 text-gray-700 dark:text-gray-400 object-cover rounded border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPreviews = [...imagePreviews];
                    const newFiles = [...images];
                    newPreviews.splice(i, 1);
                    newFiles.splice(i, 1);
                    setImagePreviews(newPreviews);
                    setImages(newFiles);
                  }}
                  className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div>
          <Label>{t("form.attributes")}</Label>
          {attributes.map((attr, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <Input
                placeholder={t("placeholders.attribute_label")}
                value={attr.label}
                onChange={(e) =>
                  handleAttributeChange(i, "label", e.target.value)
                }
              />
              <Input
                placeholder={t("placeholders.attribute_value")}
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(i, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeAttribute(i)}
                className="text-red-600 text-xl"
              >
                <FiDelete className="text-red-600 text-xl" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            className="text-blue-500 mt-1"
          >
            {t("form.add_attribute")}
          </button>
          {errors.attributes && (
            <p className="text-red-500 text-sm mt-1">{errors.attributes}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label>{t("form.tags")}</Label>
          {tags.map((tag, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <Input
                value={tag}
                onChange={(e) => handleTagChange(i, e.target.value)}
                placeholder={t("placeholders.tag")}
              />
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-red-600 text-xl"
              >
                <FiDelete className="text-red-600 text-xl" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="text-blue-600 hover:underline mt-2"
          >
            {t("form.add_tag")}
          </button>
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
          )}
        </div>

        <div className="text-center">
          {errors.global && (
            <div className="text-red-600 mb-4">{errors.global}</div>
          )}
          {errors.general && (
            <p className="text-red-500 text-sm mt-1">{errors.general}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            {loading ? t("form.updating_button") : t("form.update_button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;
