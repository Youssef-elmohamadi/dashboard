import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVendorById } from "../../../api/SuperAdminApi/vendors/_requests";

interface Document {
  id: number;
  vendor_id: number;
  document_name: string;
  document_type: number;
  status: string;
  created_at: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  documents: Document[];
}

const VendorDetails: React.FC = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await getVendorById(id as string);
        setVendor(res.data.data);
      } catch (err) {
        console.error("Error fetching vendor:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVendor();
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const documentTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return "National ID";
      case 2:
        return "Commercial Registration";
      default:
        return "Other";
    }
  };

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">
        No Vendor ID provided.
      </div>
    );
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading vendor details...
      </div>
    );
  if (!vendor)
    return (
      <div className="p-8 text-center text-gray-500">Vendor not found.</div>
    );

  return (
    <div className="vendor-details p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Vendor Details
      </h1>

      {/* Vendor Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {vendor.name}
          </p>
          <p>
            <strong>Email:</strong> {vendor.email}
          </p>
          <p>
            <strong>Phone:</strong> {vendor.phone}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {vendor.description || "No description"}
          </p>
        </div>
      </section>

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Created At:</strong> {formatDate(vendor.created_at)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatDate(vendor.updated_at)}
          </p>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Documents
        </h2>
        <div className="space-y-4">
          {vendor.documents.length > 0 ? (
            vendor.documents.map((doc) => (
              <div
                key={doc.id}
                className="border p-4 rounded-md shadow-sm bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  <p>
                    <strong>Type:</strong>{" "}
                    {documentTypeLabel(doc.document_type)}
                  </p>
                  <p>
                    <strong>Status:</strong> {doc.status}
                  </p>
                  <p>
                    <strong>File:</strong> {doc.document_name}
                  </p>
                  <p>
                    <strong>Uploaded At:</strong> {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No documents uploaded.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default VendorDetails;
