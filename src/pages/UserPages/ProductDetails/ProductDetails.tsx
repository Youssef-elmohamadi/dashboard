// ProductDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdCompareArrows, MdOutlineFavoriteBorder } from "react-icons/md";
import InnerImageZoom from "react-inner-image-zoom";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useModal } from "../Context/ModalContext";
import { useGetProductById } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { Helmet } from "react-helmet-async";
import { Product } from "../../../types/Product";
import SEO from "../../../components/common/seo";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  // useEffect(() => {
  //   if (!lang || (lang !== "ar" && lang !== "en")) {
  //     navigate("/en", { replace: true });
  //     return;
  //   }

  //   i18n.changeLanguage(lang);
  //   setLang(lang);
  //   setDir(lang === "ar" ? "rtl" : "ltr");
  // }, [lang]);

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center my-5">
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <SEO
        title={{
          ar: `تاشتيبا - ${product.name}`,
          en: `Tashtiba - ${product.name}`,
        }}
        description={{
          ar: `اكتشف منتجات مذهلة على تاشتيبا - تسوق إلكترونيات، أزياء، أثاث ومنتجات منزلية بسهولة وأمان من أفضل البائعين في مصر.`,
          en: `Shop amazing products at Tashtiba — your online destination for electronics, fashion, furniture, and home goods. Safe and easy shopping across Egypt.`,
        }}
        keywords={{
          ar: [
            "تاشتيبا",
            "الكترونيات",
            "ملابس",
            "أزياء",
            "أثاث",
            "مطبخ",
            "عناية شخصية",
            "موبايلات",
            "أحذية",
            "شنط",
            "سوق مصر",
            "توصيل سريع",
            // ...(dynamicKeywords || [])
          ],
          en: [
            "tashtiba",
            "electronics",
            "fashion",
            "furniture",
            "home appliances",
            "mobiles",
            "kitchen",
            "bags",
            "shoes",
            "online shopping Egypt",
            "fast delivery",
            // ...(dynamicKeywords || [])
          ],
        }}
        // --- ADD THIS SECTION FOR HREFLANG ---
        alternates={[
          { lang: "ar", href: "https://tashtiba.vercel.app/ar" }, // Replace with your actual Arabic URL
          { lang: "en", href: "https://tashtiba.vercel.app/en" }, // Replace with your actual English URL
          // You can also add an x-default if you have a default language page, for example:
          // { lang: "x-default", href: "https://tashtiba.vercel.app/en" },
        ]}
        // --- END OF HREFLANG SECTION ---
      />
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Product Image + Thumbnails */}
        <div>
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-md">
            {selectedImage && (
              <InnerImageZoom
                src={selectedImage}
                className="w-full h-[350px] object-contain"
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
                  selectedImage === img.image ? "ring-2 ring-purple-600" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
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
                <span className="text-purple-600">
                  {product.discount_price.toFixed(2)} {t("egp")}
                </span>
              </>
            ) : (
              <span className="text-purple-600">
                {Number(product.price).toFixed(2)} {t("egp")}
              </span>
            )}
          </div>

          {/* Meta Info */}
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

          {/* Tags */}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 px-3 py-1 text-xs rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Quantity & Buttons */}
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
                className="bg-purple-700 text-white px-5 py-2 rounded-xl hover:bg-purple-800 transition"
              >
                {t("addToCart")}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`left-2 p-2 text-sm rounded-full z-10 transition flex items-center gap-2 ${
                  is_fav
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                <MdOutlineFavoriteBorder />
                {is_fav ? t("removeFromWishlist") : t("addToWishlist")}
              </button>
            </div>
          </div>

          {/* Wishlist & Compare */}
          <div className="flex gap-6 pt-4 text-gray-500 text-sm">
            <button className="flex items-center gap-1 hover:text-purple-600 transition">
              <MdCompareArrows />
              {t("addToCompare")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
