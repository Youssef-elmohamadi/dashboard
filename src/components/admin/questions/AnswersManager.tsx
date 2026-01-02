import React from "react";
import { useTranslation } from "react-i18next";
import Select from "../../common/form/Select";
import Input from "../../common/input/InputField";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import Label from "../../common/form/Label";

interface Answer {
  id: number | string;
  answer_en: string;
  answer_ar: string;
  price_effect: number | null;
  price_effect_type: "fixed" | "percentage";
  status: "active" | "inactive";
}

interface Props {
  answersList: Answer[];
  isLoading: boolean;
  isFormOpen: boolean;
  setIsFormOpen: (v: boolean) => void;
  answerForm: Omit<Answer, "id">;
  setAnswerForm: (v: any) => void;
  editingAnswerId: number | string | null;
  setEditingAnswerId: (v: any) => void;
  onEdit: (a: Answer) => void;
  onDelete: (id: number | string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  clientSideErrors: Record<string, string>;
  serverErrors: Record<string, string[]>;
}

const AnswersManager: React.FC<Props> = ({
  answersList,
  isFormOpen,
  setIsFormOpen,
  answerForm,
  setAnswerForm,
  editingAnswerId,
  setEditingAnswerId,
  onEdit,
  onDelete,
  onSubmit,
  isSubmitting,
  clientSideErrors,
  serverErrors,
}) => {
  const { t } = useTranslation(["QuestionDetails"]);
  const { lang } = useDirectionAndLanguage();
  const renderError = (field: string) =>
    clientSideErrors[field] || serverErrors[field]?.[0] ? (
      <p className="text-red-500 text-xs mt-1">
        {clientSideErrors[field] || serverErrors[field]?.[0]}
      </p>
    ) : null;

  return (
    <section className="bg-white p-6 rounded-xl border mt-10">
      <div className="flex justify-between mb-6">
        <h2 className="font-bold text-lg">{t("Answers.title")}</h2>

        <button
          onClick={() => {
            setEditingAnswerId(null);
            setAnswerForm({
              answer_en: "",
              answer_ar: "",
              price_effect: null,
              price_effect_type: "fixed",
              status: "active",
            });
            setIsFormOpen(true);
          }}
          className="bg-brand-500 text-white px-4 py-2 rounded"
        >
          {t("Answers.add_new")}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={onSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>{t("Answers.label_en")}</Label>
              <Input
                placeholder={t("Answers.label_en")}
                value={answerForm.answer_en}
                onChange={(e) =>
                  setAnswerForm({ ...answerForm, answer_en: e.target.value })
                }
              />
              {renderError("answer_en")}
            </div>
            <div>
              <Label>{t("Answers.label_ar")}</Label>

              <Input
                placeholder={t("Answers.label_ar")}
                value={answerForm.answer_ar}
                onChange={(e) =>
                  setAnswerForm({ ...answerForm, answer_ar: e.target.value })
                }
              />
              {renderError("answer_ar")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>{t("Answers.price_effect_type")}</Label>
              <Select
                value={answerForm.price_effect_type}
                options={[
                  { value: "fixed", label: t("Answers.fixed") },
                  { value: "percentage", label: t("Answers.percentage") },
                ]}
                onChange={(v) =>
                  setAnswerForm({ ...answerForm, price_effect_type: v })
                }
              />
              {renderError("price_effect_type")}
            </div>
            <div>
              <Label>{t("Answers.price_effect")}</Label>
              <Input
                type="number"
                placeholder={t("Answers.price_effect")}
                value={answerForm.price_effect ?? ""}
                onChange={(e) =>
                  setAnswerForm({
                    ...answerForm,
                    price_effect:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
              {renderError("price_effect")}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>{t("Answers.status")}</Label>
              <Select
                value={answerForm.status}
                options={[
                  { value: "active", label: t("status.active") },
                  { value: "inactive", label: t("status.inactive") },
                ]}
                onChange={(v) => setAnswerForm({ ...answerForm, status: v })}
              />
              {renderError("status")}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsFormOpen(false)}>
              {t("Answers.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-500 text-white px-6 py-2 rounded"
            >
              {editingAnswerId ? t("Answers.update") : t("Answers.create")}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            {/* هيدر ملون باللون الأحمر كما في الصورة */}
            <tr className="bg-[#b11f1f] text-white text-sm">
              <th className="py-3 px-4 border-r border-white/10">
                {t("Answers.id_column")}
              </th>
              <th className="py-3 px-4 border-r border-white/10">
                {t("Answers.label_column")}
              </th>
              <th className="py-3 px-4 border-r border-white/10">
                {t("Answers.price_effect")}
              </th>
              <th className="py-3 px-4 border-r border-white/10">
                {t("Answers.status")}
              </th>
              <th className="py-3 px-4">{t("Answers.actions_column")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {answersList.map((ans, index) => (
              <tr
                key={ans.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* المعرف - ID */}
                <td className="py-4 px-2 text-gray-500 text-sm">
                  {ans.id || index + 1}
                </td>

                {/* نص الإجابة */}
                <td className="py-4 px-2 font-medium text-gray-800 dark:text-gray-200">
                  {lang === "ar" ? ans.answer_ar : ans.answer_en}
                </td>

                {/* تأثير السعر */}
                <td className="py-4 px-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {ans.price_effect
                      ? `${ans.price_effect} ${
                          ans.price_effect_type === "fixed" ? "$" : "%"
                        }`
                      : "—"}
                  </span>
                </td>

                <td className="py-4 px-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                      ans.status === "active"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                    }`}
                  >
                    {ans.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </td>

                <td className="py-4 px-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(ans)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>{" "}
                      {/* تأكد من وجود FontAwesome أو استبدلها بأيقونة Lucide */}
                      {t("Answers.edit")}
                    </button>

                    <button
                      onClick={() => onDelete(ans.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-600 hover:text-white transition-all text-xs font-bold"
                    >
                      <i className="fa-solid fa-trash"></i>
                      {t("Answers.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AnswersManager;
