import { useState } from "react";
import Label from "../form/Label";
import ImageUploader from "./ImageUploader";
type Props = {
  commercialDoc: File | null;
  taxCardDoc: File | null;
  handleFileChange: (
    file: File | null,
    field: "commercialRegisterDoc" | "taxCardDoc"
) => void;
};

const StoreInfoForm = ({
  commercialDoc,
  taxCardDoc,
  handleFileChange,
}: Props) => {
  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          Basic Information
        </h1>
      </div>
      <div>
        <Label>
          commercial Register Document<span className="text-error-500">*</span>
        </Label>
        <ImageUploader
          file={commercialDoc}
          setFile={(file) => handleFileChange(file, "commercialRegisterDoc")}
          field="commercialRegisterDoc"
        />
      </div>
      <div>
        <Label>
          TAX Card Document<span className="text-error-500">*</span>
        </Label>
        <ImageUploader
          file={taxCardDoc}
          setFile={(file) => handleFileChange(file, "taxCardDoc")}
          field="taxCardDoc"
        />
      </div>
    </div>
  );
};

export default StoreInfoForm;
