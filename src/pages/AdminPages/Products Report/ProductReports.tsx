import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/productReports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { useTranslation } from "react-i18next";
import PageMeta from "../../../components/common/PageMeta";
import { useProductData } from "../../../hooks/useProductReport";
const ProductReports = () => {
  const [totalProductSell, setTotalProductSell] = useState([]);
  const [numbersData, setNumbersData] = useState({
    allProduct: 0,
    activeProduct: 0,
    inactiveProduct: 0,
    outOfStockProduct: 0,
    lowStockProduct: 0,
  });
  const [searchValues, setSearchValues] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: "",
    end_date: "",
  });
  const { data, isLoading, isError, error } = useProductData(searchValues);

  const productsReportsData = data;
  console.log(productsReportsData);

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

  const { t } = useTranslation(["ProductsReports"]);
  return (
    <>
      <PageMeta
        title="Tashtiba | Products Report"
        description="Show Products Report"
      />
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
