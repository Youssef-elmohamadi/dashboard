// ResetPassword.tsx
import { useState } from "react";
import OTPPage from "./OtpPage";
import { useNavigate } from "react-router-dom";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../../../api/OtpApi/_requests";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step === 1 && phone) {
      await handleSendOtp();
      setStep(2);
    } else if (step === 2 && otp.length === 6) {
      await handleSubmitOtp();
    } else if (step === 3) {
      await handleResetPassword();
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp({
        identifier: phone,
        type: "user",
      });
      toast.success(t("otp.successSendOtp"));
    } catch (error) {
      toast.error(t("otp.failedSendOtp"));
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
        type: "user",
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
        type: "user",
        password,
        password_confirmation: confirmPassword,
      });

      if (res?.status === 200) {
        toast.success("Password reset successful!");
        navigate("/signin");
      }
    } catch (err: any) {
      const response = err?.response?.data;
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
          <div className="border p-12 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your phone number to receive reset code.
            </p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Code
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back To Login
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
          />
        );

      case 3:
        return (
          <div className="border p-12 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your new password and confirm it.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Password
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
            className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
