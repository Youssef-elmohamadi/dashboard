import { useState } from "react";
import OTPPage from "./OtpPage";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, resetPassword } from "../../api/OtpApi/_requests";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Input from "../form/input/InputField";

type ResetPasswordProps = {
  type: "admin" | "user" | "super_admin";
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ type }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      if (!phone) {
        setPhoneError(t("forgotPasswordPage.errors.phone"));
        return;
      }
      if (!/^01[0125][0-9]{8}$/.test(phone)) {
        setPhoneError(t("forgotPasswordPage.errors.phoneInvalid"));
        return;
      }

      const success = await handleSendOtp();
      if (success) {
        setStep(2);
      }
    } else if (step === 2 && otp.length === 6) {
      await handleSubmitOtp();
    } else if (step === 3) {
      await handleResetPassword();
    }
  };

  const handleSendOtp = async (): Promise<boolean> => {
    try {
      await sendOtp({
        identifier: phone,
        type,
      });
      toast.success(t("otp.successSendOtp"));
      return true;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message;
      if (errorMsg?.toLowerCase().includes("not found")) {
        toast.error(t("forgotPasswordPage.errors.phoneNotFound"));
      } else {
        toast.error(t("otp.failedSendOtp"));
      }
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
        identifier: phone,
        type,
        otp: enteredOtp,
      });

      if (res?.status === 200) {
        toast.success(t("otp.success"));
        setOtpError("");
        setStep(3);
      }
    } catch (err) {
      setOtpError(t("otp.invalid"));
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setPasswordError(t("errors.passwordError"));
      return;
    }
    if (password.length < 8) {
      setPasswordError(t("errors.passwordLengthError"));
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(t("errors.passwordMatchError"));
      return;
    }

    try {
      const res = await resetPassword({
        identifier: phone,
        type,
        password,
        password_confirmation: confirmPassword,
      });

      if (res?.status === 200) {
        toast.success(t("forgotPasswordPage.resetPasswordSuccess"));
        navigate("/" + type + "/signin");
      }
    } catch (err: any) {
      const response = err?.response?.data;
      toast.error(t("forgotPasswordPage.resetPasswordFail"));
      if (response?.password && Array.isArray(response.password)) {
        setPasswordError(response.password[0]);
      } else {
        toast.error(t("errors.generalError"));
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="border border-gray-200 dark:border-gray-800 p-12 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
              {t("forgotPasswordPage.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-100 text-center mb-6">
              {t("forgotPasswordPage.description")}
            </p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("forgotPasswordPage.phonePlaceholder")}
              className="w-full px-4 py-2 border dark:text-gray-100 border-gray-300 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-2">{phoneError}</p>
            )}
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("forgotPasswordPage.submit")}
            </button>
            <button
              onClick={() => navigate(`/${type}/signin`)}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("forgotPasswordPage.backToLogin")}
            </button>
          </div>
        );

      case 2:
        return (
          <OTPPage
            identifier={phone}
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
        );

      case 3:
        return (
          <div className="border p-12 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100 ">
              {t("forgotPasswordPage.resetPassword")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-6">
              {t("forgotPasswordPage.enterAndConfirmPassword")}
            </p>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("forgotPasswordPage.newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("forgotPasswordPage.confirmPasswordPlaceholder")}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
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
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("forgotPasswordPage.resetPasswordBtn")}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {renderStep()}
        {step > 1 && (
          <button
            onClick={() => setStep(step > 1 ? step - 1 : 1)}
            className="w-full mt-4 py-2 border dark:text-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            {t("forgotPasswordPage.back")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
