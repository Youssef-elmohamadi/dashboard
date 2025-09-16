import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import FileInput from "../../common/input/FileInput";
import TextArea from "../../common/input/TextArea";
import { useTranslation } from "react-i18next";
import Select from "../../common/form/Select";
import { useCreateProduct } from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import SEO from "../../../components/common/SEO/seo"; // Ensured SEO component is imported
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
import {
  Attribute,
  ClientErrors,
  productInputData,
  ServerError,
} from "../../../types/Product";
import { AxiosError } from "axios";
import DeleteIcon from "../../../icons/DeleteIcon";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";

export default function CreateProducts() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<{ ar: string[]; en: string[] }>({
    ar: [],
    en: [],
  });
  const [errors, setErrors] = useState<ServerError>({
    name_ar: [],
    name_en: [],
    price: [],
    description_ar: [],
    description_en: [],
    category_id: [],
    brand_id: [],
    stock_quantity: [],
    unit_ar: [],
    unit_en: [],
    status: [],
    is_featured: [],
    discount_price: [],
    images: [],
    attributes: [],
    tags: [],
    general: "",
    global: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({});
  const { t } = useTranslation(["CreateProduct", "Meta"]);
  const { lang } = useDirectionAndLanguage();
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});
  const [productData, setProductData] = useState<productInputData>({
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
    status: "inactive",
    is_featured: false,
  });
  const [fetchingCategoriesError, setFetchingCategoriesError] =
    useState<string>("");
  const [fetchingBrandsError, setFetchingBrandsError] = useState<string>("");

  const {
    data: allCategories,
    error: categoryError,
    isError: isCategoryError,
  } = useCategories();
  useEffect(() => {
    if (isCategoryError && categoryError instanceof AxiosError) {
      const status = categoryError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("CreateProduct:errors.global"),
        }));
      } else {
        setFetchingCategoriesError(
          t("CreateProduct:errors.fetching_categories")
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
  useEffect(() => {
    if (isBrandError && brandError instanceof AxiosError) {
      const status = brandError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("CreateProduct:errors.global"),
        }));
      } else {
        setFetchingBrandsError(t("CreateProduct:errors.fetching_brands"));
      }
    }
  }, [isBrandError, brandError, t]);
  const navigate = useNavigate();
  const brands = allBrands?.data;
  const addTag = () => {
    setTags((prev) => ({
      ar: [...prev.ar, ""],
      en: [...prev.en, ""],
    }));
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
    const updated = [...attributes] as Attribute[];
    (updated[index] as any)[field] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const handleTagChange = (lang: "ar" | "en", index: number, value: string) => {
    setTags((prev) => {
      const updated = [...prev[lang]];
      updated[index] = value;
      return { ...prev, [lang]: updated };
    });
  };

  const removeTag = (index: number) => {
    setTags((prev) => {
      const updatedAr = [...prev.ar];
      const updatedEn = [...prev.en];
      updatedAr.splice(index, 1);
      updatedEn.splice(index, 1);
      return { ar: updatedAr, en: updatedEn };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productData.name_ar) {
      newErrors.name_ar = t("CreateProduct:validation.name");
    }
    if (!productData.name_en) {
      newErrors.name_en = t("CreateProduct:validation.name");
    }
    if (!productData.price)
      newErrors.price = t("CreateProduct:validation.price");
    if (!productData.stock_quantity)
      newErrors.stock_quantity = t("CreateProduct:validation.stock_quantity");
    if (!productData.unit_ar)
      newErrors.unit_ar = t("CreateProduct:validation.unit");
    if (!productData.unit_en)
      newErrors.unit_en = t("CreateProduct:validation.unit");
    if (!productData.category_id)
      newErrors.category_id = t("CreateProduct:validation.category_id");
    if (!productData.brand_id)
      newErrors.brand_id = t("CreateProduct:validation.brand_id");
    if (!productData.description_ar)
      newErrors.description_ar = t("CreateProduct:validation.description");
    if (!productData.description_en)
      newErrors.description_en = t("CreateProduct:validation.description");
    const isValid = Object.values(newErrors).every((error) => error === "");
    setClientSideErrors(newErrors);
    return { isValid, newErrors };
  };

  const focusOnError = (errors: Record<string, string | string[]>) => {
    const errorEntry = Object.entries(errors).find(
      ([_, value]) =>
        (typeof value === "string" && value !== "") ||
        (Array.isArray(value) && value.length > 0)
    );

    if (errorEntry) {
      const fieldName = errorEntry[0];
      const ref = inputRefs?.current[fieldName];
      ref?.focus();
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          ref.focus({ preventScroll: true });
        }, 300);
      }
    }
  };
  const { mutateAsync } = useCreateProduct();
  const isCurrentlyOnline = useCheckOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, newErrors } = validate();
    if (!isValid) {
      focusOnError(newErrors);
      return;
    }
    setLoading(true);

    if (!isCurrentlyOnline()) {
      toast.error(t("CreateProduct:errors.no_internet"));
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
      formData.append(`attributes[${i}][name_ar]`, attr.attribute_name_ar);
      formData.append(`attributes[${i}][value_ar]`, attr.attribute_value_ar);
      formData.append(`attributes[${i}][name_en]`, attr.attribute_name_en);
      formData.append(`attributes[${i}][value_en]`, attr.attribute_value_en);
    });
    tags.ar.forEach((tagAr, index) => {
      if (tagAr.trim() !== "" || tags.en[index]?.trim() !== "") {
        formData.append(`tags[${index}][name_ar]`, tagAr);
        formData.append(`tags[${index}][name_en]`, tags.en[index] || "");
      }
    });

    try {
      await mutateAsync(formData);
      navigate("/admin/products", {
        state: { successCreate: t("CreateProduct:success_create") },
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("CreateProduct:errors.global"),
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
        focusOnError(formattedErrors);
      } else {
        setErrors({ ...errors, general: t("CreateProduct:errors.general") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SEO
        title={{
          ar: " إضافة منتج جديد",
          en: "Add New Product",
        }}
        description={{
          ar: "صفحة إضافة منتج جديد إلى متجر تشطيبة. أدخل تفاصيل المنتج، الصور، والسمات.",
          en: "Add a new product to Tashtiba store. Enter product details, upload images, and specify attributes.",
        }}
        keywords={{
          ar: [
            "إضافة منتج",
            "منتج جديد",
            "إنشاء منتج",
            "تشطيبة",
            "إدارة المنتجات",
            "المخزون",
            "متجر إلكتروني",
          ],
          en: [
            "add product",
            "new product",
            "create product",
            "Tashtiba",
            "product management",
            "inventory",
            "e-commerce store",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateProduct:title")}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {errors.global && (
          <p className="text-red-500 text-sm mt-4">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name_ar">{t("CreateProduct:form.name_ar")}</Label>
              <Input
                name="name_ar"
                value={productData.name_ar}
                placeholder={t("CreateProduct:placeholders.name_ar")}
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
              <Label htmlFor="name_en">{t("CreateProduct:form.name_en")}</Label>
              <Input
                name="name_en"
                value={productData.name_en}
                placeholder={t("CreateProduct:placeholders.name_en")}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="price">{t("CreateProduct:form.price")}</Label>
              <Input
                type="text"
                name="price"
                placeholder={t("CreateProduct:placeholders.price")}
                value={productData.price}
                onChange={handleChange}
                id="price"
                ref={(el) => {
                  if (inputRefs?.current) {
                    inputRefs.current["price"] = el;
                  }
                }}
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
            <div>
              <Label htmlFor="discount_price">
                {t("CreateProduct:form.discount_price")}
              </Label>
              <Input
                type="text"
                name="discount_price"
                placeholder={t("CreateProduct:placeholders.discount_price")}
                value={productData.discount_price}
                onChange={handleChange}
                id="discount_price"
                ref={(el) => {
                  if (inputRefs?.current) {
                    inputRefs.current["discount_price"] = el;
                  }
                }}
              />
              {clientSideErrors.discount_price && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.price}
                </p>
              )}
              {errors.discount_price && errors.discount_price[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_price[0]}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <Label htmlFor="stock_quantity">
                {t("CreateProduct:form.stock_quantity")}
              </Label>
              <Input
                type="text"
                name="stock_quantity"
                placeholder={t("CreateProduct:placeholders.stock_quantity")}
                value={productData.stock_quantity}
                onChange={handleChange}
                id="stock_quantity"
                ref={(el) => {
                  if (inputRefs?.current) {
                    inputRefs.current["stock_quantity"] = el;
                  }
                }}
              />
              {clientSideErrors.stock_quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.stock_quantity}
                </p>
              )}
              {errors.stock_quantity && errors.stock_quantity[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock_quantity[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="unit_en">{t("CreateProduct:form.unit_en")}</Label>
              <Input
                name="unit_en"
                value={productData.unit_en}
                placeholder={t("CreateProduct:placeholders.unit_en")}
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
              <Label htmlFor="unit_ar">{t("CreateProduct:form.unit_ar")}</Label>
              <Input
                name="unit_ar"
                value={productData.unit_ar}
                placeholder={t("CreateProduct:placeholders.unit_ar")}
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
            <div className="flex gap-2 items-center">
              <Label htmlFor="is_featured">
                {t("CreateProduct:form.is_featured")}
              </Label>
              <Checkbox
                checked={productData.is_featured}
                onChange={(checked) =>
                  setProductData((prev) => ({ ...prev, is_featured: checked }))
                }
                id="is_featured"
              />
              {errors.is_featured && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.is_featured}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="category_id">
                {t("CreateProduct:form.category")}
              </Label>
              <Select
                options={categories?.map((category: Category) => ({
                  value: category.id,
                  label: category[`name_${lang}`],
                }))}
                onChange={(value) => handleSelectChange(value, "category_id")}
                value={productData.category_id}
                placeholder={t("CreateProduct:form.select_category")}
              />
              {clientSideErrors.category_id && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.category_id}
                </p>
              )}
              {errors.category_id && errors.category_id[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category_id[0]}
                </p>
              )}
              {fetchingCategoriesError && (
                <p className="text-red-500 text-sm mt-1">
                  {fetchingCategoriesError}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="brand_id">{t("CreateProduct:form.brand")}</Label>
              <Select
                options={brands?.map((brand: Brand) => ({
                  label: brand[`name_${lang}`],
                  value: String(brand.id),
                }))}
                onChange={(value) => handleSelectChange(value, "brand_id")}
                value={productData.brand_id}
                placeholder={t("CreateProduct:form.select_brand")}
              />
              {clientSideErrors.brand_id && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.brand_id}
                </p>
              )}
              {errors.brand_id && errors.brand_id[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand_id[0]}
                </p>
              )}
              {fetchingBrandsError && (
                <p className="text-red-500 text-sm mt-1">
                  {fetchingBrandsError}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="images">
              {t("CreateProduct:form.upload_images")}
            </Label>
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
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
            <div>
              <Label htmlFor="description_ar">
                {t("CreateProduct:form.description_ar")}
              </Label>
              <TextArea
                name="description_ar"
                placeholder={t("CreateProduct:placeholders.description_ar")}
                value={productData.description_ar}
                onChange={(value) =>
                  setProductData((prev) => ({ ...prev, description_ar: value }))
                }
                ref={(el) => {
                  if (inputRefs?.current) {
                    inputRefs.current["description_ar"] = el;
                  }
                }}
              />
              {clientSideErrors.description_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.description_ar}
                </p>
              )}
              {errors.description_ar && errors.description_ar[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description_ar[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description_en">
                {t("CreateProduct:form.description_en")}
              </Label>
              <TextArea
                name="description_en"
                placeholder={t("CreateProduct:placeholders.description_en")}
                value={productData.description_en}
                onChange={(value) =>
                  setProductData((prev) => ({ ...prev, description_en: value }))
                }
                ref={(el) => {
                  if (inputRefs?.current) {
                    inputRefs.current["description_en"] = el;
                  }
                }}
              />
              {clientSideErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.description_en}
                </p>
              )}
              {errors.description_en && errors.description_en[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description_en[0]}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>{t("CreateProduct:form.attributes")}</Label>
            {attributes.map((attr, index) => (
              <div key={index} className="flex flex-col gap-2 mb-2">
                <div className="flex gap-2">
                  <Input
                    placeholder={t(
                      "CreateProduct:placeholders.attribute_label_ar"
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
                      "CreateProduct:placeholders.attribute_value_ar"
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
                      "CreateProduct:placeholders.attribute_label_en"
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
                      "CreateProduct:placeholders.attribute_value_en"
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
                  <span className="text-base">
                    {t("form.delete_attribute")}
                  </span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setAttributes([
                  ...attributes,
                  {
                    attribute_name_ar: "",
                    attribute_value_ar: "",
                    attribute_name_en: "",
                    attribute_value_en: "",
                  },
                ])
              }
              className="text-brand-500 mt-1"
            >
              {t("CreateProduct:form.add_attribute")}
            </button>
          </div>

          <div>
            <Label>{t("CreateProduct:form.tags")}</Label>

            {tags.ar.map((tagAr, index) => (
              <div
                key={index}
                className="mb-2 flex gap-2 items-center flex-wrap p-2 rounded"
              >
                <Input
                  placeholder={t("CreateProduct:placeholders.tag_ar")}
                  value={tagAr}
                  onChange={(e) => handleTagChange("ar", index, e.target.value)}
                />

                <Input
                  placeholder={t("CreateProduct:placeholders.tag_en")}
                  value={tags.en[index]}
                  onChange={(e) => handleTagChange("en", index, e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-red-600 text-xl flex items-center gap-2"
                >
                  <DeleteIcon className="text-red-600 text-xl" />
                  <span className="text-base">{t("form.delete_tag")}</span>
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTag}
              className="text-brand-500 mt-2"
            >
              {t("CreateProduct:form.add_tag")}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-2  w-1/4 mx-auto text-center"
        >
          {loading
            ? t("CreateProduct:form.creating_button")
            : t("CreateProduct:form.create_button")}
        </button>
      </form>
    </div>
  );
}
