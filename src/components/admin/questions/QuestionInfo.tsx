import React from "react";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

interface QuestionInfoProps {
  question: any;
}

const QuestionInfo: React.FC<QuestionInfoProps> = ({
  question
}) => {
  const { t } = useTranslation(["QuestionDetails"]);
  const { lang } = useDirectionAndLanguage();
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : t("QuestionDetails:not_available");
  return (
    <div className="space-y-10">
      {/* Core Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-blue-700 dark:text-blue-400 border-b pb-2">
          {t("QuestionDetails:sections.basic_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
          <p className="flex flex-col gap-1">
            <strong className="text-gray-500 text-sm">
              {t("QuestionDetails:fields.title_ar")}
            </strong>
            <span className="text-lg">{question?.title_ar || "---"}</span>
          </p>
          <p className="flex flex-col gap-1">
            <strong className="text-gray-500 text-sm">
              {t("QuestionDetails:fields.title_en")}
            </strong>
            <span className="text-lg">{question?.title_en || "---"}</span>
          </p>
          <p className="flex flex-col gap-1">
            <strong className="text-gray-500 text-sm">
              {t("QuestionDetails:fields.type")}
            </strong>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 w-fit">
              {question?.type === "single_choice"
                ? t("QuestionDetails:types.single_choice")
                : t("QuestionDetails:types.multiple_choice")}
            </span>
          </p>
          <p className="flex flex-col gap-1">
            <strong className="text-gray-500 text-sm">
              {t("QuestionDetails:fields.status")}
            </strong>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full w-fit ${
                question?.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {question?.status === "active"
                ? t("QuestionDetails:status.active")
                : t("QuestionDetails:status.inactive")}
            </span>
          </p>
        </div>
      </section>

      {/* Descriptions */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-purple-700 dark:text-purple-400 border-b pb-2">
          {t("QuestionDetails:sections.descriptions")}
        </h2>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong className="block text-gray-500 text-sm mb-2">
              {t("QuestionDetails:fields.description_ar")}
            </strong>
            <p className="text-gray-700 dark:text-gray-200">
              {question?.description_ar || t("QuestionDetails:no_description")}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong className="block text-gray-500 text-sm mb-2">
              {t("QuestionDetails:fields.description_en")}
            </strong>
            <p className="text-gray-700 dark:text-gray-200">
              {question?.description_en || t("QuestionDetails:no_description")}
            </p>
          </div>
        </div>
      </section>

      {/* Meta Dates */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
          <p className="flex items-center justify-between border-b dark:border-gray-800 pb-2">
            <strong>{t("QuestionDetails:fields.created_at")}:</strong>
            <span className="text-gray-500">
              {formatDate(question?.created_at)}
            </span>
          </p>
          <p className="flex items-center justify-between border-b dark:border-gray-800 pb-2">
            <strong>{t("QuestionDetails:fields.updated_at")}:</strong>
            <span className="text-gray-500">
              {formatDate(question?.updated_at)}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default QuestionInfo;
