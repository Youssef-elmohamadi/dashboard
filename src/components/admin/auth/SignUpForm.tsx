import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BasicInfoForm from "./BasicInfoForm";
import BreadCrump from "./BreadCrump";
import BankInformation from "./BankInformation";
import StoreInfoForm from "./StoreInfoForm";

import { useTranslation } from "react-i18next";
import { register } from "../../../api/authApi/_requests";
import { validateAdminForm, validateVendorForm } from "./ValidateForm";
import convertToFormData from "./convertToFormData";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation(["Signup", "SignErrors"]);

  const [step, setStep] = useState(1);
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>();
  const [dataForm, setDataForm] = useState({
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
    bankInfo: {
      phone: "",
    },
    documentInfo: [
      {
        document_file: null as File | null,
        document_type: "1",
      },
      {
        document_file: null as File | null,
        document_type: "2",
      },
    ],
  });

  const handleServerErrors = (errorsArray: any) => {
    const formattedErrors: any = {};

    errorsArray.forEach((err: any) => {
      formattedErrors[err.code] = err.message;
    });

    setServerErrors(formattedErrors);
  };

  const formData = convertToFormData(dataForm);

  // Unified change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "adminInfo" | "vendorInfo" | "bankInfo"
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

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e, "bankInfo");

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

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let isValid = true;

    if (step === 1) {
      isValid = validateAdminForm(setClientErrors, dataForm, t);
    } else if (step === 3) {
      isValid = validateVendorForm(setClientErrors, dataForm, t);
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  console.log(dataForm);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateVendorForm(setClientErrors, dataForm, t);
    if (!isValid) return;
    console.log("Submitting:", dataForm);

    try {
      const res = await register(formData);
      console.log(res);
      if (res?.status === 200 || res?.status === 201) {
        console.log("navigate...");
        navigate("/admin/signin");
      }
    } catch (error: any) {
      console.log(error.response);
      if (error.response?.data?.errors) {
        const serverErrors = error.response?.data?.errors;
        handleServerErrors(serverErrors);
        if (
          serverErrors.some((err: any) => err.code === "adminInfo.phone") ||
          serverErrors.some((err: any) => err.code === "adminInfo.email")
        ) {
          setStep(1);
        } else if (
          serverErrors.some((err: any) => err.code === "vendorInfo.phone")
        ) {
          setStep(3);
        }
        console.log(step);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  console.log(serverErrors);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 flex flex-col items-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t("title")}
          </h1>
        </div>

        <BreadCrump step={step} setStep={setStep} />

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <BasicInfoForm
              adminInfo={dataForm.adminInfo}
              handleChange={handleAdminChange}
              clientErrors={clientErrors}
              serverErrors={serverErrors}
            />
          )}
          {step === 2 && (
            <BankInformation
              dataForm={dataForm}
              handleChange={handleBankChange}
            />
          )}
          {step === 3 && (
            <StoreInfoForm
              documentInfo={dataForm.documentInfo}
              vendorInfo={dataForm.vendorInfo}
              handleFileChange={handleFileChange}
              handleChange={handleVendorChange}
              clientErrors={clientErrors}
              serverErrors={serverErrors}
            />
          )}

          <div className="mt-5">
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
              >
                {t("next")}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 focus:bg-brand-700 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition duration-300"
              >
                {t("button")}
              </button>
            )}
          </div>
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
