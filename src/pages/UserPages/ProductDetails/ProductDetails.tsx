import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showProduct } from "../../../api/EndUserApi/ensUserProducts/_requests";
import StarRatings from "react-star-ratings";
import {
  MdCompareArrows,
  MdOutlineFavoriteBorder,
  MdOutlineStarBorder,
} from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import InnerImageZoom from "react-inner-image-zoom";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  rating?: number;
  brand: {
    name: string;
    image: string;
  };
  vendor?: {
    name: string;
  };
  images: {
    image: string;
  }[];
};

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await showProduct(id);
        setProduct(response?.data?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0].image);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-10">Loading Product Details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Preview Section */}
        <div className="lg:w-1/2">
          <div className="h-[450px] w-full flex justify-center">
            <InnerImageZoom
              src={selectedImage || "/images/product/default.jpg"}
              zoomSrc={selectedImage}
              zoomType="hover"
              zoomPreload={false}
              className="object-contain h-full rounded w-full"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {product.images.length > 0 ? (
              product.images
                .slice(0, 5)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt={`preview-${index}`}
                    onClick={() => setSelectedImage(img.image)}
                    className={`w-16 h-16 object-cover border rounded cursor-pointer ${
                      selectedImage === img.image ? "border-purple-500" : ""
                    }`}
                  />
                ))
            ) : (
              <span className="text-gray-400 text-sm">No Extra Images</span>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:w-1/2 space-y-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>

          {/* Rating */}
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

          {/* Favorite & Compare */}
          <div className="flex gap-4 items-center">
            <button className="flex gap-1 items-center text-gray-500 hover:text-black transition-all">
              <span className="text-sm">Add To Favorite</span>
              <MdOutlineFavoriteBorder />
            </button>
            <button className="flex gap-1 items-center text-gray-500 hover:text-black transition">
              <span className="text-sm">Add To Compare</span>
              <MdCompareArrows />
            </button>
          </div>

          {/* Store Name */}
          <div className="flex gap-3 items-center">
            <div className="text-sm text-gray-500">Store Name:</div>
            <div>{product.vendor?.name || "N/A"}</div>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={product.brand?.image}
                alt={product.brand?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">{product.brand?.name}</span>
          </div>

          {/* Price */}
          <div className="text-xl font-semibold">
            {product.discount_price ? (
              <div className="flex gap-2 items-center">
                <span className="text-gray-400 line-through">
                  {product.price.toFixed(2)} EGP
                </span>
                <span className="text-purple-600">
                  {product.discount_price.toFixed(2)} EGP
                </span>
              </div>
            ) : (
              <span className="text-purple-600">
                {product.price.toFixed(2)} EGP
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span>Quantity:</span>
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={product.stock_quantity}
              className="w-16 border rounded text-center"
            />
            <span className="text-sm text-gray-500">
              ({product.stock_quantity} Available)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">
              Add To Cart
            </button>
            <button className="border border-purple-700 text-purple-700 px-6 py-2 rounded hover:bg-purple-50 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
