import { useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useTranslation } from "react-i18next";
type Props = {
  dataForm: {
    bankInfo: {
      phone: string;
    };
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string
  ) => void;
};
const BankInformation = ({ dataForm, handleChange }: Props) => {
  const { t } = useTranslation("Signup");
  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          {t("bankInformation.stepTwoHeading")}
        </h1>
      </div>
      <div className="">
        <Label>
          {t("bankInformation.phone")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder={t("bankInformation.placeholder.phone")}
          value={dataForm.bankInfo.phone}
          onChange={(e) => handleChange(e, "bankInfo")}
        />
      </div>
    </div>
  );
};

export default BankInformation;
