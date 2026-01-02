import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useGetTransportationPriceById } from "../../../hooks/Api/SuperAdmin/useTransports/useSuperAdminTransports";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const TransportDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["TransportDetails", "Meta"]);
  const { lang } = useDirectionAndLanguage();
  const {
    data: transportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTransportationPriceById(id);

  const transport = transportData;

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
      pageError = t("global_error");
    } else {
      pageError = t("general_error");
    }
  } else if (!transport) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const vehicleTypes: Record<string, string> = {
    jumbo: "جامبو (نقل كبير)",
    tanker: "تانكر (صهريج)",
    flatbed: "سطحة (نقل مفتوح)",
    container: "كونتينر (حاوية شحن)",
    refrigerated: "تلاجة (نقل مبرد)",
  };

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={pageError}
      onRetry={() => refetch()}
    >
      <div className="transport-details p-6 max-w-4xl mx-auto space-y-8">
        <SEO
          title={{
            ar: `تفاصيل سعر النقل (${transport?.area_ar || ""})`,
            en: `Transport Details (${transport?.area_ar || ""}) (Super Admin)`,
          }}
          description={{
            ar: `تفاصيل سعر النقل في منطقة ${
              transport?.area_ar || "غير معروفة"
            }ونوع المركبة ${
              vehicleTypes[transport?.vehicle_type || ""] || "غير محدد"
            }.`,
            en: `View transport details for area ${
              transport?.area_en || "unknown"
            }, and vehicle type ${transport?.vehicle_type || "unknown"}.`,
          }}
          keywords={{
            ar: [
              "تفاصيل النقل",
              "سعر النقل",
              "منطقة النقل",
              "خط النقل",
              "تفاصيل الأسعار",
              "تشطيبة",
            ],
            en: [
              "transport details",
              "transport price",
              "vehicle type",
              "line",
              "area",
              "tashtiba",
            ],
          }}
          robotsTag="noindex, nofollow"
        />

        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          {t("title")}
        </h1>

        {/* البيانات الأساسية */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
            {t("basicInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("area")}:</strong>{" "}
              {transport?.[`area_${lang}`] || t("unknown")}
            </p>
            <p>
              <strong>{t("vehicle_type")}:</strong>{" "}
              {vehicleTypes[transport?.vehicle_type || ""] || t("unknown")}
            </p>
            
            {/* التعديل هنا لعرض كلمة مجاني أو السعر */}
            <p>
              <strong>{t("fixed_price")}:</strong>{" "}
              {transport?.is_free ? (
                <span className="text-green-600 font-bold">{t("free")}</span>
              ) : transport?.fixed_price ? (
                `${transport.fixed_price} ${t("currency")}`
              ) : (
                t("notAvailable")
              )}
            </p>

            <p>
              <strong>{t("price_per_km")}:</strong>{" "}
              {transport?.price_per_km
                ? `${transport.price_per_km} ${t("currencyPerKm")}`
                : t("notAvailable")}
            </p>
          </div>
        </section>

        {/* التواريخ */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t("timestamps")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("createdAt")}:</strong>{" "}
              {formatDate(transport?.created_at)}
            </p>
            <p>
              <strong>{t("updatedAt")}:</strong>{" "}
              {formatDate(transport?.updated_at)}
            </p>
          </div>
        </section>
      </div>
    </PageStatusHandler>
  );
};

export default TransportDetails;