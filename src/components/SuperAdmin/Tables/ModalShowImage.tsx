import React, { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { useParams } from "react-router-dom";
import { getVendorById } from "../../../api/SuperAdminApi/Vendors/_requests";
const ModalShowImage = ({ showImageModal, setShowImageModal, doc }) => {
  const closeImageModal = () => {
    setShowImageModal(false);
  };
  const [vendor, setVendor] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await getVendorById(id as string);
        setVendor(res.data.data);
      } catch (err) {
        console.error("Error fetching vendor:", err);
      }
    };

    if (id) fetchVendor();
  }, [id]);

  const documentTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "Commercial Registration";
      case 2:
        return "Tax Registration Certificate";
      default:
        return "Other";
    }
  };

  return showImageModal && doc ? (
    <div
      onClick={closeImageModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[99999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
      >
        <div className="flex gap-3 py-4  border-b">
          <button
            onClick={closeImageModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            &times;
          </button>
          <div className="px-2">Document Details</div>
        </div>
        <div className=" p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Section */}
            <div className="w-full md:w-7/12 flex justify-center">
              <InnerImageZoom
                src={"/images/cards/card-01.jpg"}
                zoomSrc={"/images/cards/card-01.jpg"}
                zoomType="hover"
                zoomPreload={true}
                className="object-contain h-full rounded"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-5/12 text-gray-700 space-y-3">
              <p>
                <strong>Vendor Name:</strong> {vendor.name}
              </p>
              <p>
                <strong>Document Type:</strong>{" "}
                {documentTypeLabel(doc.document_type)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{doc.status}</span>
              </p>
              <p>
                <strong>Creation Date:</strong>{" "}
                {new Date(doc.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Update Date:</strong>{" "}
                {new Date(doc.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ModalShowImage;
