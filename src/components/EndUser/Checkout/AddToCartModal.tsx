import React from "react";
import { useModal } from "../context/ModalContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import CartCheck from "../../../icons/CartCheckIcon";
import CloseIcon from "../../../icons/CloseIcon";
import LazyImage from "../../common/LazyImage";

const AddToCartModal: React.FC = () => {
  const { modalType, modalProps, closeModal }: any = useModal();
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation(["AddedToCartModel"]);

  if (modalType !== "addtocart" || !modalProps) {
    return null;
  }

  const finalPrice = Number(modalProps.total_item_price_with_descount).toFixed(
    2
  );
  const totalPrice = (Number(finalPrice) * (modalProps.quantity || 1)).toFixed(
    2
  );

  const originalPriceWithExtras = modalProps.total_item_price_without_descount
    ? (
        Number(modalProps.total_item_price_without_descount) *
        (modalProps.quantity || 1)
      ).toFixed(2)
    : totalPrice;

  // const hasDiscount =
  //   modalProps.discount_price &&
  //   Number(modalProps.discount_price) < Number(modalProps.price);

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[rgba(0,0,0,0.6)] px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl p-6 md:p-8 bg-white rounded-2xl shadow-2xl space-y-6 overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-600 transition-all"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="bg-green-50 p-4 rounded-full mb-2">
            <CartCheck className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("Common:Buttons.add_to_cart")}
          </h2>
          <p className="text-sm text-gray-500">{t("description")}</p>
        </div>

        <div className="flex items-start gap-5 border-y border-gray-100 py-6">
          <div className="relative">
            <LazyImage
              src={modalProps?.images?.[0]?.image || ""}
              alt={modalProps.name}
              className="w-24 h-24 object-contain rounded-xl border border-gray-100 shadow-sm"
            />
            <span className="absolute -top-2 -right-2 bg-[#d62828] text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
              {modalProps.quantity}x
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-base font-bold text-gray-800 line-clamp-1">
              {modalProps[`name_${lang}`] || modalProps.name}
            </p>
            {modalProps.selected_variant_text && (
              <p className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
                {modalProps.selected_variant_text}
              </p>
            )}
            {modalProps.custom_selections?.length > 0 && (
              <div className="space-y-2 mt-3">
                {modalProps.custom_selections.map(
                  (selection: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col border-s-2 border-red-200 ps-3 py-1 bg-gray-50/50 rounded-e-md"
                    >
                      <span className="text-[10px] text-gray-500 font-medium">
                        {selection.question?.[`title_${lang}`] || t("extra")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#d62828]">
                          {selection[`answer_${lang}`]}
                        </span>
                        {Number(selection.price_effect) > 0 && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded-sm font-bold">
                            +{Number(selection.price_effect).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#d62828]">
                  {totalPrice} {t("Common:currency.egp")}
                </span>
                {modalProps.original_price_with_extras &&
                  modalProps.original_price_with_extras !== finalPrice && (
                    <span className="line-through text-sm text-gray-400">
                      {originalPriceWithExtras} {t("Common:currency.egp")}
                    </span>
                  )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic">
                {t("thankYou")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/${lang}/cart`}
            onClick={closeModal}
            className="flex-1 py-4 bg-[#d62828] text-center text-white rounded-xl hover:bg-[#b71c1c] shadow-lg shadow-red-100 transition-all font-bold text-sm"
          >
            {t("Common:Buttons.checkout")}
          </Link>
          <button
            onClick={closeModal}
            className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-bold text-sm"
          >
            {t("Common:Buttons.continueShopping")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
