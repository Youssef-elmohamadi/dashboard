import React, { useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../ui/button/Button";
import SEO from "../../common/SEO/seo";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";
import EditorWrapper from "./EditorWrapper";
import { useCreateArticle } from "../../../hooks/Api/SuperAdmin/useArticles/useSuperAdminArticles";

export interface ArticleInput {
  title_en: string;
  title_ar: string;
  content_en: string; // HTML content from TinyMCE
  content_ar: string; // HTML content from TinyMCE
  published: "1" | "0" | ""; // keep string to match select usage; convert if API needs boolean
  image?: File | null;
}

export interface ServerErrors {
  title_en: string[] | [];
  title_ar: string[] | [];
  content_en: string[] | [];
  content_ar: string[] | [];
  published: string[] | [];
  image?: string[] | [];
  global?: string;
  general?: string;
}

export interface ClientErrors {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  published: string;
  image?: string;
}
const CreateArticle: React.FC = () => {
  const { t } = useTranslation(["CreateArticle", "Meta"]);
  const navigate = useNavigate();
  const isCurrentlyOnline = useCheckOnline();
  const { mutateAsync: createArticle } = useCreateArticle();

  const [articleData, setArticleData] = useState<ArticleInput>({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    published: "",
    image: null,
  });

  //const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<ServerErrors>({
    title_en: [],
    title_ar: [],
    content_en: [],
    content_ar: [],
    published: [],
    image: [],
    global: "",
    general: "",
  });

  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    published: "",
    image: "",
  });

  /* ---------------------- Validation ---------------------- */
  const validate = () => {
    const newErrors: ClientErrors = {
      title_ar: "",
      title_en: "",
      content_ar: "",
      content_en: "",
      published: "",
      image: "",
    };

    if (!articleData.title_en)
      newErrors.title_en =
        t("CreateArticle:article.errors.title") || "Title is required";
    if (!articleData.title_ar)
      newErrors.title_ar =
        t("CreateArticle:article.errors.title") || "Title is required";
    // content should not be empty (strip html tags to check)
    const stripped_en = articleData.content_en.replace(/<[^>]+>/g, "").trim();
    if (!stripped_en)
      newErrors.content_en =
        t("CreateArticle:article.errors.content") || "Content is required";
    const stripped_ar = articleData.content_ar.replace(/<[^>]+>/g, "").trim();
    if (!stripped_ar)
      newErrors.content_ar =
        t("CreateArticle:article.errors.content") || "Content is required";
    if (!articleData.published)
      newErrors.published =
        t("CreateArticle:article.errors.published") ||
        "Select published status";

    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  /* ---------------------- Handlers ---------------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({ ...prev, [name]: value } as ArticleInput));
  };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0] ?? null;
  //     setArticleData((prev) => ({ ...prev, image: file }));
  //     if (file) {
  //       setImagePreview(URL.createObjectURL(file));
  //     } else {
  //       setImagePreview("");
  //     }
  //   };

  const handleEditorChange = (name: string, content: string) => {
    setArticleData((prev) => ({ ...prev, [name]: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      title_ar: [],
      title_en: [],
      content_ar: [],
      content_en: [],
      published: [],
      image: [],
      global: "",
      general: "",
    });

    if (!isCurrentlyOnline()) {
      toast.error(
        t("CreateArticle:article.errors.no_internet") ||
          "No internet connection"
      );
      return;
    }

    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title_ar", articleData.title_ar);
    formData.append("title_en", articleData.title_en);
    formData.append("content_ar", articleData.content_ar);
    formData.append("content_en", articleData.content_en);
    formData.append("published", articleData.published);
    if (articleData.image) formData.append("image", articleData.image as File);

    try {
      await createArticle(formData);

      navigate("/super_admin/articles", {
        state: {
          successCreate:
            t("CreateArticle:article.success") || "Article created",
        },
      });
    } catch (error: any) {
      console.error("Error creating article:", error);
      const status = error?.response?.status;

      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global:
            t("CreateArticle:article.errors.global") || "Permission error",
        }));
        setIsSubmitting(false);
        return;
      }

      const rawErrors = error?.response?.data?.errors;

      if (Array.isArray(rawErrors)) {
        const formatted: Record<string, string[]> = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formatted[err.code]) formatted[err.code] = [];
          formatted[err.code].push(err.message);
        });
        setErrors((prev) => ({ ...prev, ...formatted }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            t("CreateArticle:article.errors.general") || "Something went wrong",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title={{
          ar: "إنشاء مقال جديد (سوبر أدمن)",
          en: "Create New Article (Super Admin)",
        }}
        description={{
          ar: "صفحة إنشاء مقال جديد بواسطة المشرف العام. أدخل العنوان، المحتوى بصيغة HTML، وحالة النشر.",
          en: "Create a new article by Super Admin. Enter title, HTML content, and published status.",
        }}
        keywords={{
          ar: ["مقال", "إنشاء مقال", "سوبر أدمن", "محتوى HTML"],
          en: ["article", "create article", "super admin", "html content"],
        }}
        robotsTag="noindex, nofollow"
      />

      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateArticle:article.title") || "Create Article"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {errors.global && (
          <p className="text-red-500 text-sm text-center">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="title_en">
              {t("CreateArticle:article.fields.title_en") || "Title (English)"}
            </Label>
            <Input
              name="title_en"
              value={articleData.title_en}
              onChange={handleChange}
              placeholder={
                t("CreateArticle:article.placeholders.title_en") ||
                "Enter title"
              }
            />
            {errors.title_en?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.title_en[0]}</p>
            )}
            {clientSideErrors.title_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_en}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="title_ar">
              {t("CreateArticle:article.fields.title_ar") || "Title (Arabic)"}
            </Label>
            <Input
              name="title_ar"
              value={articleData.title_ar}
              onChange={handleChange}
              placeholder={
                t("CreateArticle:article.placeholders.title_ar") ||
                "Enter title"
              }
            />
            {errors.title_ar?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.title_ar[0]}</p>
            )}
            {clientSideErrors.title_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_ar}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="published">
              {t("CreateArticle:article.fields.published") || "Published"}
            </Label>
            <Select
              value={articleData.published}
              onChange={(value) =>
                setArticleData((prev) => ({
                  ...prev,
                  published: value as "1" | "0",
                }))
              }
              options={[
                {
                  value: "1",
                  label:
                    t("CreateArticle:article.options.published") || "Published",
                },
                {
                  value: "0",
                  label:
                    t("CreateArticle:article.options.unpublished") || "Draft",
                },
              ]}
              placeholder={
                t("CreateArticle:article.placeholders.published") ||
                "Select status"
              }
            />
            {errors.published?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.published[0]}</p>
            )}
            {clientSideErrors.published && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.published}
              </p>
            )}
          </div>
        </div>

        {/* Content editor (TinyMCE) */}
        <div>
          <Label htmlFor="content_en">
            {t("CreateArticle:article.fields.content_en") ||
              "Content (English)"}
          </Label>
          <EditorWrapper
            name="content_en"
            value={articleData.content_en}
            onChange={handleEditorChange}
          />

          {errors.content_en?.[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.content_en[0]}</p>
          )}
          {clientSideErrors.content_en && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.content_en}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="content_ar">
            {t("CreateArticle:article.fields.content_ar") || "Content (Arabic)"}
          </Label>
          <EditorWrapper
            name="content_ar"
            value={articleData.content_ar}
            onChange={handleEditorChange}
          />

          {errors.content_ar?.[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.content_ar[0]}</p>
          )}
          {clientSideErrors.content_ar && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.content_ar}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? t("CreateArticle:article.submitting") || "Submitting..."
            : t("CreateArticle:article.submit") || "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default CreateArticle;
