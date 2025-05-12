import React, { useEffect, useState } from "react";
import { productsReport } from "../../../api/AdminApi/productsReportApi/_requests";
import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/productReports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { useTranslation } from "react-i18next";
const ProductReports = () => {
  const [totalProductSell, setTotalProductSell] = useState([]);
  const [numbersData, setNumbersData] = useState({
    allProduct: 0,
    activeProduct: 0,
    inactiveProduct: 0,
    outOfStockProduct: 0,
    lowStockProduct: 0,
  });
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await productsReport();
        const productReportData = response.data.data;
        setNumbersData({
          allProduct: productReportData.allProduct,
          activeProduct: productReportData.activeProduct,
          inactiveProduct: productReportData.inactiveProduct,
          outOfStockProduct: productReportData.outOfStockProduct,
          lowStockProduct: productReportData.lowStockProduct,
        });

        setTotalProductSell(
          productReportData.topSellingProducts?.map((product: any) => ({
            productId: product.id,
            productName: product.name,
            productSoldCount: product.total_sold,
          })) || []
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchHomeData();
  }, []);
  const [searchValues, setSearchValues] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: "",
    end_date: "",
  });

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { t } = useTranslation(["ProductsReports"]);
  return (
    <>
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
