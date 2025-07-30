import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FooterSection = ({
  title,
  children,
  isOpen,
  setIsOpen,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <div>
      {/* Section Header */}
      <div
        className="flex justify-between items-center md:block cursor-pointer md:cursor-default border-b border-gray-600 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-semibold text-base text-white mb-2">{title}</h4>

        {/* Toggle Icon - Mobile Only */}
        <span className="md:hidden transition-transform duration-300">
          {isOpen ? (
            <FaMinus className="text-sm text-purple-400" />
          ) : (
            <FaPlus className="text-sm text-purple-400" />
          )}
        </span>
      </div>

      {/* Collapsible Content */}
      <ul
        className={`text-gray-300 text-sm space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 mt-3 opacity-100" : "max-h-0 opacity-0"
        } md:max-h-full md:opacity-100 md:mt-2`}
      >
        {children}
      </ul>
    </div>
  );
};

export default React.memo(FooterSection);
