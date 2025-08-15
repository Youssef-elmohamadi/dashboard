import React from "react";
import { useModal } from "../context/ModalContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import CartCheck from "../../../icons/CartCheckIcon";
import CloseIcon from "../../../icons/CloseIcon";

const AddToCartModal: React.FC = () => {
  const { modalType, modalProps, closeModal }: any = useModal();
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation("AddedToCartModel");

  if (modalType !== "addtocart") {
    return null;
  }

  const finalPrice = modalProps.discount_price || modalProps.price;
  const totalPrice = (+finalPrice * (modalProps.quantity || 1)).toFixed(2);
  const outOfDiscount = (modalProps.price * (modalProps.quantity || 1)).toFixed(
    2
  );
  const hasDiscount =
    modalProps.discount_price && modalProps.discount_price < modalProps.price;
  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl p-6 md:p-8 bg-white rounded-2xl shadow-2xl space-y-6"
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 bg-gray-500 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-gray-600 transition"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-4">
          <CartCheck className="end-user-text-secondary w-16 h-16" />
          <h2 className="text-2xl font-bold end-user-text-base">
            {t("addedToCart")}
          </h2>
          <p className="text-sm text-gray-600">{t("description")}</p>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
          <img
            src={modalProps?.images?.[0]?.image || ""}
            alt={modalProps.name}
            className="w-24 h-24 object-cover rounded-lg shadow"
          />
          <div className="flex-1 space-y-1">
            <p className="text-base font-medium text-gray-800 line-clamp-2">
              {modalProps.name}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold end-user-text-base">
                {finalPrice} {t("egp")}
              </span>
              {hasDiscount && (
                <span className="line-through text-sm text-gray-500">
                  {modalProps.price} {t("egp")}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {t("discountApplied")}{" "}
                  {Math.round(
                    ((modalProps.price - modalProps.discount_price) /
                      modalProps.price) *
                      100
                  )}
                  % {t("sale")}
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {t("quantity")}:{" "}
              <span className="font-semibold">{modalProps.quantity}</span>
            </p>
            {/* <p className="text-[#d62828] font-bold text-lg">
              {totalPrice} {t("egp")}
            </p> */}
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-[#d62828] font-bold text-lg">
                  {totalPrice} {t("egp")}
                </span>
                <span className="text-gray-500 line-through font-medium text-sm">
                  {outOfDiscount} {t("egp")}
                </span>
              </div>
            ) : (
              <span className="text-[#d62828] font-bold text-lg">
                {modalProps.price} {t("egp")}
              </span>
            )}
            <p className="text-xs text-gray-500 italic mt-2">{t("thankYou")}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/${lang}/cart`}
            onClick={closeModal}
            className="flex-1 py-3 bg-[#d62828] text-center text-white rounded-md hover:bg-[#b71c1c] transition font-semibold text-sm md:text-base"
          >
            {t("checkout")}
          </Link>
          <button
            onClick={closeModal}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition font-semibold text-sm md:text-base"
          >
            {t("continueShopping")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
