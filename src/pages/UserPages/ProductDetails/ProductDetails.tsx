import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showProduct } from "../../../api/EndUserApi/ensUserProducts/_requests";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  brand: {
    name: string;
    image: string;
  };
  images: string[];
};

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await showProduct(id);
        console.log(response.data.data);
        setProduct(response?.data?.data); // تأكد أن البيانات في response.data
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center py-10">Loading Product Details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={
                product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.png"
              }
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {product.images.length > 0 ? (
              product.images
                .slice(0, 5)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`preview-${index}`}
                    className="w-16 h-16 object-cover border rounded cursor-pointer"
                  />
                ))
            ) : (
              <span className="text-gray-400 text-sm">No Extra Images</span>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>

          <div className="text-xl text-purple-600 font-semibold">
            {product.price.toFixed(2)} EGP
          </div>

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
              ({product.stock_quantity} Avilable)
            </span>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">
              Add To Cart
            </button>
            <button className="border border-purple-700 text-purple-700 px-6 py-2 rounded hover:bg-purple-50 transition">
              Buy Now
            </button>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <img
              src={product.brand?.image}
              alt={product.brand?.name}
              className="w-12 h-12 object-contain"
            />
            <span className="text-sm text-gray-600">{product.brand?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
