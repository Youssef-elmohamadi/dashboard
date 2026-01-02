import React, { useEffect, useState } from "react";
import Label from "../../../components/common/form/Label";
import Input from "../../../components/common/input/InputField";
import TextArea from "../../../components/common/input/TextArea";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useUpdateVendor,
  useVendorData,
} from "../../../hooks/Api/Admin/useVendor/useVendor";
import VendorEditSkeleton from "../../../components/admin/vendorSettings/VendorSettingsSkeleton";
import { Document, Vendor } from "../../../types/Vendor";
import { AxiosError } from "axios";
import useCheckOnline from "../../../hooks/useCheckOnline";
import PageStatusHandler, {
  PageStatus,
} from "../../../components/common/PageStatusHandler/PageStatusHandler";
import PageMeta from "../../../components/common/SEO/PageMeta";
import LazyImage from "../../../components/common/LazyImage";

const VendorEditPage: React.FC = () => {
  const documentTypeMap: Record<number, string> = {
    1: "validation.commercial_record",
    2: "validation.tax_record",
  };

  const initialVendorData: Vendor = {
    id: 0,
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

  const { t } = useTranslation(["UpdateVendor", "Meta"]);
  const [vendor, setVendor] = useState<Vendor>(initialVendorData);
  const [updatedDocs, setUpdatedDocs] = useState<Record<number, File | null>>(
    {}
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const {
    data: vendorResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useVendorData();
  const vendorData = vendorResponse?.data.data;
  const { mutateAsync: updateVendor } = useUpdateVendor();
  const isCurrentOnline = useCheckOnline();

  useEffect(() => {
    if (vendorData) {
      setVendor(vendorData);
    }
  }, [vendorData]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (!isCurrentOnline()) {
      toast.error(t("vendor.no_internet"));
      return;
    }

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
      await updateVendor(formData);
      toast.success(t("vendor.successUpdate"));
      setValidationErrors({});
    } catch (error) {
      console.error(error);
      toast.error(t("vendor.errorUpdate"));

      const axiosError = error as AxiosError<any>;
      const rawErrors = axiosError?.response?.data?.errors;
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

  const getPageStatus = () => {
    if (isLoading) return PageStatus.LOADING;
    if (isError) return PageStatus.ERROR;
    if (!vendorData) return PageStatus.NOT_FOUND;
    return PageStatus.SUCCESS;
  };

  const getErrorMessage = (): string | undefined => {
    if (isError) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401) {
        return t("unauthorized");
      }
      return t("somethingWentWrong");
    }
    return undefined;
  };

  const handleRetry = () => {
    refetch();
  };

  const pageStatus = getPageStatus();
  const errorMessage = getErrorMessage();

  return (
    <>
      <PageMeta
        title={t("Meta:vendorSettings.title")}
        description={t("Meta:vendorSettings.description")}
      />

      <PageStatusHandler
        status={pageStatus}
        LoadingComponent={VendorEditSkeleton}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      >
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t("vendor.edit_title")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>{t("vendor.name")}</Label>
                  <Input
                    type="text"
                    value={vendor?.name}
                    onChange={(e) => handleVendorChange("name", e.target.value)}
                  />
                  {clientErrors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {clientErrors.name}
                    </p>
                  )}
                  {validationErrors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("vendor.email")}</Label>
                  <Input
                    type="email"
                    value={vendor?.email}
                    onChange={(e) =>
                      handleVendorChange("email", e.target.value)
                    }
                  />
                  {clientErrors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {clientErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("vendor.phone")}</Label>
                  <Input
                    type="text"
                    value={vendor?.phone}
                    onChange={(e) =>
                      handleVendorChange("phone", e.target.value)
                    }
                  />
                  {clientErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {clientErrors.phone}
                    </p>
                  )}
                  {validationErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.phone[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("vendor.description")}</Label>
                  <TextArea
                    value={vendor?.description || ""}
                    onChange={(value) =>
                      handleVendorChange("description", value)
                    }
                  />
                  {clientErrors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {clientErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-700" />

            <div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                {t("vendor.documents_title")}
              </h3>
              <div className="grid gap-6">
                {vendor?.documents?.map((doc: Document) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <p className="text-lg font-medium dark:text-white mb-1">
                          {t(
                            documentTypeMap[doc.document_type] ||
                              `vendor.document_${doc.document_type}`
                          )}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            doc.status === "approved"
                              ? "text-green-600"
                              : doc.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {t(`vendor.status_${doc.status}`)}
                        </p>

                        {doc.status !== "approved" &&
                          doc.status !== "pending" && (
                            <div className="mt-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    doc.id,
                                    e.target.files ? e.target.files[0] : null
                                  )
                                }
                                className="block w-full text-sm text-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                              />
                              {updatedDocs[doc.id] && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {t("vendor.selected_file")}:{" "}
                                    {updatedDocs[doc.id]?.name}
                                  </p>
                                  <LazyImage
                                    src={URL.createObjectURL(
                                      updatedDocs[doc.id]!
                                    )}
                                    alt="preview"
                                    className="mt-2 w-full max-w-xs rounded-lg border border-gray-200 dark:border-gray-600"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                        {doc.status === "approved" && (
                          <p className="mt-2 text-sm text-gray-500">
                            {t("vendor.cannot_edit_approved")}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:w-64">
                        <LazyImage
                          src={doc.document_name}
                          alt="document"
                          className="rounded-lg border border-gray-200 dark:border-gray-600 object-contain max-h-64 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                {t("vendor.save_changes")}
              </button>
            </div>
          </form>
        </div>
      </PageStatusHandler>
    </>
  );
};

export default VendorEditPage;
