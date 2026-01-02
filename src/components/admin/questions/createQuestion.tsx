import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import { useCreateProductQuestion } from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";
import SEO from "../../../components/common/SEO/seo";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";

interface QuestionData {
  title_en: string;
  title_ar: string;
  type: "single_choice" | "multiple_choice" | "";
  description_en: string;
  description_ar: string;
  is_required: boolean;
  status: "active" | "inactive";
}

interface QuestionErrors {
  title_en: string[];
  title_ar: string[];
  type: string[];
  description_en: string[];
  description_ar: string[];
  global: string;
  general: string;
}

export default function CreateQuestion() {
  const { t } = useTranslation("CreateQuestion");
  const navigate = useNavigate();
  const isCurrentlyOnline = useCheckOnline();
  const { mutateAsync } = useCreateProductQuestion();

  const [formData, setFormData] = useState<QuestionData>({
    title_en: "",
    title_ar: "",
    type: "",
    description_en: "",
    description_ar: "",
    is_required: false,
    status: "active",
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
  const inputRefs = useRef<Record<string, HTMLInputElement | any>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
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

    if (!formData.title_en)
      newErrors.title_en = t("CreateQuestion:errors.title_en_required");
    if (!formData.title_ar)
      newErrors.title_ar = t("CreateQuestion:errors.title_ar_required");
    if (!formData.type)
      newErrors.type = t("CreateQuestion:errors.type_required");

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
      const ref = inputRefs.current[fieldName];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => ref.focus({ preventScroll: true }), 300);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentlyOnline()) {
      toast.error(t("CreateQuestion:errors.no_internet"));
      return;
    }

    const { isValid, newErrors } = validate();
    if (!isValid) {
      focusOnError(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        is_required: formData.is_required ? 1 : 0,
      };
      await mutateAsync(payload);
      navigate("/admin/product_questions", {
        state: { successCreate: t("CreateQuestion:create_success") },
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("CreateQuestion:errors.global"),
        }));
        return;
      }
      const rawErrors = error?.response?.data?.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: any = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) formattedErrors[err.code] = [];
          formattedErrors[err.code].push(err.message);
        });
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
        focusOnError(formattedErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("CreateQuestion:errors.general"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SEO
        title={{ ar: "إنشاء سؤال جديد", en: "Create New Question" }}
        description={{
          ar: "صفحة إنشاء سؤال جديد للمنتجات",
          en: "Page to create a new product question",
        }}
        robotsTag="noindex, nofollow"
      />

      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateQuestion:create_title")}
        </h3>
      </div>

      {(errors.global || errors.general) && (
        <p className="text-red-500 text-sm mt-4 text-center">
          {errors.global || errors.general}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pt-3">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          {/* Title AR */}
          <div>
            <Label htmlFor="title_ar">
              {t("CreateQuestion:title_label_ar")}
            </Label>
            <Input
              name="title_ar"
              id="title_ar"
              value={formData.title_ar}
              onChange={handleChange}
              ref={(el) => (inputRefs.current["title_ar"] = el)}
            />
            {clientSideErrors.title_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_ar}
              </p>
            )}
          </div>

          {/* Title EN */}
          <div>
            <Label htmlFor="title_en">
              {t("CreateQuestion:title_label_en")}
            </Label>
            <Input
              name="title_en"
              id="title_en"
              value={formData.title_en}
              onChange={handleChange}
              ref={(el) => (inputRefs.current["title_en"] = el)}
            />
            {clientSideErrors.title_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_en}
              </p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <Label htmlFor="type">{t("CreateQuestion:type_label")}</Label>
            <Select
              id="type"
              options={[
                {
                  label: t("CreateQuestion:type_single"),
                  value: "single_choice",
                },
                {
                  label: t("CreateQuestion:type_multi"),
                  value: "multiple_choice",
                },
              ]}
              onChange={(val) => handleSelectChange("type", val)}
              value={formData.type}
            />
            {clientSideErrors.type && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.type}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">{t("CreateQuestion:status_label")}</Label>
            <Select
              id="status"
              options={[
                { label: t("CreateQuestion:active"), value: "active" },
                { label: t("CreateQuestion:inactive"), value: "inactive" },
              ]}
              onChange={(val) => handleSelectChange("status", val)}
              value={formData.status}
            />
          </div>

          {/* Description AR */}
          <div>
            <Label htmlFor="description_ar">
              {t("CreateQuestion:desc_label_ar")}
            </Label>
            <Input
              name="description_ar"
              id="description_ar"
              value={formData.description_ar}
              onChange={handleChange}
            />
          </div>

          {/* Description EN */}
          <div>
            <Label htmlFor="description_en">
              {t("CreateQuestion:desc_label_en")}
            </Label>
            <Input
              name="description_en"
              id="description_en"
              value={formData.description_en}
              onChange={handleChange}
            />
          </div>

          {/* Is Required */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="is_required"
              name="is_required"
              className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
              checked={formData.is_required}
              onChange={handleChange}
            />
            <Label htmlFor="is_required" className="!mb-0 cursor-pointer">
              {t("CreateQuestion:required_label")}
            </Label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading
            ? t("CreateQuestion:loading_button")
            : t("CreateQuestion:submit_button")}
        </button>
      </form>
    </div>
  );
}
