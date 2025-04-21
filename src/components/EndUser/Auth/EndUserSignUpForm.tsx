import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../../../api/EndUserApi/endUserAuth/_requests";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation("EndUserSignUp");
  const { t: tErrors } = useTranslation("EndUserSignUpErrors");

  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [dataForm, setDataForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleServerErrors = (errorsArray: any) => {
    const formattedErrors: any = {};
    errorsArray.forEach((err: any) => {
      formattedErrors[err.code] = err.message;
    });
    setServerErrors(formattedErrors);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
    setClientErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};

    if (!dataForm.first_name)
      errors.first_name = tErrors("Errors.firstNameRequired");
    if (!dataForm.last_name)
      errors.last_name = tErrors("Errors.lastNameRequired");
    if (!dataForm.phone) errors.phone = tErrors("Errors.phoneRequired");
    if (!dataForm.email) errors.email = tErrors("Errors.emailRequired");
    if (!dataForm.password)
      errors.password = tErrors("Errors.passwordRequired");
    if (!dataForm.confirm_password) {
      errors.confirm_password = tErrors("Errors.confirmPasswordRequired");
    } else if (dataForm.password !== dataForm.confirm_password) {
      errors.confirm_password = tErrors("Errors.passwordsNotMatch");
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    try {
      const res = await register(dataForm);
      if (res?.status === 200 || res?.status === 201) {
        navigate("/signin");
      }
    } catch (error: any) {
      handleServerErrors(error.response.data.errors);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 flex flex-col items-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t("title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Label>
                  {t("firstName")}
                  <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder={t("placeholder.firstName")}
                  value={dataForm.first_name}
                  onChange={handleChange}
                />
                {clientErrors.first_name && (
                  <p className="text-error-500 text-xs mt-1">
                    {clientErrors.first_name}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <Label>
                  {t("lastName")}
                  <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder={t("placeholder.lastName")}
                  value={dataForm.last_name}
                  onChange={handleChange}
                />
                {clientErrors.last_name && (
                  <p className="text-error-500 text-xs mt-1">
                    {clientErrors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>
                {t("phone")}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder={t("placeholder.phone")}
                value={dataForm.phone}
                onChange={handleChange}
              />
              {clientErrors.phone && (
                <p className="text-error-500 text-xs mt-1">
                  {clientErrors.phone}
                </p>
              )}
              {serverErrors?.["phone"] && (
                <p className="text-error-500 text-xs mt-1">
                  {tErrors("ServerErrors.phoneTaken")}
                </p>
              )}
            </div>

            <div>
              <Label>
                {t("email")}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder={t("placeholder.email")}
                value={dataForm.email}
                onChange={handleChange}
              />
              {clientErrors.email && (
                <p className="text-error-500 text-xs mt-1">
                  {clientErrors.email}
                </p>
              )}
              {serverErrors?.["email"] && (
                <p className="text-error-500 text-xs mt-1">
                  {tErrors("ServerErrors.emailTaken")}
                </p>
              )}
            </div>

            <div>
              <Label>
                {t("password")}
                <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("placeholder.password")}
                  name="password"
                  value={dataForm.password}
                  onChange={handleChange}
                />
                {clientErrors.password && (
                  <p className="text-error-500 text-xs mt-1">
                    {clientErrors.password}
                  </p>
                )}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
                    document.documentElement.dir === "rtl"
                      ? "left-4"
                      : "right-4"
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
                {t("confirmPassword")}
                <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("placeholder.confirmPassword")}
                  value={dataForm.confirm_password}
                  name="confirm_password"
                  onChange={handleChange}
                />
                {clientErrors.confirm_password && (
                  <p className="text-error-500 text-xs mt-1">
                    {clientErrors.confirm_password}
                  </p>
                )}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
                    document.documentElement.dir === "rtl"
                      ? "left-4"
                      : "right-4"
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

          <button
            type="submit"
            className="w-full bg-brand-500 mt-5 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
          >
            {t("button")}
          </button>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            {t("alreadyHaveAccount")}{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
