import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, deleteItem } from "../Redux/cartSlice/CartSlice";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import useClickOutside from "../context/useClickOutside";
import CartIcon from "../../../icons/CartIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import LazyImage from "../../common/LazyImage";

interface CartItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number; // السعر الذي تم تمريره من المودال
  discount_price?: number;
  images: { image: string }[];
  variant_id?: number | string;
  custom_selections?: any[];
  [key: string]: any;
}

interface CartPopupProps {
  isCartOpen: boolean;
  toggleCartPopup: () => void;
  lang: string | undefined;
}

const CartPopup: React.FC<CartPopupProps> = ({
  isCartOpen,
  toggleCartPopup,
  lang,
}) => {
  const items: CartItem[] = useSelector((state: any) => state.cart.items);
  const totalPrice: number = useSelector((state: any) => state.cart.totalPrice);
  const totalQuantity: number = useSelector(
    (state: any) => state.cart.totalQuantity
  );
  const { dir } = useDirectionAndLanguage();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isOpenCartRef = useRef<HTMLDivElement>(null);
  useClickOutside(isOpenCartRef, toggleCartPopup, isCartOpen);

  return (
    <div className="relative">
      <div
        className="lg:flex flex-[1] cart relative gap-3 cursor-pointer hidden items-center justify-end"
        onClick={toggleCartPopup}
      >
        <CartIcon className="text-white w-6" />
        <div className="text-white">
          {t("Common:navbar.items", { count: totalQuantity })}
        </div>
        <div className="text-white">
          {t("Common:navbar.priceWithCurrency", { price: totalPrice.toFixed(2) })}
        </div>
      </div>

      {isCartOpen && (
        <div
          className={`absolute top-10 ${
            dir === "ltr" ? "right-0" : "left-0"
          } min-w-[380px] bg-white shadow-2xl rounded-xl p-5 z-[99999] border border-gray-100`}
          ref={isOpenCartRef}
        >
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
            {t("Common:navbar.yourCart")}
          </h3>

          <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar px-1">
            {items.length > 0 ? (
              items.map((item: CartItem, index: number) => {
                const itemUnitPrice = Number(
                  item.total_item_price_with_descount
                );
                const itemTotalPrice = (itemUnitPrice * item.quantity).toFixed(
                  2
                );

                return (
                  <li
                    key={`${item.id}-${item.variant_id}-${index}`}
                    className="py-4 flex items-start justify-between gap-3"
                  >
                    <LazyImage
                      src={
                        item.images?.[0]?.image ||
                        "https://placehold.co/60x60/E0E0E0/FFFFFF?text=No+Image"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg border border-gray-100 shadow-sm"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        to={`/${lang}/product/${item.id}`}
                        onClick={toggleCartPopup}
                        className="block"
                      >
                        <div className="font-bold text-sm text-gray-800 line-clamp-1 hover:text-[#d62828] transition-colors">
                          {item[`name_${lang}`] || item.name}
                        </div>
                      </Link>
                      {item.selected_variant_text && (
                        <div className="text-[10px] text-brand-600 font-medium italic">
                          {item.selected_variant_text}
                        </div>
                      )}
                      {item.custom_selections &&
                        item.custom_selections.length > 0 && (
                          <div className="flex flex-col gap-0.5 mt-1 bg-gray-50 p-1.5 rounded-md border border-gray-100">
                            {item.custom_selections.map(
                              (selection: any, i: number) => (
                                <div
                                  key={i}
                                  className="text-[10px] flex items-start gap-1 leading-tight text-gray-500"
                                >
                                  <span className="text-[#d62828] font-black">
                                    •
                                  </span>
                                  <span className="truncate">
                                    <span className="font-bold text-gray-600">
                                      {selection.question?.[`title_${lang}`] ||
                                        selection.question_title}
                                      :
                                    </span>{" "}
                                    {selection[`answer_${lang}`]}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}

                      <div className="text-[11px] text-gray-400 font-medium">
                        {t("Common:navbar.qty")} :{" "}
                        <span className="text-gray-700">{item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-2">
                      <div className="text-sm font-bold text-[#d62828] whitespace-nowrap">
                        {t("Common:navbar.priceWithCurrency", {
                          price: itemTotalPrice,
                        })}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteItem({ item }));
                        }}
                        className="p-1 hover:bg-red-50 rounded-full transition-colors group"
                      >
                        <DeleteIcon className="w-5 text-gray-300 group-hover:text-[#d62828]" />
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                <CartIcon className="w-10 h-10 opacity-20" />
                <span className="text-sm">{t("Common:navbar.cartIsEmpty")}</span>
              </li>
            )}
          </ul>

          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm text-gray-500 font-medium">
                  {t("Common:navbar.total")}:
                </span>
                <span className="text-lg font-black text-gray-800">
                  {t("Common:navbar.priceWithCurrency", {
                    price: totalPrice.toFixed(2),
                  })}
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  to={`/${lang}/cart`}
                  onClick={toggleCartPopup}
                  className="w-full block py-3 text-center end-user-bg-base text-white rounded-xl font-bold text-sm hover:opacity-95 transition shadow-lg shadow-red-100"
                >
                  {t("Common:navbar.goToShoppingCart")}
                </Link>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-2 text-center text-gray-400 hover:text-red-600 transition text-xs font-medium"
                >
                  {t("Common:navbar.clearCart")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CartPopup);
