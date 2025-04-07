import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

type Props = {
  dataForm: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
};
function BasicInfoForm({ dataForm, handleChange, errors }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-5">
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-sm text-gray-800 dark:text-white/90 sm:text-title-md">
          Basic Information
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* <!-- First Name --> */}
        <div className="sm:col-span-1">
          <Label>
            First Name<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter your first name"
            value={dataForm.first_name}
            onChange={handleChange}
          />
          {errors.first_name && (
            <p className="text-error-500 text-xs mt-1">{errors.first_name}</p>
          )}
        </div>
        {/* <!-- Last Name --> */}
        <div className="sm:col-span-1">
          <Label>
            Last Name<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="lname"
            name="last_name"
            placeholder="Enter your last name"
            value={dataForm.last_name}
            onChange={handleChange}
          />
          {errors.last_name && (
            <p className="text-error-500 text-xs mt-1">{errors.last_name}</p>
          )}
        </div>
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
          value={dataForm.phone}
          onChange={handleChange}
        />
        {errors.phone && (
          <p className="text-error-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      {/* <!-- Email --> */}
      <div>
        <Label>
          Email<span className="text-error-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={dataForm.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-error-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <Label>
          Password<span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={dataForm.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-error-500 text-xs mt-1">{errors.password}</p>
          )}
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
      </div>

      <div>
        <Label>
          Confirm Password<span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={dataForm.confirm_password}
            name="confirm_password"
            onChange={handleChange}
          />
          {errors.confirm_password && (
            <p className="text-error-500 text-xs mt-1">
              {errors.confirm_password}
            </p>
          )}
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
