import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCreateAnswerToQuestion,
  useDeleteAnswerToQuestion,
  useGetProductQuestionById,
  useShowAnswersByQuestion,
  useUpdateAnswerToQuestion,
} from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

import QuestionInfo from "./QuestionInfo";
import AnswersManager from "./AnswersManager";

const initialAnswerForm = {
  answer_en: "",
  answer_ar: "",
  price_effect: null as number | null,
  price_effect_type: "fixed" as "fixed" | "percentage",
  status: "active" as "active" | "inactive",
};

const initialServerErrors = {
  answer_ar: [] as string[],
  answer_en: [] as string[],
  price_effect: [] as string[],
  price_effect_type: [] as string[],
  status: [] as string[],
};

const QuestionDetails: React.FC = () => {
  const { t } = useTranslation(["QuestionDetails"]);
  const { lang } = useDirectionAndLanguage();
  const { id } = useParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<
    number | string | null
  >(null);
  const [answerForm, setAnswerForm] = useState(initialAnswerForm);

  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({});
  const [serverErrors, setServerErrors] = useState(initialServerErrors);

  // API Hooks
  const {
    data: question,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductQuestionById(id);

  const {
    data: answersList = [],
    isLoading: isAnswersLoading,
    refetch: refetchAnswers,
  } = useShowAnswersByQuestion(id!);

  const { mutateAsync: createAnswer, isLoading: isCreating } =
    useCreateAnswerToQuestion();
  const { mutateAsync: updateAnswer, isLoading: isUpdating } =
    useUpdateAnswerToQuestion(id);
  const { mutateAsync: deleteAnswer, isLoading: isDeleting } =
    useDeleteAnswerToQuestion();

  // ---------------- Validation ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!answerForm.answer_en.trim()) {
      newErrors.answer_en = t("QuestionDetails:validation.answer_name_en");
    }

    if (!answerForm.answer_ar.trim()) {
      newErrors.answer_ar = t("QuestionDetails:validation.answer_name_ar");
    }

    if (
      answerForm.price_effect !== null &&
      (isNaN(answerForm.price_effect) || answerForm.price_effect < 0)
    ) {
      newErrors.price_effect = t("QuestionDetails:validation.price_effect");
    }

    if (
      answerForm.price_effect_type !== "fixed" &&
      answerForm.price_effect_type !== "percentage"
    ) {
      newErrors.price_effect_type = t(
        "QuestionDetails:validation.price_effect_type"
      );
    }

    if (answerForm.status !== "active" && answerForm.status !== "inactive") {
      newErrors.status = t("QuestionDetails:validation.status");
    }

    const isValid = Object.keys(newErrors).length === 0;
    setClientSideErrors(newErrors);

    return isValid;
  };

  // ---------------- Handlers ----------------
  const handleOpenEdit = (answer: any) => {
    setEditingAnswerId(answer.id);
    setAnswerForm({
      answer_en: answer.answer_en,
      answer_ar: answer.answer_ar,
      price_effect: answer.price_effect,
      price_effect_type: answer.price_effect_type,
      status: answer.status,
    });
    setClientSideErrors({});
    setServerErrors(initialServerErrors);
    setIsFormOpen(true);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (editingAnswerId) {
        await updateAnswer({
          answerId: editingAnswerId,
          ...answerForm,
        });
      } else {
        await createAnswer({
          question_id: id,
          ...answerForm,
        });
      }

      refetchAnswers();
      setIsFormOpen(false);
      setEditingAnswerId(null);
      setAnswerForm(initialAnswerForm);
      setClientSideErrors({});
      setServerErrors(initialServerErrors);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        return;
      }

      const rawErrors = err?.response?.data?.errors;

      if (Array.isArray(rawErrors)) {
        const formatted: Record<string, string[]> = {};

        rawErrors.forEach((e: any) => {
          if (!formatted[e.code]) formatted[e.code] = [];
          formatted[e.code].push(e.message);
        });

        setServerErrors((prev) => ({ ...prev, ...formatted }));
      }
    }
  };

  const handleDeleteAnswer = async (answerId: number | string) => {
    if (!window.confirm(t("QuestionDetails:confirm_delete_answer"))) return;

    await deleteAnswer({ answerId });
    refetchAnswers();
  };

  // ---------------- Page Status ----------------
  let pageStatus = PageStatus.SUCCESS;
  let errorMessage = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    errorMessage = [401, 403].includes(axiosError?.response?.status || 0)
      ? t("QuestionDetails:errors.unauthorized")
      : t("QuestionDetails:errors.general");
  }

  return (
    <>
      <SEO
        title={{
          ar: `تفاصيل السؤال`,
          en: `Question Details`,
        }}
        description={{
          ar: `عرض تفاصيل السؤال`,
          en: `Question details`,
        }}
        robotsTag="noindex, nofollow"
      />

      <PageStatusHandler status={pageStatus} errorMessage={errorMessage}>
        <div className="p-6 max-w-6xl mx-auto space-y-10">
          <QuestionInfo question={question} />

          <AnswersManager
            answersList={answersList}
            isLoading={isAnswersLoading}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            answerForm={answerForm}
            setAnswerForm={setAnswerForm}
            editingAnswerId={editingAnswerId}
            setEditingAnswerId={setEditingAnswerId}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteAnswer}
            onSubmit={handleSubmitAnswer}
            isSubmitting={isCreating || isUpdating || isDeleting}
            clientSideErrors={clientSideErrors}
            serverErrors={serverErrors}
          />
        </div>
      </PageStatusHandler>
    </>
  );
};

export default QuestionDetails;
