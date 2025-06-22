import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import FileInput from "../../../components/form/input/FileInput";
import { FiDelete } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Select from "../../form/Select";
import TextArea from "../../form/input/TextArea";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import {
  useGetProductById,
  useUpdateProduct,
} from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import PageMeta from "../../common/PageMeta";
import { AxiosError } from "axios";
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
import { Attribute, Product } from "../../../types/Product";

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
    created_at: "",
    updated_at: "",
    attributes: [],
    images: [],
    tags: [],
  });
  //const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | string>>({
    name: [],
    description: [],
    price: [],
    stock_quantity: [],
    category_id: [],
    brand_id: [],
    status: [],
    is_featured: [],
    images: [],
    attributes: [],
    tags: [],
    global: "",
    general: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    status: "",
    images: "",
    is_featured: "",
  });

  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.original;
  const { data: allBrands } = useAllBrands();
  const brands = allBrands?.data;

  const { data, isLoading, isError, error } = useGetProductById(id);
  const product = data?.data?.data;
  useEffect(() => {
    if (!product) return;
    setProductData(product);
    setProductData(product);
    setExistingImages(product.images ?? []);
    setAttributes(
      product.attributes?.map((attr: any) => ({
        attribute_name: attr.attribute_name,
        attribute_value: attr.attribute_value,
      }))
    );
    setTags(
      product.tags.map((tag: any) => (typeof tag === "string" ? tag : tag.name))
    );
  }, [product]);
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

  const handleAttributeChange = (
    index: number,
    field: "attribute_name" | "attribute_value",
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
    setAttributes([
      ...attributes,
      {
        attribute_name: "",
        attribute_value: "",
      },
    ]);
  const addTag = () => setTags([...tags, ""]);
  const validate = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      category_id: "",
      brand_id: "",
      status: "",
      images: "",
      is_featured: "",
    };
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
    return Object.values(newErrors).every((err) => err === "");
  };
  const { mutateAsync } = useUpdateProduct(id);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }
    setErrors({
      name: [],
      description: [],
      price: [],
      stock_quantity: [],
      category_id: [],
      brand_id: [],
      status: [],
      is_featured: [],
      images: [],
      attributes: [],
      tags: [],
      global: "",
      general: "",
    });

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
      formData.append(`attributes[${i}][name]`, attr.attribute_name);
      formData.append(`attributes[${i}][value]`, attr.attribute_value);
    });
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    try {
      await mutateAsync({ id: +id!, productData: formData });
      navigate("/admin/products", {
        state: { successUpdate: t("success_update") },
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

        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors({ ...errors, general: t("errors.general") });
      }
    } finally {
      setLoading(false);
    }
  };

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

  if (!id) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!product && !globalError) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("errors.general")}
        </div>
      </>
    );
  }

  return (
    <div className="">
      <PageMeta title={t("main_title")} description="Update Product" />
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
            <Select
              options={categories?.map((category: Category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={(value) => handleSelectChange(value, "category_id")}
              value={productData?.category_id}
              placeholder={t("form.select_category")}
            />
            {errors.category_id[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category_id[0]}
              </p>
            )}
            {clientSideErrors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.category_id}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">{t("form.brand")}</Label>
            <Select
              options={brands?.map((brand: Brand) => ({
                value: String(brand.id),
                label: brand.name,
              }))}
              onChange={(value) => handleSelectChange(value, "brand_id")}
              value={productData.brand_id}
              placeholder={t("form.select_brand")}
            />
            {errors.brand_id && (
              <p className="text-red-500 text-sm mt-1">{errors.brand_id}</p>
            )}
            {clientSideErrors.brand_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.brand_id}
              </p>
            )}
          </div>
          <div>
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
            {errors.status[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <Label htmlFor="is_featured">{t("form.is_featured")}</Label>
            <Checkbox
              checked={productData.is_featured}
              onChange={(checked) =>
                setProductData((prev) => ({ ...prev, is_featured: checked }))
              }
              id="is_featured"
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
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            {clientSideErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.description}
              </p>
            )}
          </div>
        </div>

        {/* Upload New Images */}
        <div>
          <Label>{t("form.upload_images")}</Label>
          <FileInput multiple onChange={handleImageChange} />
          {errors.images[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.images[0]}</p>
          )}
          {clientSideErrors?.images && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors?.images}
            </p>
          )}

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
                value={attr.attribute_name}
                onChange={(e) =>
                  handleAttributeChange(i, "attribute_name", e.target.value)
                }
              />
              <Input
                placeholder={t("placeholders.attribute_value")}
                value={attr.attribute_value}
                onChange={(e) =>
                  handleAttributeChange(i, "attribute_value", e.target.value)
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
          {errors.attributes[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.attributes[0]}</p>
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
          {errors.tags[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.tags[0]}</p>
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
