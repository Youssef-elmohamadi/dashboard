import SEO from "../../common/SEO/seo";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import useOnlineStatus from "../../../context/useOnlineStatus";
const PageStatus = {
  LOADING: "loading",
  ERROR: "error",
  NOT_FOUND: "notFound",
  SUCCESS: "success",
  OFFLINE: "offline",
};
const translations = {
  ar: {
    noInternetTitle: " لا يوجد اتصال",
    noInternetDescription: "لا يوجد اتصال بالإنترنت.",
    noInternetMessage:
      "لا يوجد اتصال بالإنترنت، يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    loadingTitle: " تحميل",
    loadingDescription: "جاري التحميل",
    loadingMessage: "جاري تحميل البيانات...",
    errorTitle: " خطأ",
    errorDescription: "حدث خطأ",
    errorMessage: "عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    notFoundTitle: " غير موجود",
    notFoundDescription: "العنصر المطلوب غير موجود.",
    notFoundMessage: "الصفحة التي تبحث عنها غير موجودة.",
    retryButton: "حاول مرة أخرى",
  },
  en: {
    noInternetTitle: "No Internet",
    noInternetDescription: "No internet connection.",
    noInternetMessage:
      "No internet connection, please check your network and try again.",
    loadingTitle: "Loading",
    loadingDescription: "Loading data...",
    loadingMessage: "Loading data...",
    errorTitle: "Error",
    errorDescription: "An error occurred",
    errorMessage: "Sorry, something went wrong. Please try again.",
    notFoundTitle: "Not Found",
    notFoundDescription: "Requested item not found.",
    notFoundMessage: "The page you're looking for doesn't exist.",
    retryButton: "Retry",
  },
};

const seoData = {
  noInternet: {
    title: {
      ar: translations.ar.noInternetTitle,
      en: translations.en.noInternetTitle,
    },
    description: {
      ar: translations.ar.noInternetDescription,
      en: translations.en.noInternetDescription,
    },
  },
  loading: {
    title: {
      ar: translations.ar.loadingTitle,
      en: translations.en.loadingTitle,
    },
    description: {
      ar: translations.ar.loadingDescription,
      en: translations.en.loadingDescription,
    },
  },
  error: {
    title: { ar: translations.ar.errorTitle, en: translations.en.errorTitle },
    description: {
      ar: translations.ar.errorDescription,
      en: translations.en.errorDescription,
    },
  },
  notFound: {
    title: {
      ar: translations.ar.notFoundTitle,
      en: translations.en.notFoundTitle,
    },
    description: {
      ar: translations.ar.notFoundDescription,
      en: translations.en.notFoundDescription,
    },
  },
};

const PageStatusHandler = ({
  status,
  loadingText,
  errorMessage,
  onRetry,
  children,
  LoadingComponent,
}: any) => {
  const { lang } = useDirectionAndLanguage();
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <>
        <SEO
          title={seoData.noInternet.title}
          description={seoData.noInternet.description}
          robotsTag="noindex, nofollow"
        />
        <div className="flex flex-col items-center justify-center p-8 text-center text-red-500 dark:text-red-400">
          <img
            src="/images/error/nointernet.svg"
            alt="No internet connection"
            className="w-64 h-auto"
          />
          <p className="mt-4">{translations[lang].noInternetMessage}</p>
        </div>
      </>
    );
  }

  switch (status) {
    case PageStatus.LOADING:
      return (
        <>
          <SEO
            title={seoData.loading.title}
            description={seoData.loading.description}
            robotsTag="noindex, nofollow"
          />
          {LoadingComponent ? (
            <LoadingComponent />
          ) : (
            <p className="text-center mt-10 text-gray-500 dark:text-gray-300">
              {loadingText || translations[lang].loadingMessage}
            </p>
          )}
        </>
      );
    case PageStatus.ERROR:
      return (
        <>
          <SEO
            title={seoData.error.title}
            description={seoData.error.description}
            robotsTag="noindex, nofollow"
          />
          <div className="flex flex-col items-center justify-center p-8 text-center text-red-500 dark:text-red-400">
            <img
              src="/images/error/general_error.svg"
              alt="Error occurred"
              className="w-64 h-auto"
            />
            <p className="mt-4">
              {errorMessage || translations[lang].errorMessage}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 transition-colors"
              >
                {translations[lang].retryButton}
              </button>
            )}
          </div>
        </>
      );
    case PageStatus.NOT_FOUND:
      return (
        <>
          <SEO
            title={seoData.notFound.title}
            description={seoData.notFound.description}
            robotsTag="noindex, nofollow"
          />
          <div className="text-center p-8 text-gray-500 dark:text-gray-300">
            <img
              src="/images/error/notfound.svg"
              alt="Page not found"
              className="w-64 h-auto mx-auto"
            />
            <p className="mt-4">{translations[lang].notFoundMessage}</p>
          </div>
        </>
      );
    case PageStatus.SUCCESS:
      return <>{children}</>;
    default:
      return null;
  }
};

export default PageStatusHandler;
export { PageStatus };
