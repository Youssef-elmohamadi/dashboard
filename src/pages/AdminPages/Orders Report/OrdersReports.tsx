import React, { useEffect, useState } from "react";
import { productsReport } from "../../../api/AdminApi/productsReportApi/_requests";
import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/productReports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { ordersReport } from "../../../api/AdminApi/ordersReports/_requests";
const ProductReports = () => {
  const [totalProductSell, setTotalProductSell] = useState([]);
  const [numbersData, setNumbersData] = useState({
    orderCount: 0,
    deliveredOrdersCount: 0,
    cancelledOrdersCount: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
  });
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await ordersReport();
        const ordersReportsData = response.data.data;
        setNumbersData({
          orderCount: ordersReportsData.orderCount,
          deliveredOrdersCount: ordersReportsData.deliveredOrdersCount,
          cancelledOrdersCount: ordersReportsData.cancelledOrdersCount,
          totalItemsSold: ordersReportsData.totalItemsSold,
          averageOrderValue: ordersReportsData.averageOrderValue,
        });
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
  console.log(totalProductSell);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <>
      <FilterRangeDate setSearchParam={handleFilter} />
      <div className="col-span-6 space-y-6 ">
        <EcommerceMetrics
          parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
          metrics={[
            {
              label: "Orders Count",
              value: numbersData.orderCount,
              percentage: 11.01,
              icon: GroupIcon,
            },
            {
              label: "Delivered Orders Count",
              value: numbersData.deliveredOrdersCount,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: "Total Items Sold",
              value: numbersData.totalItemsSold,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: "cancelled Orders Count",
              value: numbersData.cancelledOrdersCount,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: "Average Order Value",
              value: numbersData.averageOrderValue.toFixed(2) ,
              percentage: -9.05,
              icon: BoxIconLine,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ProductReports;
