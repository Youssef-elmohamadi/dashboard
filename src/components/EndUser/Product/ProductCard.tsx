import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useModal } from "../context/ModalContext";
import { useTranslation } from "react-i18next";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { Product } from "../../../types/Product";
import { toast } from "react-toastify";
import LazyImage from "../../common/LazyImage";
import StarIcon from "../../../icons/StarIcon";
import HeartIcon from "../../../icons/HeartIcon";

interface ProductCardProps {
  product: Product;
  loadingPriority?: "eager" | "lazy";
}

const ProductCard = ({
  product,
  loadingPriority = "lazy",
}: ProductCardProps) => {
  const { openModal } = useModal();
  const { t } = useTranslation("EndUserProductCard", {
    useSuspense: false,
  });
  const [is_fav, setIs_fav] = useState<boolean | undefined>(product?.is_fav);
  const { lang } = useParams();
  const { mutateAsync: addToFavorite } = useAddFavorite();
  const { mutateAsync: removeFromFavorite } = useRemoveFavorite();

  const handleToggleFavorite = async () => {
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

  const altText =
    lang === "ar"
      ? `صورة منتج ${product["name_ar"]} تشطيبة`
      : `Product image for ${product["name_en"]} Tashtiba`;

  const hasDiscount =
    product.discount_price && product.discount_price < product.price;

  return (
    <div className="w-full border border-gray-200 rounded p-3 relative min-h-[490px] max-h-[550px]">
      <div className="w-full h-[300px]">
        <LazyImage
          src={product?.images[0]?.image}
          alt={altText}
          className="w-full h-full object-cover rounded cursor-pointer"
          loading={loadingPriority}
          fetchPriority={loadingPriority === "eager" ? "high" : undefined}
          onClick={() => openModal("product", product)}
        />
      </div>

      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 left-2 bg-transparent p-2 rounded-full transition ${
          is_fav
            ? "end-user-text-base"
            : "text-gray-300 hover:end-user-text-base"
        }`}
      >
        <HeartIcon className="w-6" />
      </button>

      {hasDiscount && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 p-2 rounded-full">
          {Math.round(
            ((product.price - product.discount_price) / product.price) * 100
          )}
          % {t("sale")}
        </span>
      )}

      <Link
        to={`/${lang}/product/${product.id}`}
        className="end-user-text-secondary my-2 px-1 block font-medium truncate "
      >
        {product[`name_${lang}`]}
      </Link>

      <div className="flex flex-col justify-between items-start gap-2 border-t border-gray-200 py-3">
        {hasDiscount ? (
          <div className="flex items-center gap-2">
            <span className="end-user-text-base font-semibold text-base sm:text-lg">
              {product.discount_price} {t("Common:currency.egp")}
            </span>
            <span className="text-gray-900 line-through font-medium text-xs sm:text-sm">
              {product.price} {t("Common:currency.egp")}
            </span>
          </div>
        ) : (
          <span className="end-user-text-base font-semibold text-base sm:text-lg">
            {product.price} {t("Common:currency.egp")}
          </span>
        )}

        <div className="flex items-center gap-1">
          <StarRatings
            rating={product.rating || 0}
            starDimension="17px"
            starSpacing="1px"
            starRatedColor="#fbbf24"
            numberOfStars={5}
            name="rating"
            starEmptyIcon={<StarIcon />}
            starFullIcon={<StarIcon fill="#fbbf24" />}
          />
        </div>
      </div>

      <button
        onClick={() => openModal("product", product)}
        className="w-full end-user-bg-base text-white rounded px-3 py-2 text-sm sm:text-base hover:bg-primary/90 transition"
      >
        {t("Common:Buttons.add_to_cart")}
      </button>
    </div>
  );
};

export default React.memo(ProductCard);
