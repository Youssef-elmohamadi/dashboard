import { useTranslation } from "react-i18next";
import { BreadCrumpProps, Steps } from "../../../types/Auth";

const BreadCrump = ({ step, setStep }: BreadCrumpProps) => {
  const { t } = useTranslation("BreadCrump");

  const steps: Steps = [
    { label: t("basicInformation"), number: 1 },
    { label: t("storeInformation"), number: 2 },
    { label: t("verifyPhone"), number: 3 },
  ];

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {steps.map((s, index) => {
          if (step < s.number) return null;

          return (
            <li
              key={s.number}
              className={`flex items-center ${
                index === 0 ? "inline-flex" : ""
              }`}
              aria-current={step === s.number ? "page" : undefined}
            >
              {index > 0 && (
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}
              <button
                onClick={() => setStep(s.number)}
                className={`inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white ${
                  step === s.number
                    ? "text-blue-600 dark:text-white"
                    : "text-gray-700"
                }`}
              >
                {index === 0 && (
                  <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                )}
                {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrump;
