import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import InnerImageZoom from "react-inner-image-zoom";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useModal } from "../../../components/EndUser/context/ModalContext";
import { useGetProductById } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import SEO from "../../../components/common/SEO/seo";
import { Product } from "../../../types/Product";

type ProductParams = {
  id: string;
  lang: "ar" | "en" | undefined;
};

const ProductDetails: React.FC = () => {
  const { id, lang } = useParams<ProductParams>();
  const currentLang = (lang as "ar" | "en") || "ar";
  const numericId = Number(id);
  const { t } = useTranslation(["EndUserProductDetails"]);
  const { openModal } = useModal();

  const { data, isLoading: isProductLoading } = useGetProductById(numericId);
  const product: Product | undefined = data?.data?.data;

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [is_fav, setIs_fav] = useState<boolean>(false);
  // const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].image);
    }
    if (typeof product?.is_fav === "boolean") {
      setIs_fav(product.is_fav);
    }
  }, [product]);

  const { mutateAsync: addToFavorite } = useAddFavorite();
  const { mutateAsync: removeFromFavorite } = useRemoveFavorite();

  const handleToggleFavorite = async () => {
    if (!product) return;
    try {
      if (is_fav) {
        await removeFromFavorite(product.id);
        setIs_fav(false);
        toast.success(t("successRemoveFromFav"));
      } else {
        await addToFavorite(product.id);
        setIs_fav(true);
        toast.success(t("successAddedToFav"));
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(t("noAuth"));
      } else {
        toast.error(t("favError"));
      }
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center my-5 h-[535px]">
        <Circles height="80" width="80" color="#d62828" ariaLabel="loading" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-600 py-10">
        {t("productNotFound")}
      </div>
    );
  }
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
      product[`name_${currentLang}`] || t("defaultProductName");
    const productDescription = product[`description_${currentLang}`] || "";

    const productPrice = product.discount_price
      ? Number(product.discount_price).toFixed(2)
      : Number(product.price).toFixed(2);

    const currency = t("egp");
    const categoryName =
      product.category?.[`name_${currentLang}`] || t("uncategorized");
    const brandName =
      product.brand?.[`name_${currentLang}`] || t("unknownBrand");

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
      return `اكتشف ${productName} من تشطيبة (${categoryName} - ${brandName}) بسعر ${productPrice} ${currency}. ${
        productDescription ? productDescription + " " : ""
      }${specs ? "المواصفات: " + specs + "." : ""}`;
    } else {
      return `Discover ${productName} from Tashtiba (${categoryName} - ${brandName}) at ${productPrice} ${currency}. ${
        productDescription ? productDescription + " " : ""
      }${specs ? "Specifications: " + specs + "." : ""}`;
    }
  };

  const productStructuredData = {
    "@type": "Product",
    name: product[`name_${currentLang}`],
    image:
      product.images?.length === 1
        ? product.images[0].image
        : product.images?.map((img) => img.image) || [],
    description: product[`description_${currentLang}`] || "",
    sku: product.id.toString(),
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand?.[`name_${currentLang}`],
      logo: product.brand?.image,
    },
    category: product.category?.[`name_${currentLang}`],
    offers: {
      "@type": "Offer",
      url: `https://tashtiba.com/${currentLang}/product/${product.id}`,
      priceCurrency: "EGP",
      price: product.discount_price
        ? product.discount_price.toFixed(2)
        : product.price.toFixed(2),
      availability:
        product.stock_quantity && product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.vendor?.name || "Tashtiba",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rate || 0,
      reviewCount: product.review?.length || 0,
    },
  };

  // Merge WebPage + Product locally (only here)
  const structuredData = {
    "@type": "WebPage",
    url: `https://tashtiba.com/${currentLang}/product/${product.id}`,
    inLanguage: currentLang,
    mainEntity: productStructuredData,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <SEO
        title={{
          ar: `${product[`name_${currentLang}`]} | سعر ومواصفات`,
          en: `${product[`name_${currentLang}`]} | Price & Specs`,
        }}
        description={{
          ar: generateDescription(),
          en: generateDescription(),
        }}
        keywords={{
          ar: generateKeywords(),
          en: generateKeywords(),
        }}
        url={`https://tashtiba.com/${currentLang}/product/${product.id}`}
        image={product.images?.[0]?.image || "https://tashtiba.com/og-image.png"}
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
        structuredData={structuredData}
        lang={currentLang}
      />
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="border flex justify-center items-center h-[500px] w-full border-gray-200 rounded-2xl overflow-hidden shadow-md">
            {selectedImage && (
              <InnerImageZoom
                src={selectedImage}
                zoomSrc={selectedImage}
                zoomType="hover"
                zoomScale={1}
                // width={600}
                // height={400}
                hasSpacer={true}
                className="w-full h-full object-contain rounded-2xl"
              />
            )}
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            {product.images?.slice(0, product.images.length).map((img, i) => (
              <img
                key={i}
                src={img.image}
                onClick={() => setSelectedImage(img.image)}
                className={`w-16 h-16 rounded-lg border border-gray-200 object-cover cursor-pointer transition-transform duration-150 hover:scale-105 ${
                  selectedImage === img.image ? "ring-2 ring-brand-600" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {product[`name_${currentLang}`]}
          </h1>

          <div className="flex items-center gap-2">
            <StarRatings
              rating={product.rate || 0}
              starDimension="18px"
              starSpacing="2px"
              starRatedColor="#fbbf24"
              numberOfStars={5}
              name="rating"
            />
            <span className="text-sm text-gray-500">
              ({product.review?.length || 0} {t("reviews")})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product[`description_${currentLang}`]}
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 text-2xl font-semibold">
            {product.discount_price ? (
              <>
                <span className="line-through text-gray-400">
                  {Number(product.price).toFixed(2)} {t("egp")}
                </span>
                <span className="text-brand-600">
                  {Number(product.discount_price).toFixed(2)} {t("egp")}
                </span>
              </>
            ) : (
              <span className="text-[#d62828]">
                {Number(product.price).toFixed(2)} {t("egp")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            {/* <div>
              <strong>{t("store")}:</strong> {product.vendor?.name || "-"}
            </div> */}
            <div>
              <strong>{t("category")}:</strong>{" "}
              {product.category?.[`name_${currentLang}`] || t("uncategorized")}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={product.brand?.image}
                className="w-6 h-6 rounded-full object-cover"
                alt={product.brand?.[`name_${currentLang}`]}
              />
              <span>{product.brand?.[`name_${currentLang}`]}</span>
            </div>
            <div>
              {product?.stock_quantity && Number(product.stock_quantity) > 0 ? (
                <>
                  <strong>{t("available")}:</strong> {product.stock_quantity}{" "}
                  <strong>{t("inStock")}</strong>
                </>
              ) : (
                <strong>{t("outOfStock")}</strong>
              )}
            </div>
          </div>

          {/* Attributes */}
          {Array.isArray(product.attributes) &&
            product.attributes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  {t("specifications")}:
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
                onClick={() => openModal("product", product)}
                className="bg-[#d62828] text-white px-5 py-2 rounded-xl hover:bg-[#d62828]/90 transition"
              >
                {t("addToCart")}
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
                {is_fav ? t("removeFromWishlist") : t("addToWishlist")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
