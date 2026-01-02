import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import { useTranslation } from "react-i18next";
import { BasicInfoFormProps } from "../../../types/Auth";

function BasicInfoForm({
  adminInfo,
  handleChange,
  clientErrors,
  serverErrors,
  inputRefs,
}: BasicInfoFormProps) {
  const [showPassword, setShowPassword] = useState(false);
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
    <div>
      <div className="mb-6">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          {t("basicInformation.stepOneHeading")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-5">
        <div>
          <Label>
            {t("basicInformation.firstName")}
            <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="first_name"
            name="first_name"
            placeholder={t("basicInformation.placeholder.firstName")}
            value={adminInfo.first_name}
            onChange={(e) => handleChange(e, "adminInfo")}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["first_name"] = el;
              }
            }}
          />
          {clientErrors.first_name && (
            <p className="text-error-500 text-xs mt-1">
              {clientErrors.first_name}
            </p>
          )}
        </div>

        <div>
          <Label>
            {t("basicInformation.lastName")}
            <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="lname"
            name="last_name"
            placeholder={t("basicInformation.placeholder.lastName")}
            value={adminInfo.last_name}
            onChange={(e) => handleChange(e, "adminInfo")}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["last_name"] = el;
              }
            }}
          />
          {clientErrors.last_name && (
            <p className="text-error-500 text-xs mt-1">
              {clientErrors.last_name}
            </p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <Label>
          {t("basicInformation.phone")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder={t("basicInformation.placeholder.phone")}
          value={adminInfo.phone}
          onChange={(e) => handleChange(e, "adminInfo")}
          ref={(el) => {
            if (inputRefs?.current) {
              inputRefs.current["phone"] = el;
            }
          }}
        />

        {clientErrors.phone && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.phone}</p>
        )}
        {serverErrors.errors["adminInfo.phone"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.adminPhoneTaken")}
          </p>
        )}
      </div>

      <div className="mb-5">
        <Label>
          {t("basicInformation.email")}
          <span className="text-error-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder={t("basicInformation.placeholder.email")}
          value={adminInfo.email}
          onChange={(e) => handleChange(e, "adminInfo")}
          ref={(el) => {
            if (inputRefs?.current) {
              inputRefs.current["email"] = el;
            }
          }}
        />
        {clientErrors.email && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.email}</p>
        )}
        {serverErrors.errors["adminInfo.email"] && (
          <p className="text-error-500 text-xs mt-1">
            {t("errors.adminEmailTaken")}
          </p>
        )}
      </div>

      <div className="mb-5">
        <Label>
          {t("basicInformation.password")}
          <span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("basicInformation.placeholder.password")}
            name="password"
            value={adminInfo.password}
            onChange={(e) => handleChange(e, "adminInfo")}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["password"] = el;
              }
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
              document.documentElement.dir === "rtl" ? "left-4" : "right-4"
            }`}
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </span>
        </div>
        {clientErrors.password && (
          <p className="text-error-500 text-xs mt-1">{clientErrors.password}</p>
        )}
      </div>

      <div>
        <Label>
          {t("basicInformation.confirmPassword")}
          <span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("basicInformation.placeholder.confirmPassword")}
            value={adminInfo.confirm_password}
            name="confirm_password"
            onChange={(e) => handleChange(e, "adminInfo")}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["confirm_password"] = el;
              }
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
              document.documentElement.dir === "rtl" ? "left-4" : "right-4"
            }`}
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </span>
        </div>
        {clientErrors.confirm_password && (
          <p className="text-error-500 text-xs mt-1">
            {clientErrors.confirm_password}
          </p>
        )}
      </div>
    </div>
  );
}

export default BasicInfoForm;
