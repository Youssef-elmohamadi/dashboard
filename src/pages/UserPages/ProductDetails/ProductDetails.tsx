import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MdOutlineFavoriteBorder from "../../../icons/HeartIcon";
const Circles = lazy(() =>
  import("react-loader-spinner").then((module) => ({ default: module.Circles }))
);
import { useTranslation } from "react-i18next";
import { useModal } from "../../../components/EndUser/context/ModalContext";
import { useGetProductById } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import SEO from "../../../components/common/SEO/seo";
import { Product } from "../../../types/Product";
import LazyImage from "../../../components/common/LazyImage";
const StarRatings = lazy(() => import("react-star-ratings"));
const InnerImageZoom = lazy(() => import("react-inner-image-zoom"));
type ProductParams = {
  id: string;
  lang: "ar" | "en" | undefined;
};

const ProductDetails: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>(
    {}
  );
  const { id, lang } = useParams<ProductParams>();
  const currentLang = (lang as "ar" | "en") || "ar";
  const numericId = Number(id);
  const { t } = useTranslation(["EndUserProductDetails"]);
  const { openModal } = useModal();
  const { data, isLoading: isProductLoading } = useGetProductById(numericId);
  const product: Product | undefined = data?.data?.data;
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [is_fav, setIs_fav] = useState<boolean>(false);
  // const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].image);
    }
    if (typeof product?.is_fav === "boolean") {
      setIs_fav(product.is_fav);
    }
    // if (product?.variants?.length) {
    //   setSelectedVariant(product.variants[0]);
    // }
  }, [product]);

  const { mutateAsync: addToFavorite } = useAddFavorite();
  const { mutateAsync: removeFromFavorite } = useRemoveFavorite();

  const handleToggleFavorite = async () => {
    if (!product) return;
    const { toast } = await import("react-toastify");
    try {
      if (is_fav) {
        await removeFromFavorite(product.id);
        setIs_fav(false);
        toast.success(t("EndUserProductDetails:successRemoveFromFav"));
      } else {
        await addToFavorite(product.id);
        setIs_fav(true);
        toast.success(t("EndUserProductDetails:successAddedToFav"));
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(t("EndUserProductDetails:noAuth"));
      } else {
        toast.error(t("EndUserProductDetails:favError"));
      }
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Suspense
          fallback={
            <div className="w-20 h-20 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin"></div>
          }
        >
          <Circles height="80" width="80" color="#d62828" ariaLabel="loading" />
        </Suspense>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-600 py-10">
        {t("EndUserProductDetails:productNotFound")}
      </div>
    );
  }

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
  };
  const priceToDisplay = selectedVariant || product;
  const hasDiscount = !!priceToDisplay?.discount_price;
  const totalExtraCharges = Object.values(selectedAnswers).reduce(
    (acc: number, curr: any) => acc + (Number(curr.price_effect) || 0),
    0
  );
  const currentPrice = hasDiscount
    ? (Number(priceToDisplay.discount_price) + totalExtraCharges).toFixed(2)
    : (Number(priceToDisplay.price) + totalExtraCharges).toFixed(2);

  const originalPrice = hasDiscount
    ? (Number(priceToDisplay.price) + totalExtraCharges).toFixed(2)
    : null;

  const displayStock =
    selectedVariant && selectedVariant.stock_quantity
      ? selectedVariant.stock_quantity
      : product.stock_quantity;

  const productToOpenInModal = {
    ...product,
    variant_id: selectedVariant ? selectedVariant.id : null,
    custom_selections: Object.values(selectedAnswers),
    stock_quantity: selectedVariant
      ? selectedVariant.stock_quantity
      : product.stock_quantity,
  };
  const generateKeywords = () => {
    const baseKeywords =
      currentLang === "ar"
        ? ["تشطيبة", "تسوق أونلاين", "منتجات", "مصر", "أفضل عروض"]
        : ["tashtiba", "online shopping", "products", "Egypt", "best deals"];

    const productSpecificKeywords: string[] = [];

    if (product[`name_${currentLang}`]) {
      productSpecificKeywords.push(product[`name_${currentLang}`]);
    }

    if (product.category?.[`name_${currentLang}`]) {
      productSpecificKeywords.push(product.category[`name_${currentLang}`]);
    }

    if (product.brand?.[`name_${currentLang}`]) {
      productSpecificKeywords.push(product.brand[`name_${currentLang}`]);
    }

    if (Array.isArray(product.tags) && product.tags.length > 0) {
      product.tags.forEach((tag) => {
        if (tag[`name_${currentLang}`]) {
          productSpecificKeywords.push(tag[`name_${currentLang}`]);
        }
      });
    }

    if (product[`name_${currentLang}`]) {
      productSpecificKeywords.push(
        `${product[`name_${currentLang}`]} ${
          currentLang === "ar" ? "سعر" : "price"
        }`
      );
      productSpecificKeywords.push(
        `${currentLang === "ar" ? "اشترِ" : "buy"} ${
          product[`name_${currentLang}`]
        }`
      );
    }

    return [...new Set([...baseKeywords, ...productSpecificKeywords])];
  };

  const generateDescription = () => {
    const productName =
      product[`name_${currentLang}`] ||
      t("EndUserProductDetails:defaultProductName");
    const productDescription = product[`description_${currentLang}`] || "";

    const productPrice = product.discount_price
      ? Number(product.discount_price).toFixed(2)
      : Number(product.price).toFixed(2);

    const currency = t("Common:currency.egp");
    const categoryName =
      product.category?.[`name_${currentLang}`] ||
      t("EndUserProductDetails:uncategorized");
    const brandName =
      product.brand?.[`name_${currentLang}`] ||
      t("EndUserProductDetails:unknownBrand");

    const specs =
      Array.isArray(product.attributes) && product.attributes.length > 0
        ? product.attributes
            .slice(0, 6)
            .map(
              (attr) =>
                `${attr[`attribute_name_${currentLang}`]}: ${
                  attr[`attribute_value_${currentLang}`]
                }`
            )
            .join(", ")
        : "";

    if (currentLang === "ar") {
      return `اشتري ${productName} من تشطيبة (${categoryName} - ${brandName}) بسعر ${productPrice} ${currency}. ${
        productDescription ? productDescription + " " : ""
      }${specs ? "المواصفات: " + specs + "." : ""}`;
    } else {
      return `Buy ${productName} from Tashtiba (${categoryName} - ${brandName}) at ${productPrice} ${currency}. ${
        productDescription ? productDescription + " " : ""
      }${specs ? "Specifications: " + specs + "." : ""}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <SEO
        lang={currentLang}
        pageType="product"
        url={`https://tashtiba.com/${currentLang}/product/${product.id}`}
        title={{
          ar: `${product[`name_${currentLang}`]} | افضل سعر في مصر`,
          en: `${product[`name_${currentLang}`]} | Best Price in Egypt`,
        }}
        description={{
          ar: generateDescription(),
          en: generateDescription(),
        }}
        keywords={{
          ar: generateKeywords(),
          en: generateKeywords(),
        }}
        image={
          product.images?.[0]?.image || "https://tashtiba.com/og-image.png"
        }
        alternates={[
          {
            lang: "ar",
            href: `https://tashtiba.com/ar/product/${product.id}`,
          },
          {
            lang: "en",
            href: `https://tashtiba.com/en/product/${product.id}`,
          },
          {
            lang: "x-default",
            href: `https://tashtiba.com/ar/product/${product.id}`,
          },
        ]}
        productData={{
          name: product[`name_${currentLang}`],
          description: product[`description_${currentLang}`] || "",
          image:
            product.images?.length === 1
              ? product.images[0].image
              : product.images?.map((img) => img.image) || [],
          sku: product.id.toString(),
          mpn: product.slug,
          inLanguage: currentLang,
          brand: {
            "@type": "Brand",
            name: product.brand?.[`name_${currentLang}`],
            ...(product.brand?.image && {
              logo: { "@type": "ImageObject", url: product.brand?.image || "" },
            }),
          },
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Category",
              value: product.category?.[`name_${currentLang}`],
            },
          ],
          ...(product.review?.length > 0 && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rate || 1,
              ratingCount: product.review.length,
            },
          }),
          offers:
            Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants.map((variant) => ({
                  "@type": "Offer",
                  url: `https://tashtiba.com/${currentLang}/product/${product.id}`,
                  name: `${product[`name_${currentLang}`]} - ${
                    variant[`variant_name_${currentLang}`]
                  } ${variant[`variant_value_${currentLang}`]}`,

                  priceCurrency: "EGP",
                  price: variant.discount_price
                    ? Number(variant.discount_price).toFixed(2)
                    : Number(variant.price).toFixed(2),
                  availability:
                    variant.stock_quantity && Number(variant.stock_quantity) > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  sku: `${product.id}-${variant.id}`,
                  itemCondition: "https://schema.org/NewCondition",
                  priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  )
                    .toISOString()
                    .split("T")[0],
                  seller: {
                    "@type": "Organization",
                    name: product.vendor?.name || "Tashtiba",
                  },
                  shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingDestination: {
                      "@type": "DefinedRegion",
                      addressCountry: "EG",
                      addressRegion: "Cairo",
                    },
                  },
                }))
              : {
                  "@type": "Offer",
                  url: `https://tashtiba.com/${currentLang}/product/${product.id}`,
                  priceCurrency: "EGP",
                  price: product.discount_price
                    ? Number(product.discount_price).toFixed(2)
                    : Number(product.price).toFixed(2),
                  availability:
                    product.stock_quantity && product.stock_quantity > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  sku: product.id.toString(),
                  itemCondition: "https://schema.org/NewCondition",
                  priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  )
                    .toISOString()
                    .split("T")[0],
                  seller: {
                    "@type": "Organization",
                    name: product.vendor?.name || "Tashtiba",
                  },
                  shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingDestination: {
                      "@type": "DefinedRegion",
                      addressCountry: "EG",
                      addressRegion: "Cairo",
                    },
                  },
                },
        }}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: currentLang === "ar" ? "الرئيسية" : "Home",
                item: `https://tashtiba.com/${currentLang}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: product.category?.[`name_${currentLang}`],
                item: `https://tashtiba.com/${currentLang}/category/${product.category?.id}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product[`name_${currentLang}`],
                item: `https://tashtiba.com/${currentLang}/product/${product.id}`,
              },
            ],
          },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="border flex justify-center items-center h-[600px] w-full border-gray-200 rounded-2xl overflow-hidden shadow-md">
            {selectedImage && (
              <Suspense
                fallback={
                  <img
                    src={selectedImage}
                    className="w-full h-full object-contain"
                    alt={product[`name_${currentLang}`]}
                    width="600"
                    height="600"
                  />
                }
              >
                <InnerImageZoom
                  src={selectedImage}
                  zoomSrc={selectedImage}
                  zoomType="hover"
                  zoomScale={1}
                  hasSpacer={true}
                  className="w-full h-full object-contain rounded-2xl"
                  height={600}
                  alt={product[`name_${currentLang}`]}
                />
              </Suspense>
            )}
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            {product.images?.slice(0, product.images.length).map((img, i) => (
              <div>
                <LazyImage
                  key={i}
                  src={img.image}
                  onClick={() => setSelectedImage(img.image)}
                  className={`w-16 h-16 rounded-lg border border-gray-200 object-cover cursor-pointer transition-transform duration-150 hover:scale-105 ${
                    selectedImage === img.image ? "ring-2 ring-brand-600" : ""
                  }`}
                  alt={product[`name_${currentLang}`]}
                  width={64}
                  height={64}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            {product[`name_${currentLang}`]}
          </h1>
          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
              }
            >
              <StarRatings
                rating={product.rate || 0}
                starDimension="18px"
                starSpacing="2px"
                starRatedColor="#fbbf24"
                numberOfStars={5}
                name="rating"
              />
            </Suspense>
            <span className="text-sm text-gray-500">
              ({product.review?.length || 0}{" "}
              {t("EndUserProductDetails:reviews")})
            </span>
          </div>
          {/* Description */}
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product[`description_${currentLang}`]}
          </p>
          {/* Price */}{" "}
          <div className="flex items-center gap-4 text-2xl font-semibold">
            {originalPrice && (
              <span className="line-through text-gray-400">
                {originalPrice} {t("Common:currency.egp")}
              </span>
            )}
            <span className={hasDiscount ? "text-brand-600" : "text-[#d62828]"}>
              {currentPrice} {t("Common:currency.egp")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>{t("EndUserProductDetails:category")}:</strong>{" "}
              {product.category?.[`name_${currentLang}`] ||
                t("EndUserProductDetails:uncategorized")}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={product.brand?.image}
                className="w-6 h-6 rounded-full object-cover"
                alt={product.brand?.[`name_${currentLang}`]}
                width={24}
                height={24}
              />
              <span>{product.brand?.[`name_${currentLang}`]}</span>
            </div>
            <div>
              {displayStock && Number(displayStock) > 0 ? (
                <>
                  <strong>{t("EndUserProductDetails:available")}:</strong>{" "}
                  {displayStock}{" "}
                  <strong>{t("EndUserProductDetails:inStock")}</strong>
                </>
              ) : (
                <strong>{t("EndUserProductDetails:outOfStock")}</strong>
              )}
            </div>
          </div>
          {/* Attributes */}
          {Array.isArray(product.attributes) &&
            product.attributes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  {t("EndUserProductDetails:specifications")}:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.attributes.map((attr, i) => (
                    <li key={i}>
                      <strong>{attr[`attribute_name_${currentLang}`]}:</strong>{" "}
                      {attr[`attribute_value_${currentLang}`]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {Array.isArray(product.variants) && product.variants.length > 0 && (
            <div className="py-3 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-[#d62828] rounded-full shadow-sm"></div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  {t("EndUserProductDetails:available_variant")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.variants.map((variant: any, i: number) => {
                  const isSelected = selectedVariant?.id === variant.id;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleVariantSelect(variant)}
                      className={`group relative flex flex-col p-4 border-2 rounded-xl text-start transition-all duration-300 ${
                        isSelected
                          ? "border-[#d62828] bg-red-50/30 ring-1 ring-[#d62828] translate-y-[-2px] shadow-md"
                          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-1 gap-2 items-center">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-black  ${
                            isSelected ? "text-[#d62828]" : "text-gray-400"
                          }`}
                        >
                          {variant[`variant_name_${lang}`]} {":"}
                        </span>
                        <span
                          className={`text-sm font-bold transition-colors ${
                            isSelected ? "text-[#d62828]" : "text-gray-700"
                          }`}
                        >
                          {variant[`variant_value_${lang}`]}
                        </span>
                      </div>
                      {variant.price && (
                        <div
                          className={`text-[11px] font-black mt-2 ${
                            isSelected ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {variant.discount_price || variant.price}{" "}
                          {t("Common:currency.egp")}
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-[#d62828] text-white rounded-full p-0.5 shadow-sm">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="4"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {product?.questions?.length > 0 && (
            <div className="py-3 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-[#d62828] rounded-full shadow-sm"></div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  {t("EndUserProductDetails:extraCharges")}
                </h3>
              </div>

              <div className="space-y-4">
                {product?.questions.map((qItem: any) => {
                  const q = qItem.question;
                  if (!q.answers?.length) return null;

                  return (
                    <div key={q.id} className="space-y-1">
                      <div className="flex items-center justify-between p-2 rounded-lg">
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          {q[`title_${lang}`]}
                          {q.is_required === 1 && (
                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                              {t("EndUserProductDetails:required")}
                            </span>
                          )}
                        </p>
                        {q.is_required === 1 && (
                          <span className="text-red-500 text-xs font-medium italic">
                            {t("EndUserProductDetails:requiredInfo")}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.answers.map((ans: any) => {
                          const isSelected =
                            selectedAnswers[q.id]?.id === ans.id;
                          return (
                            <button
                              key={ans.id}
                              type="button"
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...ans, question: q },
                                }))
                              }
                              className={`group relative flex flex-col p-4 border-2 rounded-xl text-start transition-all duration-300 ${
                                isSelected
                                  ? "border-[#d62828] bg-red-50/30 ring-1 ring-[#d62828] translate-y-[-2px] "
                                  : "border-gray-100 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div
                                className={`text-sm font-bold transition-colors ${
                                  isSelected
                                    ? "text-[#d62828]"
                                    : "text-gray-700"
                                }`}
                              >
                                {ans[`answer_${lang}`]}
                              </div>

                              {Number(ans.price_effect) > 0 && (
                                <div
                                  className={`text-xs font-black mt-2 inline-flex items-center gap-1 ${
                                    isSelected
                                      ? "text-red-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  <span className="opacity-70 text-[12px]">
                                    +
                                  </span>
                                  {ans.price_effect} {t("Common:currency.egp")}
                                </div>
                              )}

                              {isSelected && (
                                <div className="absolute top-2 left-2 bg-[#d62828] text-white rounded-full p-0.5 shadow-sm">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="4"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-red-300 text-black px-3 py-1 text-xs rounded-full"
                >
                  #{tag[`name_${currentLang}`]}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <div className="flex gap-3 mt-2 sm:mt-0">
              <button
                onClick={() => openModal("product", productToOpenInModal)}
                className="bg-[#d62828] text-white px-5 py-2 rounded-xl hover:bg-[#d62828]/90 transition"
              >
                {t("Common:Buttons.add_to_cart")}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`left-2 p-2 text-sm rounded-full z-10 transition flex items-center gap-2 ${
                  is_fav
                    ? "text-[#d62828] hover:text-[#d62828]/90"
                    : "text-gray-500 hover:text-[#d62828]"
                }`}
              >
                <MdOutlineFavoriteBorder />
                {is_fav
                  ? t("Common:Buttons.remove_from_favorites")
                  : t("Common:Buttons.add_to_favorites")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
