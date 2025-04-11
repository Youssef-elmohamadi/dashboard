import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useTranslation } from "react-i18next";
type Props = {
  adminInfo: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string
  ) => void;
  errors: { [key: string]: string };
};
function BasicInfoForm({ adminInfo, handleChange, errors }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation("Signup");

  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          {t("basicInformation.stepOneHeading")}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* <!-- First Name --> */}
        <div className="sm:col-span-1">
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
          />
          {errors.firstName && (
            <p className="text-error-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        {/* <!-- Last Name --> */}
        <div className="sm:col-span-1">
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
          />
          {errors.lastName && (
            <p className="text-error-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div className="">
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
        />
        {errors.phoneAdmin && (
          <p className="text-error-500 text-xs mt-1">{errors.phoneAdmin}</p>
        )}
      </div>
      {/* <!-- Email --> */}
      <div>
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
        />
        {errors.emailAdmin && (
          <p className="text-error-500 text-xs mt-1">{errors.emailAdmin}</p>
        )}
      </div>
      <div>
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
          />
          {errors.password && (
            <p className="text-error-500 text-xs mt-1">{errors.password}</p>
          )}
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
          />
          {errors.confirm_password && (
            <p className="text-error-500 text-xs mt-1">
              {errors.confirm_password}
            </p>
          )}
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
      </div>
    </div>
  );
}
export default BasicInfoForm;

{
  /* <!-- Password --> */
}
{
  /* <div>
            <Label>
              Password<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div> */
}
{
  /* <!-- Checkbox --> */
}
{
  /* <div className="flex items-center gap-3">
            <Checkbox
              className="w-5 h-5"
              checked={isChecked}
              onChange={setIsChecked}
            />
            <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
              By creating an account means you agree to the{" "}
              <span className="text-gray-800 dark:text-white/90">
                Terms and Conditions,
              </span>{" "}
              and our{" "}
              <span className="text-gray-800 dark:text-white">
                Privacy Policy
              </span>
            </p>
          </div> */
}
{
  /* <!-- Button --> */
}
