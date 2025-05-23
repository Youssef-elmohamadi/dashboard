// ProductDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addToFavorite,
  removeFromFavorite,
  showProduct,
} from "../../../api/EndUserApi/ensUserProducts/_requests";
import StarRatings from "react-star-ratings";
import { MdCompareArrows, MdOutlineFavoriteBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import InnerImageZoom from "react-inner-image-zoom";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useModal } from "../Context/ModalContext";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  rate?: number;
  brand: { name: string; image: string };
  vendor?: { name: string };
  category?: { name: string };
  is_fav?: boolean;
  attributes?: { attribute_name: string; attribute_value: string }[];
  tags?: { name: string }[];
  review?: { rating: number; review: string }[];
  images: { image: string }[];
};

const ProductDetails: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();
  const { t } = useTranslation(["EndUserProductDetails"]);
  const { openModal } = useModal();
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["productData", id],
    queryFn: async () => {
      const res = await showProduct(id);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  const isFav = product?.is_fav;

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].image);
    }
  }, [product]);
  const queryClient = useQueryClient();
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
      // productData
      queryClient.setQueryData(["productData", id], (old: any) => {
        if (!old) return old;
        return old.id === product.id ? { ...old, is_fav: true } : old;
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

      queryClient.setQueryData(["productData", id], (old: any) => {
        if (!old) return old;
        return old.id === product.id ? { ...old, is_fav: false } : old;
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

  if (isProductLoading)
    return (
      <div className="flex justify-center items-center my-5">
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Product Image + Thumbnails */}
        <div>
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-md">
            <InnerImageZoom
              src={selectedImage}
              zoomSrc={selectedImage}
              zoomType="hover"
              className="w-full h-[350px] object-contain"
            />
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            {product.images.slice(0, 5).map((img, i) => (
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
              starEmptyIcon={<MdOutlineFavoriteBorder />}
              starHalfIcon={<TbStarHalfFilled />}
              starFullIcon={<BsFillStarFill />}
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
                  {product.price.toFixed(2)} {t("egp")}
                </span>
                <span className="text-purple-600">
                  {product.discount_price.toFixed(2)}
                  {t("egp")}
                </span>
              </>
            ) : (
              <span className="text-purple-600">
                {product.price.toFixed(2)} {t("egp")}
              </span>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>{t("store")}:</strong> {product.vendor?.name}
            </div>
            <div>
              <strong>{t("category")}:</strong> {product.category?.name}
              {/*"|| "Uncategorized"" */}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={product.brand?.image}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{product.brand?.name}</span>
            </div>
            <div>
              <strong>{t("store")}:</strong> {product.stock_quantity}{" "}
              {t("store")}
            </div>
          </div>

          {/* Attributes */}
          {product.attributes?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">
                {t("specifications")}:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {product.attributes?.map((attr, i) => (
                  <li key={i}>
                    <strong>{attr.attribute_name}:</strong>{" "}
                    {attr.attribute_value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {product.tags?.map((tag, i) => (
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
                defaultValue={1}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-center"
              />
            </div>

            <div className="flex gap-3 mt-2 sm:mt-0">
              <button  onClick={() => openModal("product", product)}
              className="bg-purple-700 text-white px-5 py-2 rounded-xl hover:bg-purple-800 transition">
                {t("addToCart")}
              </button>
              <button
                onClick={isFav ? handleRemoveFromFavorite : handleAddToFavorite}
                className={`left-2 p-2 text-sm rounded-full z-10 transition flex items-center gap-2 ${
                  isFav
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                <MdOutlineFavoriteBorder />
                {t("addToWishlist")}
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
