import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";

interface StatisticsChartProps {
  ordersData: {
    orderPerMonth: Record<string, number>;
  };
}

export default function StatisticsChart({ ordersData }: StatisticsChartProps) {
  const { t } = useTranslation(["Home"]);

  const monthsMap = t("monthlySalesChart.months", {
    returnObjects: true,
  }) as Record<string, string>;

  const monthlyData = ordersData?.orderPerMonth ?? {};
  const sortedKeys = Object.keys(monthlyData).sort(); // e.g., ["2025-01", "2025-02", ...]

  const categories = sortedKeys.map((key) => {
    const [, month] = key.split("-");
    const paddedMonth = month.padStart(2, "0");
    return monthsMap[paddedMonth];
  });

  const orderValues = sortedKeys.map((key) => monthlyData[key]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: t("monthlySalesChart.tooltipLabel"),
      data: orderValues,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("statistics.title")}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {t("statistics.subtitle")}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          {/* <ChartTab /> */}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
