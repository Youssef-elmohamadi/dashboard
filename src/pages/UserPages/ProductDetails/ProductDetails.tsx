import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdCompareArrows, MdOutlineFavoriteBorder } from "react-icons/md";
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

const ProductDetails: React.FC = () => {
  const { id, lang } = useParams<{ id: string; lang?: string }>();
  const numericId = Number(id);
  const { t } = useTranslation(["EndUserProductDetails"]);
  const { openModal } = useModal();

  const { data, isLoading: isProductLoading } = useGetProductById(numericId);
  const product: Product | undefined = data?.data?.data;

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [is_fav, setIs_fav] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

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
      lang === "ar"
        ? ["تشطيبة", "تسوق أونلاين", "منتجات", "مصر", "أفضل عروض"]
        : ["tashtiba", "online shopping", "products", "Egypt", "best deals"];

    const productSpecificKeywords = [];

    if (product.name) {
      productSpecificKeywords.push(product.name);
    }
    if (product.category?.name) {
      productSpecificKeywords.push(product.category.name);
    }
    if (product.brand?.name) {
      productSpecificKeywords.push(product.brand.name);
    }
    if (Array.isArray(product.tags) && product.tags.length > 0) {
      product.tags.forEach((tag) => productSpecificKeywords.push(tag.name));
    }
    if (product.name) {
      productSpecificKeywords.push(
        `${product.name} ${lang === "ar" ? "سعر" : "price"}`
      );
      productSpecificKeywords.push(
        `${lang === "ar" ? "اشترِ" : "buy"} ${product.name}`
      );
    }

    return [...new Set([...baseKeywords, ...productSpecificKeywords])];
  };

  const generateDescription = () => {
    const productName = product.name || t("defaultProductName");
    const productPrice = product.discount_price
      ? product.discount_price.toFixed(2)
      : Number(product.price).toFixed(2);
    const currency = t("egp");
    const categoryName = product.category?.name || t("uncategorized");
    const brandName = product.brand?.name || t("unknownBrand");

    if (lang === "ar") {
      return `تسوق ${productName} من تشطيبة في مصر. اكتشف أفضل العروض، المواصفات (${categoryName}, ${brandName})، والسعر ${productPrice} ${currency}. اطلب الآن واستمتع بتجربة تسوق فريدة.`;
    } else {
      return `Shop ${productName} from Tashtiba in Egypt. Find best deals, specifications (${categoryName}, ${brandName}), and price ${productPrice} ${currency}. Order now for a unique shopping experience.`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <SEO
        title={{
          ar: ` ${product.name} | سعر ومواصفات`,
          en: `${product.name} | Price & Specs`,
        }}
        description={{
          ar: generateDescription(),
          en: generateDescription(),
        }}
        keywords={{
          ar: generateKeywords(),
          en: generateKeywords(),
        }}
        url={`https://tashtiba.com/${lang}/product/${product.id}`}
        image="https://tashtiba.com/og-image.png"
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
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/product/${product.id}`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
      />
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="border min-h-[400px] border-gray-200 rounded-2xl overflow-hidden shadow-md">
            {selectedImage && (
              <InnerImageZoom
                src={selectedImage}
                className="w-full h-[400px] object-contain"
              />
            )}
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            {product.images?.slice(0, 5).map((img, i) => (
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
            {product.name}
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
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="flex items-center gap-4 text-2xl font-semibold">
            {product.discount_price ? (
              <>
                <span className="line-through text-gray-400">
                  {Number(product.price).toFixed(2)} {t("egp")}
                </span>
                <span className="text-brand-600">
                  {product.discount_price.toFixed(2)} {t("egp")}
                </span>
              </>
            ) : (
              <span className="text-[#d62828]">
                {Number(product.price).toFixed(2)} {t("egp")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>{t("store")}:</strong> {product.vendor?.name || "-"}
            </div>
            <div>
              <strong>{t("category")}:</strong>{" "}
              {product.category?.name || t("uncategorized")}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={product.brand?.image}
                className="w-6 h-6 rounded-full object-cover"
                alt={product.brand?.name}
              />
              <span>{product.brand?.name}</span>
            </div>
            <div>
              <strong>{t("stock")}:</strong> {product.stock_quantity} {t("pcs")}
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
                      <strong>{attr.attribute_name}:</strong>{" "}
                      {attr.attribute_value}
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
                  className="bg-purple-100 text-[#d62828] px-3 py-1 text-xs rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                {t("quantity")}:
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-center"
              />
            </div>

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

          {/* Wishlist & Compare */}
          <div className="flex gap-6 pt-4 text-gray-500 text-sm">
            <button className="flex items-center gap-1 hover:text-[#d62828] transition">
              <MdCompareArrows />
              {t("addToCompare")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
