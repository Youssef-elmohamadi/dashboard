import {
  ClientErrors,
  DocumentInfo,
  HandleChangeFn,
  HandleFileChangeFn,
  ServerErrors,
  VendorInfo,
} from "../../../types/Auth";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import ImageUploader from "./ImageUploader";
import { useTranslation } from "react-i18next";

type Props = {
  vendorInfo: VendorInfo;
  documentInfo: DocumentInfo[];
  handleFileChange: HandleFileChangeFn;
  clientErrors: ClientErrors;
  handleChange: HandleChangeFn;
  serverErrors: ServerErrors;
};

const StoreInfoForm = ({
  documentInfo,
  vendorInfo,
  handleFileChange,
  clientErrors,
  handleChange,
  serverErrors,
}: Props) => {
  const { t } = useTranslation(["auth"]);

  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          {t("storeInformation.stepThreeHeading")}
        </h1>
      </div>
      <div className="">
        <Label>
          {t("storeInformation.storeName")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder={t("storeInformation.placeholder.storeName")}
          value={vendorInfo.name}
          onChange={(e) => handleChange(e, "vendorInfo")}
        />
        {clientErrors.storeName && (
          <p className="text-error-500 text-xs mt-1">
            {clientErrors.storeName}
          </p>
        )}
      </div>
      <div>
        <Label>
          {t("storeInformation.storeEmail")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder={t("storeInformation.placeholder.storeEmail")}
          value={vendorInfo.email}
          onChange={(e) => handleChange(e, "vendorInfo")}
        />
        {clientErrors.storeEmail && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.storeEmailError")}
          </p>
        )}
        {serverErrors.errors["vendorInfo.email"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.storeEmailTaken")}
          </p>
        )}
      </div>
      <div className="">
        <Label>
          {t("storeInformation.phone")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder={t("storeInformation.placeholder.phone")}
          value={vendorInfo.phone}
          onChange={(e) => handleChange(e, "vendorInfo")}
        />
        {clientErrors.storePhone && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.storePhoneError")}
          </p>
        )}
        {serverErrors.errors["vendorInfo.phone"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.storePhoneTaken")}
          </p>
        )}
      </div>
      <div>
        <Label>
          {t("storeInformation.commercialRegisterDoc")}
          <span className="text-error-500">*</span>
        </Label>
        <ImageUploader
          file={documentInfo[0]?.document_file ?? null}
          file_type={documentInfo[0]?.document_type ?? ""}
          field="commercialRegisterDoc"
          onFileChange={handleFileChange}
        />
        {clientErrors.commercialRegisterDocument && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.commercialRegisterDocumentError")}
          </p>
        )}
        {serverErrors.errors["documentInfo.0.document_file"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.invalidDocument")}
          </p>
        )}
      </div>

      <div>
        <Label>
          {t("storeInformation.taxRegisterDoc")}
          <span className="text-error-500">*</span>
        </Label>
        <ImageUploader
          file={documentInfo[1]?.document_file ?? null}
          file_type={documentInfo[1]?.document_type ?? ""}
          field="taxRegisterDoc"
          onFileChange={handleFileChange}
        />
        {clientErrors.taxRegisterDocument && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.taxRegisterDocumentError")}
          </p>
        )}
        {serverErrors.errors["documentInfo.1.document_file"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.invalidDocument")}
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreInfoForm;
