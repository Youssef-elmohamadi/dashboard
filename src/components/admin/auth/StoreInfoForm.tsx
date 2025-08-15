import {
  ClientErrors,
  DocumentInfo,
  HandleChangeFn,
  HandleFileChangeFn,
  ServerErrors,
  VendorInfo,
} from "../../../types/Auth";
import Input from "../../common/input/InputField";
import Label from "../../common/form/Label";
import ImageUploader from "./ImageUploader";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type Props = {
  vendorInfo: VendorInfo;
  documentInfo: DocumentInfo[];
  handleFileChange: HandleFileChangeFn;
  clientErrors: ClientErrors;
  handleChange: HandleChangeFn;
  serverErrors: ServerErrors;
  inputRefs?: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
};

const StoreInfoForm = ({
  documentInfo,
  vendorInfo,
  handleFileChange,
  clientErrors,
  handleChange,
  serverErrors,
  inputRefs,
}: Props) => {
  const { t } = useTranslation(["auth"]);
  useEffect(() => {
    const focusOnError = (errors: Record<string, any>) => {
      const clientErrorKey = Object.keys(clientErrors)[0];
      if (clientErrorKey) {
        const ref = inputRefs?.current[clientErrorKey];
        ref?.focus();
        return;
      }
      if (Object.keys(serverErrors.errors).length > 0) {
        const serverErrorKey = Object.keys(serverErrors.errors)[0];
        const fieldName = serverErrorKey.split(".").pop();
        if (fieldName) {
          const ref = inputRefs?.current[fieldName];
          ref?.focus();
        }
      }
    };

    focusOnError({ ...clientErrors, ...serverErrors.errors });
  }, [clientErrors, serverErrors, inputRefs]);
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
          ref={(el) => {
            if (inputRefs?.current) {
              inputRefs.current["name"] = el;
            }
          }}
        />
        {clientErrors.name && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.name}</p>
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
          ref={(el) => {
            if (inputRefs?.current) {
              inputRefs.current["email"] = el;
            }
          }}
        />
        {clientErrors.email && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.email}</p>
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
          ref={(el) => {
            if (inputRefs?.current) {
              inputRefs.current["phone"] = el;
            }
          }}
        />
        {clientErrors.phone && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.phone}</p>
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
            {clientErrors.commercialRegisterDocument}
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
            {clientErrors.taxRegisterDocument}
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
