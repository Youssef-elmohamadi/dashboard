import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllCategories,
  getCategoryById,
} from "../../../api/SuperAdminApi/Categories/_requests";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  parent_id: number | null;
  status: string;
  order: number;
  commission_rate: number;
  appears_in_website: string;
  created_at: string | null;
  updated_at: string | null;
  category?: any;
}

const CategoryDetails: React.FC = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id as string);
        setCategory(res.data.data.original);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data.data.original);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">
        No Category ID provided.
      </div>
    );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading category details...
      </div>
    );

  if (!category)
    return (
      <div className="p-8 text-center text-gray-500">Category not found.</div>
    );

  return (
    <div className="category-details p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Category Details
      </h1>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {category.name}
          </p>
          <p>
            <strong>Description:</strong> {category.description}
          </p>
          <p>
            <strong>Commission Rate:</strong> {category.commission_rate}%
          </p>
          <p>
            <strong>Order:</strong> {category.order}
          </p>
          <p>
            <strong>Status:</strong> {category.status}
          </p>
          <p>
            <strong>Appears on Website:</strong>{" "}
            {category.appears_in_website === "yes" ? "Yes" : "No"}
          </p>
          <p>
            <strong>Parent ID:</strong>{" "}
            {category.parent_id
              ? categories?.find((cat) => cat.id === category.parent_id)
                  ?.name || "Unknown"
              : "None"}
          </p>
        </div>
      </section>

      {/* Image */}
      {category.image && (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Category Image
          </h2>
          <div className="w-full flex justify-center">
            <img
              src={category.image}
              alt={category.name}
              className="max-w-xs h-auto rounded-lg shadow-md"
            />
          </div>
        </section>
      )}

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Timestamps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Created At:</strong> {formatDate(category.created_at)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatDate(category.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetails;
