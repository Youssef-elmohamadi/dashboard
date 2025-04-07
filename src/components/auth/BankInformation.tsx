import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
type Props = {
  dataForm: {
    bankInfo: {
      phone: string;
    };
  },
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};
const BankInformation = ({ dataForm, handleChange }: Props) => {
  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          Basic Information
        </h1>
      </div>
      <div className="">
        <Label>
          Phone<span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder="Enter your phone"
          value={dataForm.bankInfo.phone}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default BankInformation;
