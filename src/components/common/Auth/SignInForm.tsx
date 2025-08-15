import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../form/Label";
import Input from "../input/InputField";
import Checkbox from "../input/Checkbox";
import { useTranslation } from "react-i18next";
import { login as superAdminLogin } from "../../../api/SuperAdminApi/Auth/_requests";
import { login as adminLogin } from "../../../api/AdminApi/authApi/_requests";
import { login as userLogin } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
type UserType = "super_admin" | "admin" | "end_user";
interface SignInFormProps {
  userType: UserType;
}
export default function SignInForm({ userType }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    loginError?: string;
    generalError?: string;
  }>({});

  const { lang, dir } = useDirectionAndLanguage();
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: t("emailError"),
      }));
      return false;
    } else {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors;
        return rest;
      });
      return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const getLoginFunction = () => {
    switch (userType) {
      case "super_admin":
        return superAdminLogin;
      case "admin":
        return adminLogin;
      case "end_user":
        return userLogin;
      default:
        return superAdminLogin;
    }
  };

  const getRedirectPath = () => {
    switch (userType) {
      case "super_admin":
        return "/super_admin";
      case "admin":
        return "/admin";
      case "end_user":
        return `/${lang}`;
      default:
        return `/${lang}`;
    }
  };

  const getTokenKey = () => {
    return `${userType}_token`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!validateEmail(email)) return;

    try {
      const loginFn = getLoginFunction();
      const res = await loginFn(email, password);

      if (res?.status === 200) {
        localStorage.setItem(getTokenKey(), res.data.data.token);
        localStorage.setItem(`${userType}_id`, res.data.data.id);
        navigate(getRedirectPath());
      }
    } catch (error: any) {
      if (error.response?.status === 422 || error.response?.status === 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          loginError: t("loginError"),
        }));
      } else {
        setErrors((prevErrors) => {
          const { loginError, ...rest } = prevErrors;
          return {
            ...rest,
            generalError: t("generalError"),
          };
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col lg:justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("signInTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("paragraph")}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {errors.loginError && (
              <p className="text-error-500 text-base mt-1">
                {errors.loginError}
              </p>
            )}
            {errors.generalError && (
              <p className="text-error-500 text-base mt-1">
                {errors.generalError}
              </p>
            )}
            <div className="space-y-6">
              <div>
                <Label>
                  {t("email")} <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder={t("placeholder.email")}
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={email}
                />
                {errors.email && (
                  <p className="text-error-500 text-base mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label>
                  {t("password")} <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder.password")}
                    name="password"
                    onChange={handleChange}
                    value={password}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute z-30 -translate-y-1/2 cursor-pointer ${
                      dir === "rtl" ? "left-4" : "right-4"
                    } top-1/2`}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {userType === "super_admin" ? (
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      {t("keepSignedIn")}
                    </span>
                  </div>
                ) : (
                  <div className="text-theme-sm text-gray-700 dark:text-gray-400">
                    <Link
                      to={
                        userType === "end_user"
                          ? `/${lang}/signup`
                          : `/${userType}/signup`
                      }
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
                    >
                      {t("signUpTitle")}
                    </Link>
                  </div>
                )}
                <Link
                  to={`/${userType}/reset-password`}
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
                >
                  {t("buttons.loginButton")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
