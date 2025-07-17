import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import FileInput from "../../common/input/FileInput";
import { FiDelete } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Select from "../../common/form/Select";
import TextArea from "../../common/input/TextArea";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import {
  useGetProductById,
  useUpdateProduct,
} from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO
import { AxiosError } from "axios";
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
import { Attribute, image, Product, ServerError } from "../../../types/Product";

const UpdateProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateProduct", "Meta"]); // استخدام الـ namespaces هنا
  const [productData, setProductData] = useState<Product>({
    id: 0,
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
    review: [],
  });
  //const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<image[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<boolean>(false);
  const [errors, setErrors] = useState<ServerError>({
    name: [],
    description: [],
    price: [],
    discount_price: [],
    stock_quantity: [],
    category_id: [],
    brand_id: [],
    status: [],
    is_featured: [],
    images: [],
    attributes: [],
    tags: [],
    general: "",
    global: "",
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
  const { data, isLoading, isError, error } = useGetProductById(id);
  const product = data;
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
  const [fetchingCategoriesError, setFetchingCategoriesError] =
    useState<string>("");
  const [fetchingBrandsError, setFetchingBrandsError] = useState<string>("");

  const {
    data: allCategories,
    error: categoryError,
    isError: isCategoryError,
  } = useAllCategories();
  useEffect(() => {
    if (isCategoryError && categoryError instanceof AxiosError) {
      const status = categoryError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateProduct:errors.global"), // إضافة namespace
        }));
      } else {
        setFetchingCategoriesError(
          t("UpdateProduct:errors.fetching_categories")
        ); // إضافة namespace
      }
    }
  }, [isCategoryError, categoryError, t]);
  const categories = allCategories?.original;
  const {
    data: allBrands,
    error: brandError,
    isError: isBrandError,
  } = useAllBrands();
  const brands = allBrands?.data;
  useEffect(() => {
    if (isBrandError && brandError instanceof AxiosError) {
      const status = brandError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateProduct:errors.global"), // إضافة namespace
        }));
      } else {
        setFetchingBrandsError(t("UpdateProduct:errors.fetching_brands")); // إضافة namespace
      }
    }
  }, [isBrandError, brandError, t]);
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
    if (!productData.name) newErrors.name = t("UpdateProduct:validation.name"); // إضافة namespace
    if (!productData.price)
      newErrors.price = t("UpdateProduct:validation.price"); // إضافة namespace
    if (!productData.stock_quantity)
      newErrors.stock_quantity = t("UpdateProduct:validation.stock_quantity"); // إضافة namespace
    if (!productData.category_id)
      newErrors.category_id = t("UpdateProduct:validation.category_id"); // إضافة namespace
    if (!productData.brand_id)
      newErrors.brand_id = t("UpdateProduct:validation.brand_id"); // إضافة namespace
    if (!productData.description)
      newErrors.description = t("UpdateProduct:validation.description"); // إضافة namespace
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
      discount_price: [],
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
    formData.append("_method", "PUT"); // Required for Laravel PUT with FormData

    try {
      await mutateAsync({ id: +id!, productData: formData });
      navigate("/admin/products", {
        state: { successUpdate: t("UpdateProduct:success_update") }, // إضافة namespace
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("UpdateProduct:errors.global"), // إضافة namespace
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
        setErrors({ ...errors, general: t("UpdateProduct:errors.general") }); // إضافة namespace
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
        setErrors({
          ...errors,
          general: t("UpdateProduct:errors.general"), // إضافة namespace
        });
      }
    }
  }, [isError, error, t]);

  if (!id) {
    return (
      <>
        {/* PageMeta replaced with SEO, and data directly set for missing ID */}
        <SEO
          title={{
            ar: "تشطيبة - تحديث منتج - معرف غير موجود",
            en: "Tashtiba - Update Product - ID Missing",
          }}
          description={{
            ar: "صفحة تحديث المنتج تتطلب معرف منتج صالح. يرجى التأكد من توفير المعرف.",
            en: "The product update page requires a valid product ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تحديث منتج",
              "خطأ معرف",
              "منتج غير صالح",
              "تشطيبة",
              "إدارة المنتجات",
            ],
            en: [
              "update product",
              "ID error",
              "invalid product",
              "Tashtiba",
              "product management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateProduct:no_data")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {/* PageMeta replaced with SEO, and data directly set for loading state */}
        <SEO
          title={{
            ar: "تشطيبة - تحديث منتج",
            en: "Tashtiba - Update Product",
          }}
          description={{
            ar: "جارٍ تحميل بيانات المنتج للتحديث في تشطيبة. يرجى الانتظار.",
            en: "Loading product data for update in Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تحديث منتج",
              "تحميل بيانات",
              "إدارة المنتجات",
              "تشطيبة",
              "التحميل",
            ],
            en: [
              "update product",
              "loading data",
              "product management",
              "Tashtiba",
              "loading",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateProduct:loading")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (errors.general) {
    return (
      <>
        {/* PageMeta replaced with SEO, and data directly set for general error */}
        <SEO
          title={{
            ar: "تشطيبة - خطأ في تحديث المنتج",
            en: "Tashtiba - Product Update Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء محاولة تحديث بيانات المنتج في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "A general error occurred while attempting to update product data in Tashtiba. Please try again.",
          }}
          keywords={{
            ar: ["خطأ تحديث منتج", "مشكلة منتج", "تحديث تشطيبة", "فشل التعديل"],
            en: [
              "product update error",
              "product issue",
              "Tashtiba update",
              "update failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateProduct:errors.general")} {/* إضافة namespace */}
        </div>
      </>
    );
  }
  if (!product && !globalError && !errors.general) {
    return (
      <>
        {/* PageMeta replaced with SEO, and data directly set for product not found */}
        <SEO
          title={{
            ar: "تشطيبة - منتج غير موجود",
            en: "Tashtiba - Product Not Found",
          }}
          description={{
            ar: "المنتج المطلوب لتحديث بياناته غير موجود في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested product for update was not found in Tashtiba system. Please check the ID.",
          }}
          keywords={{
            ar: [
              "منتج غير موجود",
              "خطأ",
              "تحديث منتج",
              "تشطيبة",
              "إدارة المنتجات",
            ],
            en: [
              "product not found",
              "error",
              "update product",
              "Tashtiba",
              "product management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateProduct:not_found")} {/* إضافة namespace */}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        {/* PageMeta replaced with SEO, and data directly set for global error */}
        <SEO
          title={{
            ar: "تشطيبة - خطأ عام",
            en: "Tashtiba - Global Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء معالجة طلبك في تشطيبة. يرجى المحاولة مرة أخرى لاحقًا.",
            en: "A global error occurred while processing your request in Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة في النظام",
              "تشطيبة",
              "خطأ الخادم",
              "فشل عام",
            ],
            en: [
              "global error",
              "system issue",
              "Tashtiba",
              "server error",
              "general failure",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateProduct:errors.global")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  return (
    <div className="">
      {/* PageMeta replaced with SEO, and data directly set for main content */}
      <SEO
        title={{
          ar: "تشطيبة - تحديث المنتج",
          en: "Tashtiba - Update Product",
        }}
        description={{
          ar: "صفحة تحديث المنتج في متجر تشطيبة. عدّل تفاصيل المنتج، الصور، والسمات.",
          en: "Update a product in Tashtiba store. Modify product details, images, and attributes.",
        }}
        keywords={{
          ar: [
            "تحديث منتج",
            "تعديل منتج",
            "إدارة المنتجات",
            "تشطيبة",
            "المخزون",
            "متجر إلكتروني",
          ],
          en: [
            "update product",
            "edit product",
            "product management",
            "Tashtiba",
            "inventory",
            "e-commerce store",
          ],
        }}
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateProduct:title")} {/* إضافة namespace */}
        </h3>
      </div>

      {errors.global && (
        <div className="text-red-600 mb-4">{errors.global}</div>
      )}
      {errors.general && (
        <div className="text-red-600 mb-4">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">{t("UpdateProduct:form.name")}</Label>
            <Input
              name="name"
              placeholder={t("UpdateProduct:placeholders.name")}
              value={productData.name}
              onChange={handleChange}
            />
            {errors.name &&
              errors.name[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
              )}
            {clientSideErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="price">{t("UpdateProduct:form.price")}</Label>
            <Input
              name="price"
              placeholder={t("UpdateProduct:placeholders.price")}
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price &&
              errors.price[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
              )}
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="stock_quantity">
              {t("UpdateProduct:form.stock_quantity")}
            </Label>
            <Input
              name="stock_quantity"
              placeholder={t("UpdateProduct:placeholders.stock_quantity")}
              value={productData.stock_quantity}
              onChange={handleChange}
            />
            {errors.stock_quantity &&
              errors.stock_quantity[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock_quantity[0]}
                </p>
              )}
            {clientSideErrors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.stock_quantity}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category_id">
              {t("UpdateProduct:form.category")}
            </Label>
            <Select
              options={categories?.map((category: Category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={(value) => handleSelectChange(value, "category_id")}
              value={productData?.category_id}
              placeholder={t("UpdateProduct:form.select_category")}
            />
            {errors.category_id &&
              errors.category_id[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">
                  {errors.category_id[0]}
                </p>
              )}
            {clientSideErrors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.category_id}
              </p>
            )}
            {fetchingCategoriesError && (
              <p className="text-red-500 text-sm mt-1">
                {fetchingCategoriesError}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">{t("UpdateProduct:form.brand")}</Label>
            <Select
              options={brands?.map((brand: Brand) => ({
                value: String(brand.id),
                label: brand.name,
              }))}
              onChange={(value) => handleSelectChange(value, "brand_id")}
              value={productData.brand_id}
              placeholder={t("UpdateProduct:form.select_brand")}
            />
            {errors.brand_id &&
              errors.brand_id[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand_id[0]}
                </p>
              )}
            {clientSideErrors.brand_id && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.brand_id}
              </p>
            )}
            {fetchingBrandsError && (
              <p className="text-red-500 text-sm mt-1">{fetchingBrandsError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">{t("UpdateProduct:form.status")}</Label>
            <Select
              options={[
                {
                  value: "active",
                  label: t("UpdateProduct:form.status_active"),
                },
                {
                  value: "inactive",
                  label: t("UpdateProduct:form.status_inactive"),
                },
              ]}
              onChange={(value) => handleSelectChange(value, "status")}
              value={productData.status}
              placeholder={t("UpdateProduct:form.select_status")}
            />
            {errors.status &&
              errors.status[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
              )}
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <Label htmlFor="is_featured">
              {t("UpdateProduct:form.is_featured")}
            </Label>
            <Checkbox
              checked={productData.is_featured}
              onChange={(checked) =>
                setProductData((prev) => ({ ...prev, is_featured: checked }))
              }
            />
            {errors.is_featured &&
              errors.is_featured[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">
                  {errors.is_featured[0]}
                </p>
              )}
            {clientSideErrors.is_featured && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.is_featured}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">
              {t("UpdateProduct:form.description")}
            </Label>
            <TextArea
              name="description"
              placeholder={t("UpdateProduct:placeholders.description")}
              value={productData.description}
              onChange={(value) =>
                setProductData((prev) => ({ ...prev, description: value }))
              }
            />
            {errors.description &&
              errors.description[0] && ( // تم تعديل الوصول إلى العنصر الأول
                <p className="text-red-500 text-sm mt-1">
                  {errors.description[0]}
                </p>
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
          <Label>{t("UpdateProduct:form.upload_images")}</Label>
          <FileInput multiple onChange={handleImageChange} />
          {errors.images &&
            errors.images[0] && ( // تم تعديل الوصول إلى العنصر الأول
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
              <Label>{t("UpdateProduct:form.existing_images")}</Label>
              <div className="flex gap-3 mt-3 flex-wrap">
                {existingImages.map((src, i) => (
                  <img
                    key={i}
                    src={src.image}
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
          <Label>{t("UpdateProduct:form.attributes")}</Label>
          {attributes.map((attr, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <Input
                placeholder={t("UpdateProduct:placeholders.attribute_label")}
                value={attr.attribute_name}
                onChange={(e) =>
                  handleAttributeChange(i, "attribute_name", e.target.value)
                }
              />
              <Input
                placeholder={t("UpdateProduct:placeholders.attribute_value")}
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
            {t("UpdateProduct:form.add_attribute")}
          </button>
          {errors.attributes &&
            errors.attributes[0] && ( // تم تعديل الوصول إلى العنصر الأول
              <p className="text-red-500 text-sm mt-1">
                {errors.attributes[0]}
              </p>
            )}
        </div>

        {/* Tags */}
        <div>
          <Label>{t("UpdateProduct:form.tags")}</Label>
          {tags.map((tag, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <Input
                value={tag}
                onChange={(e) => handleTagChange(i, e.target.value)}
                placeholder={t("UpdateProduct:placeholders.tag")}
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
            {t("UpdateProduct:form.add_tag")}
          </button>
          {errors.tags &&
            errors.tags[0] && ( // تم تعديل الوصول إلى العنصر الأول
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
            {loading
              ? t("UpdateProduct:form.updating_button")
              : t("UpdateProduct:form.update_button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;
