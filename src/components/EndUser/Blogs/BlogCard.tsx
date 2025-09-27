import { Link } from "react-router";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";

interface Article {
  id: number;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
}
const ArticleCard = ({ article }: { article: Article }) => {
  const { t } = useTranslation("Blogs");
  // A utility function to strip HTML tags and get the first few sentences
  const stripHtml = (html: string): string => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    // Get the first 200 characters as a summary
    return text.substring(0, 200) + (text.length > 200 ? "..." : "");
  };

  // Function to extract the first image URL from the content
  const extractImageUrl = (content: string): string | null => {
    if (!content) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : null;
  };
  const { lang } = useDirectionAndLanguage();
  const imageUrl = extractImageUrl(article[`content_${lang}`]);
  const summary = stripHtml(article[`content_${lang}`]);

  return (
    <div className="rounded-xl overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl || "/og-image.png"}
            alt={article[`title_${lang}`]}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <article className="p-6">
        <h3 className="text-xl font-bold mb-2 text-brand-500">
          {article[`title_${lang}`]}
        </h3>
        <p className="text-black text-sm mb-4 leading-relaxed">{summary}</p>
        <Link
          to={`${article.id}`}
          className="inline-block px-4 py-2 text-sm font-medium rounded-full   text-white  bg-brand-500 hover:bg-[#C0392B] transition-colors duration-300"
        >
          {t("readMore")}
        </Link>
      </article>
    </div>
  );
};

export default ArticleCard;
