import { ArrowDownIcon, ArrowUpIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { FC } from "react";
interface CountType {
  all: number;
  active: number;
  inactive: number;
}

type MetricValue =
  | number
  | string
  | Record<string, number | string>
  | CountType;
type Metric = {
  label?: string;
  value?: MetricValue;
  percentage: number;
  icon?: React.ElementType;
  iconClassName?: string;
};
interface EcommerceMetricsProps {
  metrics?: Metric[];
  parentClassName?: string;
}

const EcommerceMetrics: FC<EcommerceMetricsProps> = ({
  metrics,
  parentClassName,
}) => {
  return (
    <div className={parentClassName}>
      {metrics?.map((metric, index) => {
        const isPositive = metric.percentage!! >= 0;
        const ArrowIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
        const badgeColor = isPositive ? "success" : "error";

        return (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {metric.icon && (
                <metric.icon
                  className={
                    metric.iconClassName ||
                    "text-gray-800 size-6 dark:text-white/90"
                  }
                />
              )}
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-50">
                  {metric.label}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {typeof metric.value === "object" && metric.value !== null ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(metric.value).map(([key, val]) => {
                        let color: "success" | "warning" | "info" = "info";
                        if (key === "active") color = "success";
                        else if (key === "inactive") color = "warning";
                        else if (key === "all") color = "info";

                        return (
                          <div
                            key={key}
                            className="flex flex-col items-center text-sm font-medium"
                          >
                            <span className="capitalize text-gray-500 dark:text-gray-400">
                              {key}
                            </span>
                            <Badge color={color}>{val}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    metric.value
                  )}
                </h4>
              </div>

              <Badge color={badgeColor}>
                <ArrowIcon />
                {Math.abs(metric.percentage)}%
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EcommerceMetrics;
