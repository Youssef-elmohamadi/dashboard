import { Helmet } from "react-helmet-async";
import i18n from "../../../i18n";

type SEOProps = {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords?: { ar: string | string[]; en: string | string[] };
  image?: string;
  url?: string;
  alternates?: { lang: string; href: string }[];
};

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  alternates,
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

  const pageUrl = url || "https://tashtiba.com/en/";
  const pageImage = image || "/favicon.png";

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Hreflang tags */}
      {alternates?.map((alt) => (
        <link
          key={alt.lang}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.href}
        />
      ))}
      {/* Add a self-referencing hreflang for the current page */}
      <link rel="alternate" hrefLang={currentLang} href={pageUrl} />
      {/* Optionally, add an x-default hreflang if you have a default language page */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://tashtiba.com/en/"
      />
    </Helmet>
  );
};

export default SEO;
