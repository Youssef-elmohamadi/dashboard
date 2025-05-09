import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showProduct } from "../../../api/AdminApi/products/_requests";

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
  images: any[];
  tags: any[];
  vendor?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["ProductDetails"]);
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        {t("no_data")}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        {t("loading")}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        {t("not_found")}
      </div>
    );
  }

  return (
    <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        {t("title")}
      </h1>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("sections.basic_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>{t("fields.name")}:</strong> {product.name}
          </p>
          <p>
            <strong>{t("fields.slug")}:</strong> {product.slug}
          </p>
          <p>
            <strong>{t("fields.description")}:</strong> {product.description}
          </p>
          <p>
            <strong>{t("fields.status")}:</strong> {product.status}
          </p>
          <p>
            <strong>{t("fields.featured")}:</strong>{" "}
            {product.is_featured ? t("yes") : t("no")}
          </p>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("sections.pricing_stock")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>{t("fields.price")}:</strong> {product.price} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.discount_price")}:</strong>{" "}
            {product.discount_price} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.stock_quantity")}:</strong>{" "}
            {product.stock_quantity}
          </p>
        </div>
      </section>

      {/* Category & Brand */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("sections.category_brand")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>{t("fields.category")}:</strong> {product.category?.name}
          </p>
          <p>
            <strong>{t("fields.brand")}:</strong> {product.brand?.name}
          </p>
        </div>
      </section>

      {/* Attributes */}
      {product.attributes?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            {t("sections.attributes")}
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

      {/* Tags */}
      {product.tags?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            {t("sections.tags")}
          </h2>
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

      {/* Images */}
      {product.images?.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            {t("sections.images")}
          </h2>
          <div className="flex flex-wrap gap-4">
            {product.images.map((img: any) => (
              <img
                key={img.id}
                src={img.image}
                alt="Product"
                className="w-32 h-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </section>
      )}

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("sections.timestamps")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>{t("fields.created_at")}:</strong>{" "}
            {formatDate(product.created_at)}
          </p>
          <p>
            <strong>{t("fields.updated_at")}:</strong>{" "}
            {formatDate(product.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
