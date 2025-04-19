import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showProduct } from "../../../api/products/_requests";

type Category = {
  id: number;
  name: string;
  description: string;
};

type Brand = {
  id: number;
  name: string;
  status: string;
  image: string;
};

type Product = {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  status: string;
  is_featured: number;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
  category: Category;
  brand: Brand;
  attributes: any[];
  images: string[];
  tags: string[];
  variants: any[];
};

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();
  const { id }: any = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await showProduct(id);
        setProduct(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (!id) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        No product data available.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        Loading product details...
      </div>
    );
  }
  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        No product found.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Product Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-5 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <p>
            <strong>Vendor ID:</strong> {product.vendor_id}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Slug:</strong> {product.slug}
          </p>
          <p>
            <strong>Price:</strong> {product.price} EGP
          </p>
          <p>
            <strong>Discount:</strong> {product.discount_price ?? "N/A"}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock_quantity}
          </p>
          <p>
            <strong>Status:</strong> {product.status}
          </p>
          <p>
            <strong>Featured:</strong> {product.is_featured ? "Yes" : "No"}
          </p>
          <p>
            <strong>Rating:</strong> {product.rating ?? "N/A"}
          </p>
          <p>
            <strong>Views:</strong> {product.views_count ?? "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {product.category?.name}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand?.name}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(product.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(product.updated_at).toLocaleString()}
          </p>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Description:
          </strong>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {product.description || "No description"}
          </p>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">Tags:</strong>
          <ul className="list-disc pl-6 mt-1 text-gray-600 dark:text-gray-400">
            {product.tags.length > 0 ? (
              product.tags.map((tag, i) => <li key={i}>{tag.name}</li>)
            ) : (
              <li>No tags</li>
            )}
          </ul>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Attributes:
          </strong>
          <ul className="list-disc pl-6 mt-1 text-gray-600 dark:text-gray-400">
            {product.attributes.length > 0 ? (
              product.attributes.map((attr, i) => (
                <li key={i}>
                  {attr.attribute_name}: {attr.attribute_value}
                </li>
              ))
            ) : (
              <li>No attributes</li>
            )}
          </ul>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">Images:</strong>
          <div className="flex flex-wrap gap-3 mt-2">
            {product.images.length > 0 ? (
              product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Product ${i + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
