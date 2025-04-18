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
      {/* Title bar with toggle icon on small screens */}
      <div
        className="flex justify-between items-center md:block cursor-pointer md:cursor-default border-b-[0.5px] border-gray-500 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-semibold mb-2 text-gray-500">{title}</h4>
        <span className="md:hidden transition-transform duration-300">
          {isOpen ? (
            <FaMinus className="text-base text-gray-500" />
          ) : (
            <FaPlus className="text-base text-gray-500" />
          )}
        </span>
      </div>

      {/* Content list - collapses on small screens */}
      <ul
        className={`space-y-1 text-sm overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 mt-2" : "max-h-0 md:max-h-full"
        } ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"} md:mt-0`}
      >
        {children}
      </ul>
    </div>
  );
};

export default FooterSection;
