import { Helmet } from "react-helmet-async";
import i18n from "../../../i18n";

type SEOProps = {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords?: { ar: string | string[]; en: string | string[] };
  image?: string;
  url?: string;
  alternates?: { lang: string; href: string }[];
  robotsTag?: "index, follow" | "noindex, nofollow";
};

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  alternates,
  robotsTag = "index, follow",
}: SEOProps) => {
  const currentLang = i18n.language;
  const isArabic = currentLang === "ar";

  const pageTitle = isArabic ? title.ar : title.en;
  const pageDescription = isArabic ? description.ar : description.en;

  const selectedKeywords = isArabic ? keywords?.ar : keywords?.en;
  const metaKeywords = selectedKeywords
    ? Array.isArray(selectedKeywords)
      ? selectedKeywords.join(", ")
      : selectedKeywords
    : undefined;

  const pageUrl = url;
  const pageImage = image || "/favicon.png";

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      <meta name="robots" content={robotsTag} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {alternates?.map((alt) => (
        <link
          key={alt.lang}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.href}
        />
      ))}
    </Helmet>
  );
};

export default SEO;
