import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useGetArticleById } from "../../../hooks/Api/SuperAdmin/useArticles/useSuperAdminArticles";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import LazyImage from "../../common/LazyImage";

export interface Author {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string | null;
  phone?: string | null;
  status?: string;
}

export interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string; // HTML
  content_en: string; // HTML
  slug?: string;
  admin_id?: number;
  published?: number | boolean;
  created_at?: string | null;
  updated_at?: string | null;
  author?: Author | null;
}

/* ---------------------- Component ---------------------- */

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(["ArticleDetails"]);
  const { data, isLoading, isError, error, refetch } = useGetArticleById(id);

  const article: Article | undefined = data;

  // helper: format timestamp (keep same format as BannerDetails)
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // page status mapping
  let pageStatus = PageStatus.SUCCESS;
  let pageError = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    if (
      axiosError?.response?.status === 401 ||
      axiosError?.response?.status === 403
    ) {
      pageError =
        t("article.errors.global") || t("global_error") || "Permission error";
    } else {
      pageError =
        t("article.errors.general") ||
        t("general_error") ||
        "Something went wrong";
    }
  } else if (!article) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const { lang } = useDirectionAndLanguage();

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={pageError}
      onRetry={() => refetch()}
    >
      <div className="article-details p-6 max-w-5xl mx-auto space-y-8">
        <SEO
          title={{
            ar: `تفاصيل المقال ${article?.title_ar || ""}`,
            en: `Article Details ${article?.title_en || ""} (Super Admin)`,
          }}
          description={{
            ar: `استعرض التفاصيل الكاملة للمقال "${
              article?.title_ar || ""
            }" بواسطة المشرف العام.`,
            en: `View full details for article "${
              article?.title_en || ""
            }" by Super Admin.`,
          }}
          keywords={{
            ar: ["مقال", "تفاصيل المقال", "إدارة المقالات", "سوبر أدمن"],
            en: [
              "article",
              "article details",
              "article management",
              "super admin",
            ],
          }}
          robotsTag="noindex, nofollow"
        />

        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          {t("article.title") || "Article Details"}
        </h1>

        {/* Basic Info */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
            {t("article.basicInfo") || "Basic Info"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("article.fields.title") || "Title"}:</strong>{" "}
              {article?.[`title_${lang}`]|| "-"} 
            </p>

            <p>
              <strong>{t("article.fields.published") || "Published"}:</strong>{" "}
              {article?.published ? t("yes") : t("no")}
            </p>

            <p>
              <strong>{t("article.fields.slug") || "Slug"}:</strong>{" "}
              {article?.slug || t("unknown")}
            </p>

            <p>
              <strong>{t("article.fields.author") || "Author"}:</strong>{" "}
              {article?.author
                ? `${article.author.first_name || ""} ${
                    article.author.last_name || ""
                  }`
                : t("unknown")}
            </p>
          </div>
        </section>

        {/* Content (HTML) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
            {t("article.contentHeading") || "Content"}
          </h2>

          <div className="prose dark:prose-invert max-w-full">
            {/* dangerouslySetInnerHTML used with DOMPurify sanitized content */}
            <div
              dangerouslySetInnerHTML={{
                __html: article?.[`content_${lang}`] || "",
              }}
            />
          </div>
        </section>

        {/* Author / meta */}
        {article?.author && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              {t("article.authorHeading") || "Author"}
            </h2>
            <div className="flex items-center gap-4">
              {article.author.avatar ? (
                <LazyImage
                  src={article.author.avatar}
                  alt="author"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600">
                  {(article.author.first_name?.[0] || "A").toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{`${
                  article.author.first_name || ""
                } ${article.author.last_name || ""}`}</p>
                <p className="text-sm text-gray-500">{article.author.email}</p>
                {article.author.phone && (
                  <p className="text-sm text-gray-500">
                    {article.author.phone}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Timestamps */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t("article.timestamps") || "Timestamps"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("article.createdAt") || "Created At"}:</strong>{" "}
              {formatDate(article?.created_at)}
            </p>
            <p>
              <strong>{t("article.updatedAt") || "Updated At"}:</strong>{" "}
              {formatDate(article?.updated_at)}
            </p>
          </div>
        </section>
      </div>
    </PageStatusHandler>
  );
};

export default ArticleDetails;
