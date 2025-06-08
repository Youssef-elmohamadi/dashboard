import React, { useRef, useState, useEffect } from "react";

type OTPPageProps = {
  identifier: string;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: (otp: string) => void;
  onResend: () => Promise<boolean>;
  otpError?: string;
  title?: string;
  subtitle?: string;
  resendText?: string;
  continueText?: string;
  timerSeconds?: number;
  setOtpError?: any;
};

const OTPPage: React.FC<OTPPageProps> = ({
  identifier,
  otp,
  setOtp,
  onSubmit,
  setOtpError,
  onResend,
  otpError,
  title = "Enter the OTP",
  subtitle = "Please enter the 6-digit code sent to",
  resendText = "Resend Code",
  continueText = "Continue",
  timerSeconds = 120,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(timerSeconds);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError?.("");

    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResend = async () => {
    try {
      await onResend();
      setTimer(timerSeconds);
    } catch {}
  };

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(
    2,
    "0"
  )}:${String(timer % 60).padStart(2, "0")}`;
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex p-4">
      <div className="rounded-2xl p-6 w-full max-w-md text-center border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-4 dark:text-gray-100">
          {subtitle} <strong>{identifier}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-100">
          {resendText}{" "}
          <button
            className={`font-semibold underline ${
              timer === 0
                ? "text-black dark:text-white"
                : "text-gray-400 cursor-not-allowed"
            }`}
            type="button"
            onClick={handleResend}
            disabled={timer !== 0}
          >
            {resendText}
          </button>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              maxLength={1}
              className="md:w-12 md:h-12 h-8 w-8 **: text-center text-xl border  dark:border-gray-800 dark:bg-gray-600 dark:text-gray-100 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={digit}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onChange={(e) => handleChange(e.target.value, idx)}
            />
          ))}
        </div>

        {otpError && <p className="text-red-500 mb-4 text-sm">{otpError}</p>}

        <div className="mb-4 text-gray-700 font-medium text-lg dark:text-gray-100">
          Timer: {formattedTime}
        </div>

        <button
          type="button"
          onClick={() => onSubmit(otp.join(""))}
          className={`w-full py-2 rounded-full  font-semibold transition ${
            isOtpComplete
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!isOtpComplete}
        >
          {continueText}
        </button>
      </div>
    </div>
  );
};

export default OTPPage;
