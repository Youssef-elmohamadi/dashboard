import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import FileInput from "../../common/input/FileInput";
import { useTranslation } from "react-i18next";
import Select from "../../common/form/Select";
import TextArea from "../../common/input/TextArea";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import {
  useGetProductById,
  useUpdateProduct,
} from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import SEO from "../../../components/common/SEO/seo";
import { AxiosError } from "axios";
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
import {
  Attribute,
  image,
  Product,
  ServerError,
  TagInput,
  Variant,
} from "../../../types/Product";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import DeleteIcon from "../../../icons/DeleteIcon";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LazyImage from "../../common/LazyImage";
import { useAllProductQuestions } from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";
const UpdateProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateProduct", "Meta"]);
  const { lang } = useDirectionAndLanguage();
  const [productData, setProductData] = useState<Product>({
    id: 0,
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    unit_ar: "",
    unit_en: "",
    category_id: "",
    brand_id: "",
    is_featured: false,
    created_at: "",
    updated_at: "",
    attributes: [],
    variants: [],
    images: [],
    tags: [],
    review: [],
    questions: [],
  });
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<image[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<Variant[] | undefined>([]);
  const [tags, setTags] = useState<TagInput[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<ServerError>({
    name_ar: [],
    name_en: [],
    description_ar: [],
    description_en: [],
    price: [],
    discount_price: [],
    stock_quantity: [],
    unit_ar: [],
    unit_en: [],
    category_id: [],
    brand_id: [],
    status: [],
    is_featured: [],
    images: [],
    variants: [],
    attributes: [],
    tags: [],
    general: "",
    global: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    unit_ar: "",
    unit_en: "",
    category_id: "",
    brand_id: "",
    status: "",
    images: "",
    is_featured: "",
  });
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
    refetch,
  } = useGetProductById(id);

  useEffect(() => {
    if (!product) return;
    setProductData(product);
    setExistingImages(product.images ?? []);
    setAttributes(
      product.attributes?.map((attr: any) => ({
        attribute_name_ar: attr.attribute_name_ar,
        attribute_name_en: attr.attribute_name_en,
        attribute_value_ar: attr.attribute_value_ar,
        attribute_value_en: attr.attribute_value_en,
      }))
    );
    setVariants(
      product.variants?.map((variant: Variant) => ({
        name_ar: variant.variant_name_ar,
        name_en: variant.variant_name_en,
        value_ar: variant.variant_value_ar,
        value_en: variant.variant_value_en,
        stock_quantity: variant.stock_quantity,
        price: variant.price,
        discount_price: variant.discount_price,
      }))
    );
    setTags(
      product.tags.map((tag: any) => ({
        name_ar: tag.name_ar || "",
        name_en: tag.name_en || "",
      }))
    );
    if (product.questions) {
      setProductData((prev) => ({
        ...prev,
        questions: product.questions?.map((q: any) => q.id) || [],
      }));
    }
  }, [product]);

  const [fetchingCategoriesError, setFetchingCategoriesError] =
    useState<string>("");
  const [fetchingBrandsError, setFetchingBrandsError] = useState<string>("");

  const {
    data: allCategories,
    error: categoryError,
    isError: isCategoryError,
  } = useCategories("all");
  useEffect(() => {
    if (isCategoryError && categoryError instanceof AxiosError) {
      const status = categoryError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateProduct:errors.global"),
        }));
      } else {
        setFetchingCategoriesError(
          t("UpdateProduct:errors.fetching_categories")
        );
      }
    }
  }, [isCategoryError, categoryError, t]);
  const categories = allCategories;
  const {
    data: allBrands,
    error: brandError,
    isError: isBrandError,
  } = useAllBrands();
  const brands = allBrands?.data;

  const { data: allQuestions } = useAllProductQuestions(0, {
    per_page: 1000,
  });
  useEffect(() => {
    if (isBrandError && brandError instanceof AxiosError) {
      const status = brandError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateProduct:errors.global"),
        }));
      } else {
        setFetchingBrandsError(t("UpdateProduct:errors.fetching_brands"));
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
    field: keyof Attribute,
    value: string
  ) => {
    const updated = [...attributes] as Attribute[];
    (updated[index] as any)[field] = value;
    setAttributes(updated);
  };
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const updated = [...(variants ?? [])] as Variant[];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  };

  const handleTagChange = (
    index: number,
    field: "name_ar" | "name_en",
    value: string
  ) => {
    const updated = [...tags];
    updated[index][field] = value;
    setTags(updated);
  };

  const removeAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };
  const removeVariant = (index: number) => {
    const updated = [...(variants ?? [])];
    updated.splice(index, 1);
    setVariants(updated);
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
        attribute_name_ar: "",
        attribute_name_en: "",
        attribute_value_ar: "",
        attribute_value_en: "",
      },
    ]);
  const addVariant = () =>
    setVariants([
      ...(variants ?? []),
      {
        name_ar: "",
        name_en: "",
        value_ar: "",
        value_en: "",
        price: null,
        stock_quantity: null,
        discount_price: null,
      },
    ]);
  const addTag = () => setTags([...tags, { name_ar: "", name_en: "" }]);
  const validate = () => {
    const newErrors = {
      name_ar: "",
      name_en: "",
      description: "",
      price: "",
      discount_price: "",
      stock_quantity: "",
      category_id: "",
      brand_id: "",
      status: "",
      images: "",
      is_featured: "",
    };
    if (!productData.name_ar)
      newErrors.name_ar = t("UpdateProduct:validation.name");
    if (!productData.name_en)
      newErrors.name_en = t("UpdateProduct:validation.name");
    if (!productData.price)
      newErrors.price = t("UpdateProduct:validation.price");
    if (!productData.stock_quantity)
      newErrors.stock_quantity = t("UpdateProduct:validation.stock_quantity");
    if (!productData.category_id)
      newErrors.category_id = t("UpdateProduct:validation.category_id");
    if (!productData.brand_id)
      newErrors.brand_id = t("UpdateProduct:validation.brand_id");
    if (!productData.description)
      newErrors.description = t("UpdateProduct:validation.description");
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };
  const { mutateAsync } = useUpdateProduct(id);
  const isCurrentlyOnline = useCheckOnline();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (validate()) {
      setLoading(false);
      return;
    }
    setErrors({
      name_ar: [],
      name_en: [],
      description_ar: [],
      description_en: [],
      price: [],
      discount_price: [],
      stock_quantity: [],
      unit_ar: [],
      unit_en: [],
      category_id: [],
      brand_id: [],
      status: [],
      is_featured: [],
      images: [],
      attributes: [],
      variants: [],
      tags: [],
      global: "",
      general: "",
    });

    if (!isCurrentlyOnline) {
      toast.error(t("UpdateProduct:errors.no_internet"));
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (
        key !== "is_featured" &&
        key !== "slug" &&
        key !== "images" &&
        key !== "tags" &&
        key !== "attributes" &&
        key !== "variants" &&
        key !== "status" &&
        value !== null &&
        value !== undefined
      ) {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");
    if (images.length > 0) {
      images.forEach((image) => formData.append("images[]", image));
    }
    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name_ar]`, attr.attribute_name_ar);
      formData.append(`attributes[${i}][value_ar]`, attr.attribute_value_ar);
      formData.append(`attributes[${i}][name_en]`, attr.attribute_name_en);
      formData.append(`attributes[${i}][value_en]`, attr.attribute_value_en);
    });
    variants?.forEach((variant, i) => {
      formData.append(`variants[${i}][name_ar]`, variant.name_ar);
      formData.append(`variants[${i}][value_ar]`, variant.value_ar);
      formData.append(`variants[${i}][name_en]`, variant.name_en);
      formData.append(`variants[${i}][value_en]`, variant.value_en);
      formData.append(`variants[${i}][price]`, variant.price!.toString());
      formData.append(
        `variants[${i}][stock_quantity]`,
        variant.stock_quantity!.toString()
      );
      formData.append(
        `variants[${i}][discount_price]`,
        variant.discount_price!.toString()
      );
    });
    tags.forEach((tag, i) => {
      formData.append(`tags[${i}][name_ar]`, tag.name_ar);
      formData.append(`tags[${i}][name_en]`, tag.name_en);
    });

    if (productData.questions && productData.questions.length > 0) {
      productData.questions.forEach((qId: string | number) => {
        formData.append("questions[]", qId.toString());
      });
    }

    try {
      await mutateAsync({ id: +id!, productData: formData });
      navigate("/admin/products", {
        state: { successUpdate: t("UpdateProduct:success_update") },
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("UpdateProduct:errors.global"),
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
        setErrors({ ...errors, general: t("UpdateProduct:errors.general") });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  let pageStatus = PageStatus.SUCCESS;
  let errorMessage = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("UpdateProduct:no_data");
  } else if (isProductLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isProductError) {
    const axiosError = productError as AxiosError;
    pageStatus = PageStatus.ERROR;
    if ([401, 403].includes(axiosError?.response?.status || 0)) {
      errorMessage = t("UpdateProduct:errors.global");
    } else {
      errorMessage = t("UpdateProduct:errors.general");
    }
  } else if (!product) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("UpdateProduct:not_found");
  }

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={errorMessage}
      loadingText={t("UpdateProduct:loading")}
      notFoundText={t("UpdateProduct:not_found")}
      onRetry={handleRetry}
    >
      <SEO
        title={{
          ar: " تحديث المنتج",
          en: "Update Product",
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
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateProduct:title")}
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
            <Label htmlFor="name_ar">{t("UpdateProduct:form.name_ar")}</Label>
            <Input
              name="name_ar"
              value={productData.name_ar}
              placeholder={t("UpdateProduct:placeholders.name_ar")}
              onChange={handleChange}
              id="name_ar"
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["name_ar"] = el;
                }
              }}
            />
            {clientSideErrors.name_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name_ar}
              </p>
            )}
            {errors.name_ar && errors.name_ar[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.name_ar[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="name_en">{t("UpdateProduct:form.name_en")}</Label>
            <Input
              name="name_en"
              value={productData.name_en}
              placeholder={t("UpdateProduct:placeholders.name_en")}
              onChange={handleChange}
              id="name_en"
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["name_en"] = el;
                }
              }}
            />
            {clientSideErrors.name_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.name_en}
              </p>
            )}
            {errors.name_en && errors.name_en[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.name_en[0]}</p>
            )}
          </div>

          {/* <div>
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
            {errors.status && errors.status[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
            )}
            </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="price">{t("UpdateProduct:form.price")}</Label>
            <Input
              name="price"
              placeholder={t("UpdateProduct:placeholders.price")}
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price && errors.price[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
            )}
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="discount_price">
              {t("UpdateProduct:form.discount_price")}
            </Label>
            <Input
              type="text"
              name="discount_price"
              placeholder={t("CreateProduct:placeholders.discount_price")}
              value={productData.discount_price!!}
              onChange={handleChange}
              id="discount_price"
            />
            {clientSideErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.price}
              </p>
            )}
            {errors.price && errors.price[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <Label htmlFor="stock_quantity">
              {t("UpdateProduct:form.stock_quantity")}
            </Label>
            <Input
              name="stock_quantity"
              placeholder={t("UpdateProduct:placeholders.stock_quantity")}
              value={productData.stock_quantity}
              onChange={handleChange}
              id="stock_quantity"
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["stock_quantity"] = el;
                }
              }}
            />
            {errors.stock_quantity && errors.stock_quantity[0] && (
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
            <Label htmlFor="unit_en">{t("UpdateProduct:form.unit_en")}</Label>
            <Input
              name="unit_en"
              value={productData.unit_en}
              placeholder={t("UpdateProduct:placeholders.unit_en")}
              onChange={handleChange}
              id="unit_en"
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["unit_en"] = el;
                }
              }}
            />
            {clientSideErrors.unit_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.unit_en}
              </p>
            )}
            {errors.unit_en && errors.unit_en[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.unit_en[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="unit_ar">{t("UpdateProduct:form.unit_ar")}</Label>
            <Input
              name="unit_ar"
              value={productData.unit_ar}
              placeholder={t("UpdateProduct:placeholders.unit_ar")}
              onChange={handleChange}
              id="unit_ar"
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["unit_ar"] = el;
                }
              }}
            />
            {clientSideErrors.unit_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.unit_ar}
              </p>
            )}
            {errors.unit_ar && errors.unit_ar[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.unit_ar[0]}</p>
            )}
          </div>

          <div className="flex items-center space-x-3 mt-1">
            <Checkbox
              checked={Boolean(productData.is_featured)}
              onChange={(checked) =>
                setProductData((prev) => ({
                  ...prev,
                  is_featured: checked,
                }))
              }
              id="is_featured"
              label={t("UpdateProduct:form.is_featured")}
            />
            {errors.is_featured && errors.is_featured[0] && (
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
        </div>
        <div className="grid col-span-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="category_id">
              {t("UpdateProduct:form.category")}
            </Label>
            <Select
              options={categories?.map((category: Category) => ({
                value: category.id,
                label: category[`name_${lang}`],
              }))}
              onChange={(value) => handleSelectChange(value, "category_id")}
              value={productData?.category_id}
              placeholder={t("UpdateProduct:form.select_category")}
            />
            {errors.category_id && errors.category_id[0] && (
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
                label: brand[`name_${lang}`],
              }))}
              onChange={(value) => handleSelectChange(value, "brand_id")}
              value={productData.brand_id}
              placeholder={t("UpdateProduct:form.select_brand")}
            />
            {errors.brand_id && errors.brand_id[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.brand_id[0]}</p>
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
        </div>
        <div className="grid col-span-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="description_ar">
              {t("UpdateProduct:form.description_ar")}
            </Label>
            <TextArea
              name="description_ar"
              placeholder={t("UpdateProduct:placeholders.description_ar")}
              value={productData.description_ar}
              onChange={(value) =>
                setProductData((prev) => ({ ...prev, description_ar: value }))
              }
            />
            {errors.description_ar && errors.description_ar[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description_ar[0]}
              </p>
            )}
            {clientSideErrors.description_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.description_ar}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description_en">
              {t("UpdateProduct:form.description_en")}
            </Label>
            <TextArea
              name="description_en"
              placeholder={t("UpdateProduct:placeholders.description_en")}
              value={productData.description_en}
              onChange={(value) =>
                setProductData((prev) => ({ ...prev, description_en: value }))
              }
            />
            {errors.description_en && errors.description_en[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description_en[0]}
              </p>
            )}
            {clientSideErrors.description_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.description_en}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label>{t("UpdateProduct:form.upload_images")}</Label>
          <FileInput multiple onChange={handleImageChange} />
          {errors.images && errors.images[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.images[0]}</p>
          )}
          {clientSideErrors?.images && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors?.images}
            </p>
          )}
          {existingImages.length > 0 && (
            <div>
              <Label>{t("UpdateProduct:form.existing_images")}</Label>
              <div className="flex gap-3 mt-3 flex-wrap">
                {existingImages.map((src, i) => (
                  <LazyImage
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
                <LazyImage
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
        <div>
          <Label>{t("UpdateProduct:form.variants")}</Label>
          {variants?.map((variant, index) => (
            <div key={index} className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_name_ar")}
                  value={variant.name_ar}
                  onChange={(e) =>
                    handleVariantChange(index, "name_ar", e.target.value)
                  }
                />
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_value_ar")}
                  value={variant.value_ar}
                  onChange={(e) =>
                    handleVariantChange(index, "value_ar", e.target.value)
                  }
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_name_en")}
                  value={variant.name_en}
                  onChange={(e) =>
                    handleVariantChange(index, "name_en", e.target.value)
                  }
                />
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_value_en")}
                  value={variant.value_en}
                  onChange={(e) =>
                    handleVariantChange(index, "value_en", e.target.value)
                  }
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_price")}
                  value={variant.price!}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                />
                <Input
                  placeholder={t(
                    "UpdateProduct:placeholders.variant_discount_price"
                  )}
                  value={variant.discount_price!}
                  onChange={(e) =>
                    handleVariantChange(index, "discount_price", e.target.value)
                  }
                />
                <Input
                  placeholder={t("UpdateProduct:placeholders.variant_stock")}
                  value={variant.stock_quantity!}
                  onChange={(e) =>
                    handleVariantChange(index, "stock_quantity", e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 text-xl flex items-center gap-2"
              >
                <DeleteIcon className="text-red-600 text-xl" />
                <span className="text-base">{t("form.delete_variant")}</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="text-brand-500 mt-1"
          >
            {t("UpdateProduct:form.add_variant")}
          </button>
          {errors.variants && errors.variants[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.variants[0]}</p>
          )}
        </div>
        <div>
          <Label>{t("UpdateProduct:form.attributes")}</Label>
          {attributes.map((attr, index) => (
            <div key={index} className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <Input
                  placeholder={t(
                    "UpdateProduct:placeholders.attribute_label_ar"
                  )}
                  value={attr.attribute_name_ar}
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "attribute_name_ar",
                      e.target.value
                    )
                  }
                />
                <Input
                  placeholder={t(
                    "UpdateProduct:placeholders.attribute_value_ar"
                  )}
                  value={attr.attribute_value_ar}
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "attribute_value_ar",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t(
                    "UpdateProduct:placeholders.attribute_label_en"
                  )}
                  value={attr.attribute_name_en}
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "attribute_name_en",
                      e.target.value
                    )
                  }
                />
                <Input
                  placeholder={t(
                    "UpdateProduct:placeholders.attribute_value_en"
                  )}
                  value={attr.attribute_value_en}
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "attribute_value_en",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="text-red-600 text-xl flex items-center gap-2"
              >
                <DeleteIcon className="text-red-600 text-xl" />
                <span className="text-base">{t("form.delete_attribute")}</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            className="text-brand-500 mt-1"
          >
            {t("UpdateProduct:form.add_attribute")}
          </button>
          {errors.attributes && errors.attributes[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.attributes[0]}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label>{t("UpdateProduct:form.tags")}</Label>
          {tags.map((tag, i) => (
            <div
              key={i}
              className="mb-2 flex gap-2 items-center flex-wrap p-2 rounded"
            >
              <Input
                value={tag.name_ar}
                onChange={(e) => handleTagChange(i, "name_ar", e.target.value)}
                placeholder={t("UpdateProduct:placeholders.tag_ar")}
              />
              <Input
                value={tag.name_en}
                onChange={(e) => handleTagChange(i, "name_en", e.target.value)}
                placeholder={t("UpdateProduct:placeholders.tag_en")}
              />
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-red-600 text-xl flex items-center gap-2"
              >
                <DeleteIcon className="text-red-600 text-xl" />
                <span className="text-base">{t("form.delete_tag")}</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTag()}
            className="text-brand-600 hover:underline mt-2"
          >
            {t("UpdateProduct:form.add_tag")}
          </button>
          {errors.tags && errors.tags[0] && (
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
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-6 rounded-lg"
          >
            {loading
              ? t("UpdateProduct:form.updating_button")
              : t("UpdateProduct:form.update_button")}
          </button>
        </div>
      </form>
    </PageStatusHandler>
  );
};

export default UpdateProductPage;
