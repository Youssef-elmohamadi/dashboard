import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../../common/SEO/seo";
import { AxiosError } from "axios";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useGetRequestById } from "../../../hooks/Api/SuperAdmin/useRequestsQuotation/useSuperAdminRequestQuotationManage";
import TableStatus from "../../common/Tables/TableStatus";

const RFQDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["QuotationDetails"]);
  const { lang } = useDirectionAndLanguage();
  const { data, isLoading, error, isError } = useGetRequestById(id!);
  console.log(data);

  const rfq = data?.data?.data;

  let pageStatus = PageStatus.SUCCESS;
  let pageError = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    pageError =
      axiosError?.response?.status === 401 ||
      axiosError?.response?.status === 403
        ? t("global_error")
        : t("general_error");
  } else if (!rfq) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (date: string | null) => {
    if (!date) return t("not_available");
    return new Date(date).toLocaleDateString(
      lang === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("requestsPage.table.loadingText")}
      errorMessage={pageError}
      notFoundMessage={t("not_found")}
    >
      <SEO
        title={{
          ar: `تفاصيل طلب ${rfq?.name || ""} (سوبر أدمن)`,
          en: `RFQ Details ${rfq?.name || ""} (Super Admin)`,
        }}
        description={{
          ar: `تفاصيل طلب ${rfq?.name || ""} (سوبر أدمن)`,
          en: `RFQ Details ${rfq?.name || ""} (Super Admin)`,
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="rfq-details p-6 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-center text-gray-800 dark:text-white mb-4">
          {t("requestsPage.details_title", "تفاصيل طلب التسعير")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول: معلومات العميل والطلب */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Basic Info */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-all">
              <h2 className="text-xl font-black mb-6 text-[#d62828] border-b pb-2">
                {t("requestsPage.sections.client_info", "بيانات العميل والطلب")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-gray-700 dark:text-white">
                <p className="flex flex-col gap-1">
                  <strong className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("columns.name")}
                  </strong>
                  <span className="font-bold text-sm">{rfq?.name}</span>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("columns.email")}
                  </strong>
                  <span className="font-bold text-sm">{rfq?.email}</span>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("fields.phone", "رقم الهاتف")}
                  </strong>
                  <span className="font-bold text-sm" >
                    {rfq?.phone}
                  </span>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("fields.address", "العنوان")}
                  </strong>
                  <span className="font-bold text-sm">{rfq?.address}</span>
                </p>
                <div className="col-span-full flex flex-col gap-1 mt-2">
                  <strong className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("fields.description", "وصف الطلب")}
                  </strong>
                  <p className="bg-gray-50 p-4 rounded-xl text-sm leading-relaxed dark:bg-gray-800">
                    {rfq?.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Files */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-xl font-black mb-6 text-blue-700 border-b pb-2">
                {t("sections.files", "الملفات والمرفقات")}
              </h2>
              {rfq?.files && rfq.files.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rfq.files.map((file: any, index: number) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        {/* يمكنك وضع أيقونة ملف هنا */}
                        <span className="font-black text-xs">FILE</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 truncate w-full text-center">
                        {t("fields.download", "تحميل الملف")}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {t("fields.no_files", "لا توجد ملفات مرفقة لهذا الطلب.")}
                </p>
              )}
            </section>
          </div>

          {/* العمود الثاني: الحالة والتواريخ (Sidebar) */}
          <div className="space-y-8">
            {/* Status Card */}
            <section className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                {t("columns.status")}
              </h3>
              <div className="flex items-center justify-between">
                <TableStatus status={rfq?.status || ""} />
                <span className="text-[10px] text-gray-400">
                  {t("fields.current_status", "الحالة الحالية")}
                </span>
              </div>
            </section>

            {/* Admin & Timestamps Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-sm font-black mb-6 uppercase tracking-widest text-gray-400">
                {t("sections.timestamps", "سجل المراجعة")}
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <strong className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {t("fields.created_at")}
                  </strong>
                  <span className="text-xs font-bold">
                    {formatDate(rfq?.created_at)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {t("fields.reviewed_at", "تاريخ المراجعة")}
                  </strong>
                  <span className="text-xs font-bold">
                    {formatDate(rfq?.reviewed_at)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {t("fields.admin_notes", "ملاحظات الأدمن")}
                  </strong>
                  <p className="text-xs font-medium text-gray-600 italic">
                    {rfq?.admin_notes ||
                      t("fields.no_notes", "لا توجد ملاحظات")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageStatusHandler>
  );
};

export default RFQDetails;
