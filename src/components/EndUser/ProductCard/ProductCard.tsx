import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineStarBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";

import { useTranslation } from "react-i18next";
import { useFavoriteProducts } from "../../../hooks/Api/EndUser/useFavoriteProducts";
import { Product } from "../../../types/Product";

interface LazyImage {
  src: string;
  alt: string;
  className: string;
}
interface ProductCardProps {
  product: Product;
}
const LazyImage = ({ src, alt, className }: LazyImage) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={ref}
      className={`w-full h-full ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      }`}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { openModal } = useModal();
  const { t } = useTranslation(["EndUserProductCard"]);
  const { addToFavorite, removeFromFavorite } = useFavoriteProducts(product.id);

  const isFav = product?.is_fav;

  return (
    <div className="w-full border border-gray-200 rounded p-3 relative">
      <div className="w-full h-[300px]">
        <LazyImage
          src={product?.images[0]?.image}
          alt={product?.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <button
        onClick={isFav ? removeFromFavorite : addToFavorite}
        className={`absolute top-2 left-2 bg-transparent p-2 rounded-full transition ${
          isFav ? "text-red-500" : "text-gray-300 hover:text-red-500"
        }`}
      >
        <FaHeart className="text-xl" />
      </button>

      <Link
        to={`/product/${product.id}`}
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

export default ProductCard;
