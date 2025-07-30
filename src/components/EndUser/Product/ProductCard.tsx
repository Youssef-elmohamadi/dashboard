import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineStarBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useModal } from "../context/ModalContext";
import { useTranslation } from "react-i18next";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { Product } from "../../../types/Product";
import { toast } from "react-toastify";
import LazyImage from "../../common/LazyImage";

interface ProductCardProps {
  product: Product;
  loadingPriority?: "eager" | "lazy";
}

const ProductCard = ({
  product,
  loadingPriority = "lazy",
}: ProductCardProps) => {
  const { openModal } = useModal();
  const { t } = useTranslation("EndUserProductCard");
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
      ? `صورة منتج ${product.name} تشطيبة`
      : `Product image for ${product.name} Tashtiba`;

  return (
    <div className="w-full border border-gray-200 rounded p-3 relative">
      <div className="w-full h-[300px]">
        <LazyImage
          src={product?.images[0]?.image}
          alt={altText}
          className="w-full h-full object-cover rounded"
          loading={loadingPriority}
          fetchPriority={loadingPriority === "eager" ? "high" : undefined}
        />
      </div>

      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 left-2 bg-transparent p-2 rounded-full transition ${
          is_fav ? "text-red-500" : "text-gray-300 hover:text-red-500"
        }`}
      >
        <FaHeart className="text-xl" />
      </button>

      <Link
        to={`/${lang}/product/${product.id}`}
        className="text-base my-2 px-1 block font-medium line-clamp-2"
      >
        {product.name}
      </Link>

      <div className="flex justify-between items-center gap-2 border-t border-gray-200 py-3">
        <span className="text-primary font-semibold text-sm sm:text-base">
          {product.price} {t("egp")}
        </span>

        <div className="flex items-center gap-1">
          <StarRatings
            rating={product.rating || 0}
            starDimension="17px"
            starSpacing="1px"
            starRatedColor="#fbbf24"
            numberOfStars={5}
            name="rating"
            starEmptyIcon={<MdOutlineStarBorder />}
            starHalfIcon={<TbStarHalfFilled />}
            starFullIcon={<BsFillStarFill />}
          />
        </div>
      </div>

      <button
        onClick={() => openModal("product", product)}
        className="w-full bg-primary text-white rounded px-3 py-2 text-sm sm:text-base hover:bg-primary/90 transition"
      >
        {t("addToCart")}
      </button>
    </div>
  );
};

export default React.memo(ProductCard);
