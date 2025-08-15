import { Link } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const CheckoutHeader = () => {
  const { lang } = useDirectionAndLanguage();
  return (
    <header className="bg-white shadow-sm border-b border-b-[#d62828] py-2">
      <div className="container mx-auto px-4 flex justify-center">
        <Link to={`/${lang}`} className="flex items-center">
          <img
            src={`/images/logo/${lang}-light-logo.webp`}
            alt="Logo"
            className="w-[120px] hover:opacity-90 transition duration-300"
          />
        </Link>
      </div>
    </header>
  );
};

export default CheckoutHeader;
