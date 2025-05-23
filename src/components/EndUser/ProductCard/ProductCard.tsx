import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineStarBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToFavorite,
  removeFromFavorite,
} from "../../../api/EndUserApi/ensUserProducts/_requests";
import { useTranslation } from "react-i18next";

interface LazyImage {
  src: string;
  alt: string;
  className: string;
}
interface ProductImage {
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  images: ProductImage[];
  rating: number;
  is_fav?: boolean;
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
  const isFav = product?.is_fav;
  const queryClient = useQueryClient();
  const { t } = useTranslation(["EndUserProductCard"]);
  const mutationAddToFavorite = useMutation({
    mutationFn: () => addToFavorite(product.id),
    onSuccess: () => {
      // homePage
      queryClient.setQueryData(["homePage"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          leatestProducts: old.leatestProducts.map((p: any) =>
            p.id === product.id ? { ...p, is_fav: true } : p
          ),
        };
      });

      // product-categories
      queryClient.setQueryData(["product-categories"], (old: any) => {
        if (!old) return old;
        return old.map((cat: any) => ({
          ...cat,
          products: cat.products.map((p: any) =>
            p.id === product.id ? { ...p, is_fav: true } : p
          ),
        }));
      });

      // endUserProducts
      queryClient.setQueriesData(
        { queryKey: ["endUserProducts"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((p: any) =>
                p.id === product.id ? { ...p, is_fav: true } : p
              ),
            })),
          };
        }
      );

      // endUserAllProducts
      queryClient.setQueriesData(
        { queryKey: ["endUserAllProducts"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((p: any) =>
                p.id === product.id ? { ...p, is_fav: true } : p
              ),
            })),
          };
        }
      );

      toast.success(t("successAddedToFav"));
    },

    onError: (error) => {
      if (error?.response?.status === 401) {
        toast.error(t("noAuth"));
      } else {
        toast.error(t("fieldAddedToFav"));
      }
    },
  });
  const mutationRemoveFromFavorite = useMutation({
    mutationFn: () => removeFromFavorite(product.id),
    onSuccess: () => {
      // homePage
      queryClient.setQueryData(["homePage"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          leatestProducts: old.leatestProducts.map((p: any) =>
            p.id === product.id ? { ...p, is_fav: false } : p
          ),
        };
      });

      // product-categories
      queryClient.setQueryData(["product-categories"], (old: any) => {
        if (!old) return old;
        return old.map((cat: any) => ({
          ...cat,
          products: cat.products.map((p: any) =>
            p.id === product.id ? { ...p, is_fav: false } : p
          ),
        }));
      });

      // endUserProducts
      queryClient.setQueriesData(
        { queryKey: ["endUserProducts"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((p: any) =>
                p.id === product.id ? { ...p, is_fav: false } : p
              ),
            })),
          };
        }
      );

      // endUserAllProducts
      queryClient.setQueriesData(
        { queryKey: ["endUserAllProducts"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((p: any) =>
                p.id === product.id ? { ...p, is_fav: false } : p
              ),
            })),
          };
        }
      );

      toast.success(t("successRemoveFromFav"));
    },

    onError: (error) => {
      if (error?.response?.status === 401) {
        toast.error(t("noAuth"));
      } else {
        toast.error(t("fieldRemoveFromFav"));
      }
    },
  });

  const handleAddToFavorite = () => {
    mutationAddToFavorite.mutate();
  };
  const handleRemoveFromFavorite = () => {
    mutationRemoveFromFavorite.mutate();
  };

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
        onClick={isFav ? handleRemoveFromFavorite : handleAddToFavorite}
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
            rating={product.rate || 0}
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
