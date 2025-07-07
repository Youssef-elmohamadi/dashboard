import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BasicInfoForm from "./BasicInfoForm";
import BreadCrump from "./BreadCrump";
import StoreInfoForm from "./StoreInfoForm";
import { useTranslation } from "react-i18next";
import { register } from "../../../api/AdminApi/authApi/_requests";
import { validateAdminForm, validateVendorForm } from "./ValidateForm";
import convertToFormData from "./convertToFormData";
import OTPPage from "../../common/Auth/OtpPage";
import { sendOtp, verifyOtp } from "../../../api/OtpApi/_requests";
import { toast } from "react-toastify";
import { ClientErrors, FormDataType, ServerErrors } from "../../../types/Auth";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation(["auth"]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [otpError, setOtpError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [errors, setErrors] = useState<ServerErrors>({
    general: "",
    global: "",
    errors: {},
  });

  const [dataForm, setDataForm] = useState<FormDataType>({
    adminInfo: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    vendorInfo: {
      name: "",
      email: "",
      phone: "",
    },
    documentInfo: [
      {
        document_file: null,
        document_type: "1",
      },
      {
        document_file: null,
        document_type: "2",
      },
    ],
  });

  const handleSendOtp = async (): Promise<boolean> => {
    try {
      await sendOtp({
        identifier: dataForm.vendorInfo.phone,
        type: "admin",
      });
      toast.success(t("otp.successSendOtp"));
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(t("otp.failedSendOtp"));
      return false;
    }
  };

  const formData = convertToFormData(dataForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "adminInfo" | "vendorInfo"
  ) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e, "adminInfo");

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e, "vendorInfo");

  const handleFileChange = (file: File | null, file_type: "1" | "2") => {
    setDataForm((prev) => ({
      ...prev,
      documentInfo: prev.documentInfo.map((item) =>
        item.document_type === file_type
          ? { ...item, document_file: file }
          : item
      ),
    }));
  };

  const handleNextStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = true;

    if (step === 1) {
      isValid = validateAdminForm(setClientErrors, dataForm, t);
    } else if (step === 2) {
      isValid = validateVendorForm(setClientErrors, dataForm, t);
    }

    if (isValid) {
      setStep(step + 1);
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
        identifier: dataForm.vendorInfo.phone,
        type: "admin",
        otp: enteredOtp,
      });

      if (res?.status === 200) {
        toast.success(t("otp.success"));
        navigate("/admin/signin");
      }
    } catch (err: any) {
      const message = t("otp.invalid");
      setOtpError(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ general: "", global: "", errors: {} });
    const isValid = validateVendorForm(setClientErrors, dataForm, t);
    if (!isValid) return;

    try {
      if (!isRegistered) {
        setIsRegistering(true);
        const res = await register(formData);

        if (res?.status === 200 || res?.status === 201) {
          setIsRegistered(true);
        } else {
          return;
        }
      }

      setIsSendingOtp(true);
      const otpSent = await handleSendOtp();
      if (otpSent) {
        setStep(3);
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

        setErrors((prev) => ({ ...prev, ...formattedErrors }));

        const errorKeys = Object.keys(formattedErrors);

        const isAdminStepError = errorKeys.some((key) =>
          key.startsWith("adminInfo.")
        );
        const isVendorStepError =
          errorKeys.some((key) => key.startsWith("vendorInfo.")) ||
          errorKeys.some((key) => key.startsWith("documentInfo."));

        if (formattedErrors.general) {
          setStep(1);
        } else if (isAdminStepError) {
          setStep(1);
        } else if (isVendorStepError) {
          setStep(2);
        }
      } else {
        setErrors((prev) => ({ ...prev, general: t("errors.general") }));
        setStep(1);
      }
    } finally {
      setIsRegistering(false);
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full lg:w-1/2 mb-3">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 flex flex-col items-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t("signUpTitle")}
          </h1>
        </div>

        <BreadCrump step={step} setStep={setStep} />

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="text-red-600 bg-red-200 p-4 mt-0.5 rounded-md mb-4">
              {errors.general}
            </div>
          )}
          {step === 1 && (
            <BasicInfoForm
              adminInfo={dataForm.adminInfo}
              handleChange={handleAdminChange}
              clientErrors={clientErrors}
              serverErrors={errors}
            />
          )}

          {step === 2 && (
            <StoreInfoForm
              documentInfo={dataForm.documentInfo}
              vendorInfo={dataForm.vendorInfo}
              handleFileChange={handleFileChange}
              handleChange={handleVendorChange}
              clientErrors={clientErrors}
              serverErrors={errors}
            />
          )}

          {step === 3 && (
            <OTPPage
              identifier={dataForm.vendorInfo.phone}
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
          )}

          <div className="mt-5">
            {step < 2 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
              >
                {t("buttons.next")}
              </button>
            )}
            {step === 2 && (
              <button
                type="submit"
                disabled={isRegistering || isSendingOtp}
                className={`w-full ${
                  isRegistering || isSendingOtp
                    ? "bg-brand-300 cursor-not-allowed"
                    : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700"
                } text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300`}
              >
                {isRegistering
                  ? t("buttons.loadingRegister")
                  : isSendingOtp
                  ? t("otp.loadingOtp")
                  : isRegistered
                  ? t("otp.sendOtpButton")
                  : t("buttons.createButton")}
              </button>
            )}
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            {t("alreadyHaveAccount")}{" "}
            <Link
              to="/admin/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {t("buttons.loginButton")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
