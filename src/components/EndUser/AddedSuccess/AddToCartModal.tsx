import React from "react";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const AddToCartModal: React.FC = () => {
  const { modalType, modalProps, closeModal }: any = useModal();
    const { lang } = useDirectionAndLanguage();
  if (modalType !== "addtocart") return null;
  const { t } = useTranslation(["AddedToCartModel"]);
  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-gray-500 w-8 h-8 flex items-center justify-center rounded-full text-white text-lg hover:bg-gray-600 transition"
        >
          ✕
        </button>

        {/* Success Message */}
        <div className="flex flex-col items-center text-center space-y-3">
          <BsFillCartCheckFill className="text-green-600 text-6xl" />
          <h2 className="text-2xl font-bold text-green-700">
            {t("addedToCart")}
          </h2>
          <p className="text-sm text-gray-600">{t("description")}</p>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
          <img
            src={modalProps?.images?.[0]?.image || ""}
            alt={modalProps.name}
            className="w-24 h-24 object-cover rounded-lg shadow"
          />
          <div className="flex-1">
            <p className="text-base font-medium text-gray-800 line-clamp-2">
              {modalProps.name}
            </p>
            <p className="text-purple-700 font-semibold mt-1">
              {+modalProps.price * (modalProps.quantity || 1)} {t("egp")}
            </p>
            <p className="text-xs text-gray-500 italic mt-1">{t("thankYou")}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/${lang}/cart`}
            onClick={closeModal}
            className="flex-1 py-2 bg-purple-700 text-center text-white rounded-md hover:bg-purple-800 transition font-medium"
          >
            {t("checkout")}
          </Link>
          <button
            onClick={closeModal}
            className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition font-medium"
          >
            {t("continueShopping")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
