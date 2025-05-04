import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrandById } from "../../../api/AdminApi/brandsApi/_requests";

interface Brand {
  id: number;
  name: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await getBrandById(id as string);
        setBrand(res.data.data);
      } catch (error) {
        console.error("Error fetching brand:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBrand();
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">No Brand ID provided.</div>
    );
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading brand details...
      </div>
    );
  if (!brand)
    return (
      <div className="p-8 text-center text-gray-500">Brand not found.</div>
    );

  return (
    <div className="brand-details p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Brand Details
      </h1>

      {/* Brand Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Basic Info</h2>
        <div className="grid grid-cols-1 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {brand.name}
          </p>
          <p>
            <strong>Status:</strong> {brand.status}
          </p>
        </div>
      </section>

      {/* Image */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Brand Image
        </h2>
        {brand.image ? (
          <img
            src={brand.image}
            alt={brand.name}
            className="w-64 h-64 object-contain rounded-lg border"
          />
        ) : (
          <p className="text-gray-500">No image available.</p>
        )}
      </section>

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Creation Date:</strong> {formatDate(brand.created_at)}
          </p>
          <p>
            <strong>Updated Date:</strong> {formatDate(brand.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BrandDetails;
