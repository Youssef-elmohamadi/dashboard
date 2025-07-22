import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../../../api/EndUserApi/endUserAuth/_requests";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import OTPPage from "../../common/Auth/OtpPage";
import { sendOtp, verifyOtp } from "../../../api/OtpApi/_requests";
import { toast } from "react-toastify";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
export default function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [step, setStep] = useState<1 | 2>(1);
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const { lang } = useDirectionAndLanguage();
  const [dataForm, setDataForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
    setClientErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOtp = async (): Promise<boolean> => {
    try {
      await sendOtp({
        identifier: dataForm.phone,
        type: "user",
      });
      toast.success(t("otp.successSendOtp"));
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(t("otp.failedSendOtp"));
      return false;
    }
  };
  const handleSubmitOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setOtpError(t("otp.invalid"));
      return;
    }

    try {
      const res = await verifyOtp({
        identifier: dataForm.phone,
        type: "admin",
        otp: enteredOtp,
      });

      if (res?.status === 200) {
        toast.success(t("otp.success"));
        navigate(`/${lang}/signin`);
      }
    } catch (err: any) {
      const message = t("otp.invalid");
      setOtpError(message);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};

    if (!dataForm.first_name) errors.first_name = t("errors.firstNameError");
    if (!dataForm.last_name) errors.last_name = t("errors.lastNameError");
    if (!dataForm.phone) errors.phone = t("errors.phoneError");
    if (!dataForm.email) errors.email = t("errors.emailError");
    if (!/\S+@\S+\.\S+/.test(dataForm.email))
      errors.email = t("errors.emailFormatError");
    if (!dataForm.password) errors.password = t("Errors.passwordRequired");
    if (dataForm.password.length < 8)
      errors.password = t("errors.passwordLengthError");
    if (!dataForm.confirm_password) {
      errors.confirm_password = t("errors.confirmPasswordError");
    } else if (dataForm.password !== dataForm.confirm_password) {
      errors.confirm_password = t("errors.passwordMatchError");
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    try {
      const res = await register(dataForm);
      if (res?.status === 200 || res?.status === 201) {
        setStep(2);
        handleSendOtp();
      }
    } catch (error: any) {
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setServerErrors(formattedErrors);
      }
    }
  };

  if (step === 2) {
    return (
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="mb-5 sm:mb-8 flex flex-col items-center">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("signUpTitle")}
            </h1>
          </div>
          <OTPPage
            identifier={dataForm.phone}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleSubmitOtp}
            onResend={handleSendOtp}
            title={t("otp.title")}
            subtitle={t("otp.subtitle")}
            resendText={t("otp.resendBtn")}
            continueText={t("otp.continue")}
            otpError={otpError}
            setOtpError={setOtpError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-4">
      <div className="mb-5 sm:mb-8 flex flex-col items-center">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          {t("signUpTitle")}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                {t("basicInformation.lastName")}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                placeholder={t("basicInformation.placeholder.lastName")}
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
              {t("basicInformation.phone")}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              placeholder={t("basicInformation.placeholder.phone")}
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
                {t("errors.endUserPhoneTaken")}
              </p>
            )}
          </div>

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
                {t("errors.endUserEmailTaken")}
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
                placeholder={t("basicInformation.placeholder.password")}
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

        <button
          type="submit"
          className="w-full bg-brand-500 mt-5 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
        >
          {t("buttons.createButton")}
        </button>
      </form>

      <div className="mt-5">
        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          {t("alreadyHaveAccount")}{" "}
          <Link
            to={`/${lang}/signin`}
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            {t("buttons.loginButton")}
          </Link>
        </p>
      </div>
    </div>
  );
}
