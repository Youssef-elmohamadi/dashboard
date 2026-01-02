// src/components/auth/ResetPassword/ResetPassword.tsx
import { useState } from "react";
import OTPPage from "./OtpPage"; // تأكد من المسار الصحيح
import { useNavigate } from "react-router-dom";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../../../api/OtpApi/_requests";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import Step1_PhoneInput from "./Step1_PhoneInput";
import Step3_NewPassword from "./Step3_NewPassword";

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
  const { lang } = useDirectionAndLanguage();

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
        if (type === "user") {
          navigate(`/${lang}/signin`);
        } else {
          navigate(`/${type}/signin`);
        }
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
        setPhoneError(""); // مسح الخطأ بعد الانتقال بنجاح
      }
    } else if (step === 2 && otp.length === 6) {
      await handleSubmitOtp();
    } else if (step === 3) {
      await handleResetPassword();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1_PhoneInput
            phone={phone}
            setPhone={setPhone}
            phoneError={phoneError}
            onNext={handleNext}
            onBackToLogin={() => navigate(`/${type}/signin`)}
          />
        );
      case 2:
        return (
          <OTPPage
            identifier={phone}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleNext} // تم تغييرها لتستدعي handleNext
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
          <Step3_NewPassword
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={passwordError}
            onResetPassword={handleNext} // تم تغييرها لتستدعي handleNext
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="sm:min-w-[400px] md:min-w-[450px]">
      {renderStep()}
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="w-full mt-4 py-2 border dark:text-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          {t("forgotPasswordPage.back")}
        </button>
      )}
    </div>
  );
};

export default ResetPassword;
