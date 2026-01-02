import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { useTranslation } from "react-i18next";
import { RootState } from "../Redux/Store";
import DeleteIcon from "../../../icons/DeleteIcon";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import LazyImage from "../../common/LazyImage";

const CartData: React.FC<{ shippingPrice: number }> = ({ shippingPrice }) => {
  const { t } = useTranslation(["EndUserCheckout"]);
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const subtotal = useSelector((state: RootState) => state.cart.totalPrice);
  const { lang } = useDirectionAndLanguage();

  const finalPrice = subtotal - discount + shippingPrice;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-4 w-full shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-50 pb-4">
        {t("cartData.summary")}
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 italic">{t("cartData.empty")}</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item: any, index: number) => {
              const unitPrice = Number(item.total_item_price_with_descount || item.total_item_price_without_descount);

              return (
                <li
                  key={`${item.id}-${index}`}
                  className="py-5 flex items-start gap-4"
                >
                  <div className="relative">
                    <LazyImage
                      src={item.images?.[0]?.image}
                      alt={item[`name_${lang}`]}
                      className="w-20 h-20 object-contain rounded-xl border border-gray-100 bg-gray-50"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {item[`name_${lang}`]}
                    </h4>

                    {/* عرض الـ Variant */}
                    {item.selected_variant_text && (
                      <p className="text-[11px] text-brand-600 font-medium mt-0.5">
                        {item.selected_variant_text}
                      </p>
                    )}

                    {/* عرض الإضافات المختارة (سؤال: جواب) */}
                    {item.custom_selections?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.custom_selections.map((opt: any, i: number) => (
                          <div
                            key={i}
                            className="text-[10px] text-gray-500 flex items-start gap-1 bg-gray-50 p-1 rounded border border-gray-100 w-fit"
                          >
                            <span className="text-[#d62828]">•</span>
                            <span>
                              <span className="font-bold">
                                {opt.question?.[`title_${lang}`] ||
                                  opt.question_title}
                                :
                              </span>{" "}
                              {opt[`answer_${lang}`]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs font-bold text-gray-900 mt-2">
                      {t("cartData.price_label", {
                        price: (unitPrice * item.quantity).toFixed(2),
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeItem({ item }))} // إرسال الـ item بالكامل لضمان الحذف من الـ Key الفريد
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  >
                    <DeleteIcon className="text-lg" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("cartData.subtotal")}</span>
              <span className="font-bold text-gray-800">
                {subtotal.toFixed(2)} {t("cartData.currency")}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-bold">
                <span>{t("cartData.discount")}</span>
                <span>
                  -{discount.toFixed(2)} {t("cartData.currency")}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("cartData.shipping")}</span>
              <span className="font-bold text-gray-800">
                {shippingPrice.toFixed(2)} {t("cartData.currency")}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                {t("cartData.total")}
              </span>
              <span className="text-2xl font-black text-[#d62828]">
                {finalPrice.toFixed(2)} {t("cartData.currency")}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartData;
