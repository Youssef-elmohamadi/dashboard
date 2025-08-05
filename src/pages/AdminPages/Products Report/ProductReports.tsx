import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { useTranslation } from "react-i18next";
import SEO from "../../../components/common/SEO/seo";
import { useProductData } from "../../../hooks/Api/Admin/useProductsReports/useProductReport";
import PageStatusHandler, {
  PageStatus,
} from "../../../components/common/PageStatusHandler/PageStatusHandler";
import { AxiosError } from "axios";

const ProductReports = () => {
  const [totalProductSell, setTotalProductSell] = useState([]);
  const [numbersData, setNumbersData] = useState({
    allProduct: 0,
    activeProduct: 0,
    inactiveProduct: 0,
    outOfStockProduct: 0,
    lowStockProduct: 0,
  });

  const [searchValues, setSearchValues] = useState({
    start_date: "",
    end_date: "",
  });

  const { t } = useTranslation(["ProductsReports", "Meta"]);

  const {
    data: productsReportsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductData(searchValues);

  useEffect(() => {
    if (productsReportsData) {
      setNumbersData({
        allProduct: productsReportsData.allProduct,
        activeProduct: productsReportsData.activeProduct,
        inactiveProduct: productsReportsData.inactiveProduct,
        outOfStockProduct: productsReportsData.outOfStockProduct,
        lowStockProduct: productsReportsData.lowStockProduct,
      });
      setTotalProductSell(productsReportsData.topSellingProducts);
    }
  }, [productsReportsData]);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getPageStatus = () => {
    if (isLoading) return PageStatus.LOADING;
    if (isError) return PageStatus.ERROR;
    if (!productsReportsData) return PageStatus.NOT_FOUND;
    return PageStatus.SUCCESS;
  };

  const getErrorMessage = (): string | undefined => {
    if (isError) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401) {
        return t("ProductsReports:unauthorized");
      }
      return t("ProductsReports:somethingWentWrong");
    }
    return undefined;
  };

  const handleRetry = () => {
    refetch();
  };

  const pageStatus = getPageStatus();
  const errorMessage = getErrorMessage();

  return (
    <>
      <SEO
        title={{
          ar: "تشطيبة - تقارير المنتجات",
          en: "Tashtiba - Product Reports",
        }}
        description={{
          ar: "استعرض تقارير شاملة عن أداء المنتجات في متجر تشطيبة، بما في ذلك إحصائيات المنتجات النشطة وغير النشطة، نفاد المخزون، والمنتجات الأكثر مبيعاً.",
          en: "View comprehensive product performance reports for Tashtiba store, including statistics on active and inactive products, out-of-stock items, and top-selling products.",
        }}
        keywords={{
          ar: [
            "تقارير المنتجات",
            "إحصائيات المنتجات",
            "إدارة المخزون",
            "المنتجات الأكثر مبيعًا",
            "تشطيبة",
            "تحليل المنتجات",
            "تقرير المخزون",
          ],
          en: [
            "product reports",
            "product statistics",
            "inventory management",
            "top selling products",
            "Tashtiba",
            "product analytics",
            "stock report",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <FilterRangeDate setSearchParam={handleFilter} />

      <PageStatusHandler
        status={pageStatus}
        loadingText={t("ProductsReports:loading")}
        errorMessage={errorMessage}
        notFoundText={t("ProductsReports:noData")}
        onRetry={handleRetry}
      >
        <div className="col-span-6 space-y-6">
          <EcommerceMetrics
            parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
            metrics={[
              {
                label: t("ProductsReports:allProducts"),
                value: numbersData.allProduct,
                percentage: 11.01,
                icon: GroupIcon,
              },
              {
                label: t("ProductsReports:activeProducts"),
                value: numbersData.activeProduct,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("ProductsReports:inactiveProducts"),
                value: numbersData.inactiveProduct,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("ProductsReports:outOfStockProducts"),
                value: numbersData.outOfStockProduct,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("ProductsReports:lowStockProducts"),
                value: numbersData.lowStockProduct,
                percentage: -9.05,
                icon: BoxIconLine,
              },
            ]}
          />
        </div>
        <div className="col-span-12 xl:col-span-7 mt-3">
          <TopSelligProducts products={totalProductSell} />
        </div>
      </PageStatusHandler>
    </>
  );
};

export default ProductReports;
