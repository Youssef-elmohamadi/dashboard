import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/SuperAdminApi/Products/_requests";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">
        No Product ID provided.
      </div>
    );
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading product details...
      </div>
    );
  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Product not found.</div>
    );

  return (
    <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Product Details
      </h1>

      {/* Section 1: Basic Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Slug:</strong> {product.slug}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Status:</strong> {product.status}
          </p>
          <p>
            <strong>Featured:</strong> {product.is_featured ? "Yes" : "No"}
          </p>
        </div>
      </section>

      {/* Section 2: Pricing & Stock */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Pricing & Stock
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Price:</strong> {product.price} EGP
          </p>
          <p>
            <strong>Discount Price:</strong> {product.discount_price} EGP
          </p>
          <p>
            <strong>Stock Quantity:</strong> {product.stock_quantity}
          </p>
        </div>
      </section>

      {/* Section 3: Category & Brand */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Category & Brand
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Category:</strong> {product.category?.name}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand?.name}
          </p>
        </div>
      </section>

      {/* Section 4: Vendor */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">
          Vendor Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {product.vendor?.name}
          </p>
          <p>
            <strong>Email:</strong> {product.vendor?.email}
          </p>
          <p>
            <strong>Phone:</strong> {product.vendor?.phone}
          </p>
        </div>
      </section>

      {/* Section 5: Attributes */}
      {product.attributes?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Attributes
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {product.attributes.map((attr: any) => (
              <li key={attr.id}>
                <strong>{attr.attribute_name}:</strong> {attr.attribute_value}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section 6: Tags */}
      {product.tags?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Section 7: Images */}
      {product.images?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Images</h2>
          <div className="flex flex-wrap gap-4">
            {product.images.map((img: any) => (
              <img
                key={img.id}
                src={img.image}
                alt="Product Image"
                className="w-32 h-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 8: Dates */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Timestamps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Created At:</strong> {formatDate(product.created_at)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatDate(product.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
