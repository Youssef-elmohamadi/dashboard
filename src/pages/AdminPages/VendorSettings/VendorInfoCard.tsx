import React, { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import {
  updateVendor,
  getVendor,
} from "../../../api/AdminApi/VendorSettingApi/_requests";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Vendor {
  name: string;
  email: string;
  phone: string;
  description: string | null;
  status: string;
  is_verified: number;
  created_at: string;
  updated_at: string;
  documents: VendorDocument[];
}

interface VendorDocument {
  id: number;
  vendor_id: number;
  document_name: string;
  document_type: number;
  status: "approved" | "pending" | "rejected";
}

const documentTypeMap: Record<number, string> = {
  1: "validation.commercial_record",
  2: "validation.tax_record",
};

const initialVendorData: Vendor = {
  name: "",
  email: "",
  phone: "",
  description: "",
  status: "",
  is_verified: 0,
  created_at: "",
  updated_at: "",
  documents: [],
};

const VendorEditPage: React.FC = () => {
  const { t } = useTranslation(["UpdateVendor"]);
  const [vendor, setVendor] = useState<Vendor>(initialVendorData);
  const [updatedDocs, setUpdatedDocs] = useState<Record<number, File | null>>(
    {}
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!vendor.name) newErrors.name = t("validation.name");
    if (!vendor.phone) newErrors.phone = t("validation.phone");
    if (!vendor.email) newErrors.email = t("validation.email");
    if (!vendor.description)
      newErrors.description = t("validation.description");
    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVendorChange = (field: keyof Vendor, value: string) => {
    setVendor({ ...vendor, [field]: value });
  };

  const handleFileChange = (docId: number, file: File | null) => {
    setUpdatedDocs((prev) => ({ ...prev, [docId]: file }));
  };

  const fetchVendor = async () => {
    const res = await getVendor();
    setVendor(res.data.data);
  };
  useEffect(() => {
    fetchVendor();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("vendorInfo[email]", vendor.email);
    formData.append("vendorInfo[name]", vendor.name);
    formData.append("vendorInfo[phone]", vendor.phone);
    formData.append("vendorInfo[description]", vendor.description || "");

    let index = 0;
    vendor.documents.forEach((doc) => {
      const file = updatedDocs[doc.id];
      if (file) {
        formData.append(`documentInfo[${index}][document_file]`, file);
        formData.append(
          `documentInfo[${index}][document_type]`,
          doc.document_type.toString()
        );
        index++;
      }
    });

    try {
      const res = await updateVendor(formData);
      fetchVendor();
      toast.success(t("vendor.successUpdate"));
    } catch (error: any) {
      toast.error(t("vendor.errorUpdate"));
      console.error("Error updating vendor:", error);
      const rawErrors = error?.response?.data?.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });
        setValidationErrors(formattedErrors);
      } else {
        setValidationErrors({ general: [t("errors.general")] });
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        {t("vendor.edit_title")}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t("vendor.name")}</Label>
            <Input
              type="text"
              value={vendor.name}
              onChange={(e) => handleVendorChange("name", e.target.value)}
            />
            {clientErrors.name && (
              <p className="text-red-600 text-sm">{clientErrors.name}</p>
            )}
          </div>

          <div>
            <Label>{t("vendor.email")}</Label>
            <Input
              type="email"
              value={vendor.email}
              onChange={(e) => handleVendorChange("email", e.target.value)}
            />
            {clientErrors.email && (
              <p className="text-red-600 text-sm">{clientErrors.email}</p>
            )}
          </div>

          <div>
            <Label>{t("vendor.phone")}</Label>
            <Input
              type="text"
              value={vendor.phone}
              onChange={(e) => handleVendorChange("phone", e.target.value)}
            />
            {clientErrors.phone && (
              <p className="text-red-600 text-sm">{clientErrors.phone}</p>
            )}
          </div>

          <div>
            <Label>{t("vendor.description")}</Label>
            <TextArea
              value={vendor.description || ""}
              onChange={(value) => handleVendorChange("description", value)}
            />
            {clientErrors.description && (
              <p className="text-red-600 text-sm">{clientErrors.description}</p>
            )}
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-xl font-semibold mb-4 dark:text-white">
            {t("vendor.documents_title")}
          </h3>
          <div className="space-y-6">
            {vendor.documents.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 p-4 rounded bg-gray-50 flex flex-col md:flex-row gap-4 items-start dark:bg-gray-900"
              >
                <div className="flex-1 space-y-1">
                  <p className="font-medium dark:text-white">
                    {t(
                      documentTypeMap[doc.document_type] ||
                        `vendor.document_${doc.document_type}`
                    )}
                  </p>
                  <p
                    className={`text-sm ${
                      doc.status === "approved"
                        ? "text-green-600"
                        : doc.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {t(`vendor.status_${doc.status}`)}
                  </p>

                  {doc.status !== "approved" && doc.status !== "pending" && (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            doc.id,
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="dark:text-white"
                      />
                      {updatedDocs[doc.id] && (
                        <>
                          <p className="text-sm text-gray-600 mt-1">
                            {t("vendor.selected_file")}:{" "}
                            {updatedDocs[doc.id]?.name}
                          </p>
                          <img
                            src={URL.createObjectURL(updatedDocs[doc.id]!)}
                            alt="preview"
                            className="w-full max-w-xs h-auto object-contain mt-2 rounded border border-gray-200 dark:text-white"
                          />
                        </>
                      )}
                    </div>
                  )}

                  {doc.status === "approved" && (
                    <p className="mt-2 text-gray-500">
                      {t("vendor.cannot_edit_approved")}
                    </p>
                  )}
                </div>
                <div>
                  <img
                    src={doc.document_name}
                    alt="document"
                    className="w-full max-w-xs h-auto object-contain rounded border border-gray-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {t("vendor.save_changes")}
        </button>
      </form>
    </div>
  );
};

export default VendorEditPage;
