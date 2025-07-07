import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { useTranslation } from "react-i18next";
import PageMeta from "../../../components/common/SEO/PageMeta";
import { useProductData } from "../../../hooks/Api/Admin/useProductsReports/useProductReport";

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

  const [generalError, setGeneralError] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const { data, isLoading, isError, error } = useProductData(searchValues);
  const productsReportsData = data;

  const { t } = useTranslation(["ProductsReports"]);

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

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      if (err?.response?.status === 401) {
        setUnauthorized(t("unauthorized"));
      } else {
        setGeneralError(t("somethingWentWrong"));
      }
    }
  }, [isError, error, t]);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Show Products Report" />
        <p className="text-center mt-5">{t("loading")}</p>
      </>
    );
  }

  if (unauthorized) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Show Products Report" />
        <p className="text-center text-red-500 mt-5">{unauthorized}</p>
      </>
    );
  }

  if (generalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Show Products Report" />
        <p className="text-center text-red-500 mt-5">{generalError}</p>
      </>
    );
  }

  return (
    <>
      <PageMeta title={t("mainTitle")} description="Show Products Report" />
      <FilterRangeDate setSearchParam={handleFilter} />
      <div className="col-span-6 space-y-6 ">
        <EcommerceMetrics
          parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
          metrics={[
            {
              label: t("allProducts"),
              value: numbersData.allProduct,
              percentage: 11.01,
              icon: GroupIcon,
            },
            {
              label: t("activeProducts"),
              value: numbersData.activeProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("inactiveProducts"),
              value: numbersData.inactiveProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("outOfStockProducts"),
              value: numbersData.outOfStockProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("lowStockProducts"),
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
    </>
  );
};

export default ProductReports;
