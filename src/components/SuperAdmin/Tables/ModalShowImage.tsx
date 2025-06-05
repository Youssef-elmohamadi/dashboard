import { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { useParams } from "react-router-dom";
import { getVendorById } from "../../../api/SuperAdminApi/Vendors/_requests";
import Badge from "../../ui/badge/Badge";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";

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

const ModalShowImage = ({ showImageModal, setShowImageModal, doc }: any) => {
  const closeImageModal = () => {
    setShowImageModal(false);
  };
  const { t } = useTranslation(["VendorsTable"]);
  const { dir } = useDirectionAndLanguage();
  const [vendor, setVendor] = useState<Vendor>();
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

  const documentTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return t("vendorsPage.details.documentTypes.1");
      case 2:
        return t("vendorsPage.details.documentTypes.2");
      default:
        return t("vendorsPage.details.documentTypes.default");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "light";
    }
  };

  return showImageModal && doc ? (
    <div
      onClick={closeImageModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-[99999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
      >
        <div className="flex gap-3 py-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={closeImageModal}
            className={`absolute top-3 ${
              dir === "rtl" ? "left-3" : "right-3"
            } text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-2xl font-bold`}
          >
            &times;
          </button>
          <div className="px-2 text-lg font-semibold text-gray-800 dark:text-white">
            {t("vendorsPage.details.modal.title")}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image Section */}
            <div className="w-full md:w-7/12 flex justify-center">
              <InnerImageZoom
                src={doc?.document_name}
                zoomSrc={doc?.document_name}
                zoomType="hover"
                zoomPreload={true}
                className="object-contain h-full rounded"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-5/12 space-y-3 text-gray-700 dark:text-gray-200">
              <p>
                <strong>{t("vendorsPage.details.modal.vendorName")}</strong>{" "}
                {vendor?.name}
              </p>
              <p>
                <strong>{t("vendorsPage.details.modal.documentType")}</strong>{" "}
                {documentTypeLabel(doc.document_type)}
              </p>
              <p className="flex items-center gap-2">
                <strong>{t("vendorsPage.details.modal.status")}</strong>
                <Badge
                  variant="light"
                  size="sm"
                  color={getStatusBadgeColor(doc.status)}
                >
                  {t(`vendorsPage.details.documentStatus.${doc.status}`)}
                </Badge>
              </p>
              <p>
                <strong>{t("vendorsPage.details.modal.createdAt")}</strong>{" "}
                {new Date(doc.created_at).toLocaleString()}
              </p>
              <p>
                <strong>{t("vendorsPage.details.modal.updatedAt")}</strong>{" "}
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
