import { useEffect, useState } from "react";
import BasicTable from "../../../components/EndUser/Table/BasicTableTS";
import { useNavigate } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildOrderColumns } from "../../../components/EndUser/Table/_Colmuns";
import { useTranslation } from "react-i18next";
import {
  useAllOrdersPaginate,
  useCancelOrder,
} from "../../../hooks/Api/EndUser/useOrders/useOrders";
import { AxiosError } from "axios";
import SEO from "../../../components/common/SEO/seo"; // Your custom SEO component
import { HiOutlineDocumentText } from "react-icons/hi2"; // Icons for orders page
import { toast } from "react-toastify"; // Ensure toast is imported for messages
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const Orders = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserOrderHistory"]);
  const { lang } = useDirectionAndLanguage();
  // Brand colors from your UserProfile/UserNotifications components
  const primaryColor = "#9810fa"; // Lighter purple for accents/active states
  const secondaryColor = "#542475"; // Deeper purple for text/main elements

  const { data, isLoading, isError, refetch, error } =
    useAllOrdersPaginate(pageIndex);
  const pageSize = data?.per_page ?? 15;

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true); // Catch any other unexpected errors
      }
    }
  }, [isError, error]);

  const ordersData = data?.data ?? [];
  const totalOrders = data?.total ?? 0;

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      // Use toast for user feedback, similar to other components
      toast.error(
        t("authRequired", {
          defaultValue: "Please login first to view your orders.",
        })
      );
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, [navigate, t]); // Added 't' to dependencies

  const { mutateAsync: cancelOrderMutation } = useCancelOrder(); // Use isPending for loading state
  const handleCancel = async (id: number) => {
    await alertDelete(id, cancelOrderMutation, refetch, {
      // Pass the mutation function
      confirmTitle: t("cancelAlert.cancelTitle"),
      confirmText: t("cancelAlert.cancelText"),
      confirmButtonText: t("cancelAlert.confirmButtonText"),
      cancelButtonText: t("cancelAlert.cancelButtonText"),
      successTitle: t("cancelAlert.successTitle"),
      successText: t("cancelAlert.successText"),
      errorTitle: t("cancelAlert.errorTitle"),
      errorText: t("cancelAlert.errorText"),
    });
  };

  const columns = buildOrderColumns({
    includeOrderStatus: true,
    includeActions: true,
    includeCreatedAt: true,
    includeShippedStatus: true,
    includeTotalPrice: true,
  });

  return (
    <div className="p-4">
      <SEO
        title={{
          ar: `تشطيبة - طلباتي`,
          en: `Tashtiba - My Orders`,
        }}
        description={{
          ar: `تتبع حالة طلباتك السابقة والحالية على تشطيبة. مراجعة تفاصيل الشراء، تتبع الشحن، وإدارة طلباتك بسهولة في مصر.`,
          en: `Track the status of your past and current orders on Tashtiba. Review purchase details, track shipping, and manage your orders with ease in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "طلباتي",
            "سجل الطلبات",
            "تتبع الطلب",
            "حالة الطلب",
            "مشترياتي",
            "إدارة الطلبات",
            "تسوق أونلاين",
            "مصر",
          ],
          en: [
            "tashtiba",
            "my orders",
            "order history",
            "track order",
            "order status",
            "my purchases",
            "manage orders",
            "online shopping",
            "Egypt",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/orders" }, // Adjust if your actual orders URL is different
          { lang: "en", href: "https://tashtiba.com/en/orders" }, // Adjust if your actual orders URL is different
          { lang: "x-default", href: "https://tashtiba.com/en/orders" }, // Consider a default if you have one
        ]}
      />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl  overflow-hidden">
        {/* Page Header */}
        <div className="p-6 border-b-2" style={{ borderColor: primaryColor }}>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: secondaryColor }}
          >
            <HiOutlineDocumentText className="h-8 w-8" />
            {t("pageTitle", { defaultValue: "طلباتي" })}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("pageSubtitle", {
              defaultValue: "مراجعة وتتبع جميع طلباتك السابقة والحالية.",
            })}
          </p>
        </div>
        <BasicTable
          columns={columns}
          data={ordersData}
          totalItems={totalOrders}
          isLoading={isLoading}
          onCancel={handleCancel}
          isShowMore={true}
          isCancel={true}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          unauthorized={unauthorized}
          globalError={globalError}
          loadingText={t("ordersTable.loadingText")}
        />
      </div>
    </div>
  );
};

export default Orders;
