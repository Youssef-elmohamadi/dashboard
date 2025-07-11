import { FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  headerAction?: string;
  href?: string;
  action?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerAction = "",
  href = "",
  action,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex gap-4 flex-row items-center justify-between">
          {/* Title */}
          <h3
            className={`text-base font-medium text-gray-800 dark:text-white/90 ${className}`}
          >
            {title}
          </h3>

          {/* Search + Action */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Button */}
            {headerAction && (
              <Link
                to={href}
                onClick={action}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 w-full md:w-auto"
              >
                {headerAction}
                <FiUserPlus size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Optional Description */}
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div
        className={`p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 ${className}`}
      >
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
