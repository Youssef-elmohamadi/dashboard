import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../ui/button/Button";
import Input from "../../common/input/InputField";
import Label from "../../common/form/Label";
import Select from "../../common/form/Select";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { toast } from "react-toastify";
import useCheckOnline from "../../../hooks/useCheckOnline";
import EditorWrapper from "./EditorWrapper";
import {
  useGetArticleById,
  useUpdateArticle,
} from "../../../hooks/Api/SuperAdmin/useArticles/useSuperAdminArticles";

export interface Article {
  id: number;
  title_ar?: string;
  title_en?: string;
  content_ar?: string;
  content_en?: string;
  slug?: string;
  admin_id?: number;
  published: number | boolean; // API may return 0/1 or boolean
  created_at?: string;
  updated_at?: string;
  // author omitted for brevity
}

export interface ArticleInput {
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  published: boolean; // use boolean for sending to API
}

export interface ServerErrors {
  title_ar?: string[] | [];
  title_en?: string[] | [];
  content_ar?: string[] | [];
  content_en?: string[] | [];
  published?: string[] | [];
  global?: string;
  general?: string;
}

export interface ClientErrors {
  title_ar?: string;
  title_en?: string;
  content_ar?: string;
  content_en?: string;
  published?: string;
}

const UpdateArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(["UpdateArticle"]);
  const navigate = useNavigate();
  const isCurrentlyOnline = useCheckOnline();

  // hooks (replace placeholders with your actual hooks)
  const { data, isError, error, isLoading } = useGetArticleById(id);
  console.log(data);

  const { mutateAsync: updateArticle } = useUpdateArticle(id!);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string>("");

  const [articleData, setArticleData] = useState<ArticleInput>({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    published: false,
  });

  const [errors, setErrors] = useState<ServerErrors>({});
  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({});

  /* populate state when data loaded */
  useEffect(() => {
    if (!data) return;
    setArticleData({
      title_ar: data.title_ar || "",
      title_en: data.title_en || "",
      content_ar: data.content_ar || "",
      content_en: data.content_en || "",
      // API returns 1/0 or boolean — normalize to boolean
      published: !!(
        data.published === true ||
        data.published === 1 ||
        data.published === "1"
      ),
    });
  }, [data]);

  /* handle fetch errors */
  useEffect(() => {
    if (!isError || !error) return;
    if (error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setPageError(
          t("UpdateArticle:errors.global") || "Permission denied"
        );
      } else {
        setPageError(
          t("UpdateArticle:errors.general") || "Error loading article"
        );
      }
    } else {
      setPageError(
        t("UpdateArticle:errors.general") || "Error loading article"
      );
    }
  }, [isError, error, t]);

  /* ---------------------- Validation ---------------------- */
  const validate = (): boolean => {
    const newErrors: ClientErrors = {};
    if (!articleData.title_ar || !articleData.title_ar.trim())
      newErrors.title_ar = t("errors.title_ar") || "Title (Arabic) is required";
    if (!articleData.title_en || !articleData.title_en.trim())
      newErrors.title_en =
        t("errors.title_en") || "Title (English) is required";
    // strip tags to check emptiness
    const stripped_ar = (articleData.content_ar || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (!stripped_ar)
      newErrors.content_ar =
        t("errors.content_ar") || "Content (Arabic) is required";
    const stripped_en = (articleData.content_en || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (!stripped_en)
      newErrors.content_en =
        t("errors.content_en") || "Content (English) is required";
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  /* ---------------------- Handlers ---------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "published") {
      // our Select passes "true"/"false" strings — normalize
      const boolVal = value === "true" || value === "1";
      setArticleData((prev) => ({ ...prev, published: boolVal }));
    } else {
      setArticleData(
        (prev) => ({ ...prev, [name]: value } as unknown as ArticleInput)
      );
    }
  };

  const handleEditorChange = (name: string, content: string) => {
    setArticleData((prev) => ({ ...prev, [name]: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset errors
    setErrors({});
    setIsSubmitting(true);

    if (!isCurrentlyOnline()) {
      toast.error(
        t("UpdateArticle:article.errors.no_internet") ||
          "No internet connection"
      );
      setIsSubmitting(false);
      return;
    }

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    // Build payload as JSON (API example expects JSON)
    const payload = {
      title_ar: articleData.title_ar.trim(),
      title_en: articleData.title_en.trim(),
      content_ar: articleData.content_ar,
      content_en: articleData.content_en,
      published: !!articleData.published, // ensure boolean
    };

    try {
      // NOTE: updateArticle should call your API (axios) and return promise
      await updateArticle(id, payload);

      // navigate back to list with success message (same pattern as banners)
      navigate("/super_admin/articles", {
        state: {
          successUpdate:
            t("UpdateArticle:article.success") || "Article updated",
        },
      });
    } catch (err: any) {
      console.error("Error updating article:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global:
            t("UpdateArticle:article.errors.global") || "Permission error",
        }));
      } else {
        // normalize server errors that might come as an array or object
        const rawErrors = err?.response?.data?.errors;
        if (Array.isArray(rawErrors)) {
          const formatted: Record<string, string[]> = {};
          rawErrors.forEach((er: { code: string; message: string }) => {
            if (!formatted[er.code]) formatted[er.code] = [];
            formatted[er.code].push(er.message);
          });
          setErrors((prev) => ({ ...prev, ...formatted }));
        } else if (rawErrors && typeof rawErrors === "object") {
          setErrors((prev) => ({ ...prev, ...rawErrors }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general:
              t("UpdateArticle:article.errors.general") ||
              "Something went wrong",
          }));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------- Page status ---------------------- */
  let pageStatus = PageStatus.SUCCESS;
  if (!id) pageStatus = PageStatus.NOT_FOUND;
  else if (isLoading) pageStatus = PageStatus.LOADING;
  else if (isError) pageStatus = PageStatus.ERROR;

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("UpdateArticle:loading") || "Loading..."}
      errorMessage={pageError}
      notFoundMessage={t("UpdateArticle:notFound") || "Article not found"}
    >
      <SEO
        title={{
          ar: `تحديث مقال ${data?.title || ""}`,
          en: `Update Article ${data?.title || ""} (Super Admin)`,
        }}
        description={{
          ar: `صفحة تحديث المقال "${data?.title || ""}" بواسطة المشرف العام.`,
          en: `Update article "${data?.title || ""}" by Super Admin.`,
        }}
        keywords={{
          ar: [`تحديث مقال ${data?.title || ""}`, "مقالات", "تعديل محتوى"],
          en: [
            `update article ${data?.title || ""}`,
            "articles",
            "edit content",
          ],
        }}
        robotsTag="noindex, nofollow"
      />

      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateArticle:title") || "Update Article"}
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
            <Label htmlFor="title_ar">
              {t("UpdateArticle:form.title_ar") || "Title"}
            </Label>
            <Input
              name="title_ar"
              value={articleData.title_ar}
              onChange={handleChange}
              placeholder={
                t("UpdateArticle:form.titlePlaceholder_ar") || "Enter title"
              }
            />
            {errors.title_ar &&
              Array.isArray(errors.title_ar) &&
              errors.title_ar[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title_ar[0]}
                </p>
              )}
            {clientSideErrors.title_ar && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_ar}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="title_en">
              {t("UpdateArticle:form.title_en") || "Title"}
            </Label>
            <Input
              name="title_en"
              value={articleData.title_en}
              onChange={handleChange}
              placeholder={
                t("UpdateArticle:form.titlePlaceholder_en") || "Enter title"
              }
            />
            {errors.title_en &&
              Array.isArray(errors.title_en) &&
              errors.title_en[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title_en[0]}
                </p>
              )}
            {clientSideErrors.title_en && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.title_en}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="published">
              {t("UpdateArticle:form.status") || "Published"}
            </Label>
            <Select
              value={articleData.published ? "1" : "0"}
              onChange={(value) =>
                setArticleData((prev) => ({
                  ...prev,
                  published: value === "1",
                }))
              }
              options={[
                {
                  value: "1",
                  label:
                    t("UpdateArticle:form.options.published") || "Published",
                },
                {
                  value: "0",
                  label: t("UpdateArticle:form.options.draft") || "Draft",
                },
              ]}
              placeholder={
                t("UpdateArticle:form.statusPlaceholder") || "Select status"
              }
            />
            {errors.published &&
              Array.isArray(errors.published) &&
              errors.published[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.published[0]}
                </p>
              )}
            {clientSideErrors.published && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.published}
              </p>
            )}
          </div>
        </div>

        {/* Content editor */}
        <div>
          <Label htmlFor="content_en">
            {t("UpdateArticle:form.content_en") || "Content"}
          </Label>

          {/* EditorWrapper is your TinyMCE wrapper component.
              It accepts `value` and `onChange` and returns HTML content.
              Make sure EditorWrapper has image plugin + toolbar configured if you want image button. */}

          <EditorWrapper
            value={articleData.content_en}
            name="content_en"
            onChange={handleEditorChange}
          />
          {errors.content_en &&
            Array.isArray(errors.content_en) &&
            errors.content_en[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content_en[0]}
              </p>
            )}
          {clientSideErrors.content_en && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.content_en}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="content_ar">
            {t("UpdateArticle:form.content_ar") || "Content"}
          </Label>

          {/* EditorWrapper is your TinyMCE wrapper component.
              It accepts `value` and `onChange` and returns HTML content.
              Make sure EditorWrapper has image plugin + toolbar configured if you want image button. */}

          <EditorWrapper
            value={articleData.content_ar}
            name="content_ar"
            onChange={handleEditorChange}
          />
          {errors.content_ar &&
            Array.isArray(errors.content_ar) &&
            errors.content_ar[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content_ar[0]}
              </p>
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
          className={`text-white inline-flex items-center bg-brand-600 hover:bg-brand-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? t("UpdateArticle:submitting") || "Saving..."
            : t("UpdateArticle:submit") || "Save"}
        </Button>
      </form>
    </PageStatusHandler>
  );
};

export default UpdateArticle;
