import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { openChangeStatusModal } from "../Tables/ChangeStatusModal";
import ModalShowImage from "../Tables/ModalShowImage";
import {
  useChangeDocumentStatus,
  useGetVendorById,
} from "../../../hooks/Api/SuperAdmin/useVendorMangement/useSuperAdminVendorManage";

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
  const { t } = useTranslation(["VendorsTable"]);
  const [showImage, setShowImage] = useState(false);
  const [doc, setDoc] = useState({});

  const { data: vendorData, isLoading: loading } = useGetVendorById(id!!);

  const vendor: Vendor = vendorData?.data.data;

  const handleOpenImage = (doc: {}) => {
    setDoc(doc);
    setShowImage(true);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const documentTypeLabel = (type: number) =>
    t(`vendorsPage.details.documentTypes.${type}`) ??
    t("vendorsPage.details.documentTypes.default");

  const getStatus = (docId: number) => {
    const document = vendor?.documents.find(
      (doc: Document) => doc.id === docId
    );
    return document?.status || "";
  };

  console.log(vendor?.documents[0]);

  const { mutateAsync: changeStatusTS } = useChangeDocumentStatus();

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus,
      changeStatus: async (id, data) => {
        return await changeStatusTS({ id, data });
      },
      options: {
        Pending: t("vendorsPage.status.pending"),
        Approved: t("vendorsPage.status.approved"),
        Rejected: t("vendorsPage.status.rejected"),
      },
      Texts: {
        title: t("vendorsPage.changeStatus.title"),
        inputPlaceholder: t("vendorsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("vendorsPage.changeStatus.errorSelect"),
        success: t("vendorsPage.changeStatus.success"),
        noChangeMessage: t("vendorsPage.changeStatus.noChangeMessage"),
        errorResponse: t("vendorsPage.changeStatus.errorResponse"),
        confirmButtonText: t("vendorsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("vendorsPage.changeStatus.cancelButtonText"),
      },
    });
  };

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("vendorsPage.details.noId")}
      </div>
    );
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("vendorsPage.details.loading")}
      </div>
    );
  if (!vendor)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("vendorsPage.details.notFound")}
      </div>
    );

  return (
    <>
      <ModalShowImage
        showImageModal={showImage}
        setShowImageModal={setShowImage}
        doc={doc}
      />
      <div className="vendor-details p-6 max-w-5xl mx-auto space-y-8 text-gray-800 dark:text-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6">
          {t("vendorsPage.details.pageTitle")}
        </h1>

        {/* Vendor Info */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
            {t("vendorsPage.details.basicInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>{t("vendorsPage.details.name")}:</strong> {vendor.name}
            </p>
            <p>
              <strong>{t("vendorsPage.details.email")}:</strong> {vendor.email}
            </p>
            <p>
              <strong>{t("vendorsPage.details.phone")}:</strong> {vendor.phone}
            </p>
            <p>
              <strong>{t("vendorsPage.details.description")}:</strong>{" "}
              {vendor.description || t("vendorsPage.details.noDescription")}
            </p>
          </div>
        </section>

        {/* Dates */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t("vendorsPage.details.dates")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>{t("vendorsPage.details.createdAt")}:</strong>{" "}
              {formatDate(vendor.created_at)}
            </p>
            <p>
              <strong>{t("vendorsPage.details.updatedAt")}:</strong>{" "}
              {formatDate(vendor.updated_at)}
            </p>
          </div>
        </section>

        {/* Documents */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">
            {t("vendorsPage.details.documents")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vendor.documents.length > 0 ? (
              vendor.documents.map((doc: Document) => (
                <div
                  key={doc.id}
                  onClick={() => handleOpenImage(doc)}
                  className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={doc.document_name}
                    alt={documentTypeLabel(doc.document_type)}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <div className="text-center space-y-1">
                    <p className="font-semibold">
                      {documentTypeLabel(doc.document_type)}
                    </p>
                    <p className="text-sm">
                      {t("vendorsPage.details.status")}:
                      {t(`vendorsPage.status.${doc.status.toLowerCase()}`)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeStatus(doc.id);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                      {t("vendorsPage.details.changeStatusBtn")}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {t("vendorsPage.details.noDocuments")}
              </p>
            )}
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={() =>
                window.open(
                  `http://127.0.0.1:8000/api/superAdmin/vendors/downloadVendorData/${vendor.id}`,
                  "_blank"
                )
              }
              className="block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              {t("vendorsPage.details.downloadPdfBtn")}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendorDetails;
