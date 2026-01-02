import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import {
  useGetProductQuestionById,
  useUpdateProductQuestion,
} from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";
import SEO from "../../../components/common/SEO/seo";
import { AxiosError } from "axios";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";

interface QuestionData {
  title_en: string;
  title_ar: string;
  type: "single_choice" | "multiple_choice" | "";
  description_en: string;
  description_ar: string;
  is_required: boolean;
  status: "active" | "inactive";
  cover: string;
}

interface QuestionErrors {
  title_en: string[];
  title_ar: string[];
  type: string[];
  description_en: string[];
  description_ar: string[];
  global: string;
  general: string;
  [key: string]: any;
}

const UpdateQuestionPage = () => {
  const { t } = useTranslation(["UpdateQuestion", "Meta"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRefs = useRef<Record<string, HTMLInputElement | any>>({});

  const [updateData, setUpdateData] = useState<QuestionData>({
    title_en: "",
    title_ar: "",
    type: "",
    description_en: "",
    description_ar: "",
    is_required: false,
    status: "active",
    cover: "",
  });

  const [errors, setErrors] = useState<QuestionErrors>({
    title_en: [],
    title_ar: [],
    type: [],
    description_en: [],
    description_ar: [],
    global: "",
    general: "",
  });

  const [clientSideErrors, setClientSideErrors] = useState({
    title_en: "",
    title_ar: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const {
    data: questionResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductQuestionById(id);
  const questionData = questionResponse;

  const { mutateAsync } = useUpdateProductQuestion(id!);

  useEffect(() => {
    if (questionData) {
      setUpdateData({
        title_en: questionData.title_en || "",
        title_ar: questionData.title_ar || "",
        type: questionData.type || "",
        description_en: questionData.description_en || "",
        description_ar: questionData.description_ar || "",
        is_required: !!questionData.is_required,
        status: questionData.status || "active",
        cover: questionData.cover || "",
      });
    }
  }, [questionData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {
      title_en: "",
      title_ar: "",
      type: "",
    };
    if (!updateData.title_en)
      newErrors.title_en = t("UpdateQuestion:errors.title_en_required");
    if (!updateData.title_ar)
      newErrors.title_ar = t("UpdateQuestion:errors.title_ar_required");
    if (!updateData.type)
      newErrors.type = t("UpdateQuestion:errors.type_required");

    const isValid = Object.values(newErrors).every((error) => error === "");
    setClientSideErrors(newErrors);
    return { isValid, newErrors };
  };

  const focusOnError = (errs: Record<string, string | string[]>) => {
    const errorEntry = Object.entries(errs).find(
      ([_, value]) =>
        (typeof value === "string" && value !== "") ||
        (Array.isArray(value) && value.length > 0)
    );

    if (errorEntry) {
      const fieldName = errorEntry[0];
      const ref = inputRefs?.current[fieldName];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => ref.focus({ preventScroll: true }), 300);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, newErrors } = validate();
    if (!isValid) {
      focusOnError(newErrors);
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...updateData,
        is_required: updateData.is_required ? 1 : 0,
      };

      await mutateAsync({ questionData: payload, id: id! });
      navigate("/admin/questions", {
        state: { successEdit: t("UpdateQuestion:update_success") },
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateQuestion:errors.global"),
        }));
        return;
      }
      const rawErrors = error?.response?.data.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: any = {};
        rawErrors.forEach((err: any) => {
          if (!formattedErrors[err.code]) formattedErrors[err.code] = [];
          formattedErrors[err.code].push(err.message);
        });
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
        focusOnError(formattedErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateQuestion:errors.general"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getPageStatus = () => {
    if (!id) return PageStatus.NOT_FOUND;
    if (isLoading) return PageStatus.LOADING;
    if (isError) return PageStatus.ERROR;
    if (!questionData) return PageStatus.NOT_FOUND;
    return PageStatus.SUCCESS;
  };

  const getErrorMessage = (): string | undefined => {
    if (isError) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401 || status === 403)
        return t("UpdateQuestion:errors.global");
      return t("UpdateQuestion:errors.general");
    }
    return undefined;
  };

  return (
    <>
      <SEO
        title={{
          ar: `تحديث سؤال ${updateData.title_ar || ""}`,
          en: `Update Question ${updateData.title_en || ""}`,
        }}
        description={{
          ar: `صفحة تحديث سؤال المنتج في لوحة الإدارة`,
          en: `Product Question Update Page in Admin Dashboard`,
        }}
        robotsTag="noindex, nofollow"
      />

      <PageStatusHandler
        status={getPageStatus()}
        loadingText={t("UpdateQuestion:loading")}
        notFoundText={t("UpdateQuestion:not_found")}
        errorMessage={getErrorMessage()}
        onRetry={() => refetch()}
      >
        <div className="p-4 border-b dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("UpdateQuestion:update_title")}
          </h3>
        </div>

        {(errors.global || errors.general) && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.global || errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 px-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
            <div>
              <Label htmlFor="title_ar">
                {t("UpdateQuestion:title_label_ar")}
              </Label>
              <Input
                name="title_ar"
                id="title_ar"
                value={updateData.title_ar}
                onChange={handleChange}
                ref={(el) => (inputRefs.current["title_ar"] = el)}
              />
              {clientSideErrors.title_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.title_ar}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title_en">
                {t("UpdateQuestion:title_label_en")}
              </Label>
              <Input
                name="title_en"
                id="title_en"
                value={updateData.title_en}
                onChange={handleChange}
                ref={(el) => (inputRefs.current["title_en"] = el)}
              />
              {clientSideErrors.title_en && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.title_en}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="type">{t("UpdateQuestion:type_label")}</Label>
              <Select
                id="type"
                options={[
                  {
                    label: t("UpdateQuestion:type_single"),
                    value: "single_choice",
                  },
                  {
                    label: t("UpdateQuestion:type_multi"),
                    value: "multiple_choice",
                  },
                ]}
                onChange={(val) => handleSelectChange("type", val)}
                value={updateData.type}
              />
              {clientSideErrors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {clientSideErrors.type}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">{t("UpdateQuestion:status_label")}</Label>
              <Select
                id="status"
                options={[
                  { label: t("UpdateQuestion:active"), value: "active" },
                  { label: t("UpdateQuestion:inactive"), value: "inactive" },
                ]}
                onChange={(val) => handleSelectChange("status", val)}
                value={updateData.status}
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="is_required"
                name="is_required"
                checked={updateData.is_required}
                onChange={handleChange}
                className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
              />
              <Label htmlFor="is_required" className="!mb-0 cursor-pointer">
                {t("UpdateQuestion:required_label")}
              </Label>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="description_ar">
                  {t("UpdateQuestion:desc_label_ar")}
                </Label>
                <Input
                  name="description_ar"
                  id="description_ar"
                  value={updateData.description_ar}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description_en">
                  {t("UpdateQuestion:desc_label_en")}
                </Label>
                <Input
                  name="description_en"
                  id="description_en"
                  value={updateData.description_en}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {loading
              ? t("UpdateQuestion:loading_button")
              : t("UpdateQuestion:submit_button")}
          </button>
        </form>
      </PageStatusHandler>
    </>
  );
};

export default UpdateQuestionPage;
