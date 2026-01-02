import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  applyDiscount,
  deleteItem, // تم تغيير removeItem لـ deleteItem للحذف الكامل بناءً على الـ Key الفريد
  updateQuantity,
} from "../../../components/EndUser/Redux/cartSlice/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useApplyCoupon } from "../../../hooks/Api/EndUser/useCopouns/useCopouns";
import type { RootState } from "../../../components/EndUser/Redux/Store";
import SEO from "../../../components/common/SEO/seo";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import DeleteIcon from "../../../icons/DeleteIcon";
import LazyImage from "../../../components/common/LazyImage";

interface CouponFormData {
  code: string;
  order_total: number;
}

interface CouponStatus {
  success: boolean;
  message: string;
}

const Cart: React.FC = () => {
  const { t } = useTranslation(["EndUserCart"]);
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.totalPrice);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const discount = useSelector((state: RootState) => state.cart.discount);
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage();

  const [cuponData, setCuponData] = useState<CouponFormData>({
    code: "",
    order_total: subtotal,
  });

  const [couponStatus, setCouponStatus] = useState<CouponStatus | null>(null);

  const handleCheckoutButton = () => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      toast.error(t("please_login"));
      return;
    }
    if (items.length === 0) {
      toast.info(t("empty_cart_toast"));
      return;
    }
    navigate("/checkout");
  };

  const handleQuantityChange = (item: any, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ item, quantity }));
    }
  };

  const { mutateAsync: applyCouponMutate } = useApplyCoupon();

  const handleSubmitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await applyCouponMutate(cuponData);
      dispatch(applyDiscount(res.discount));
      setCouponStatus({ success: true, message: res.message });
    } catch (error: any) {
      setCouponStatus({
        success: false,
        message: error?.response?.data?.message || t("coupon_error"),
      });
    }
  };

  const finalTotal = subtotal - discount;

  return (
    <div className="container mx-auto p-4 py-10 flex flex-col lg:flex-row gap-8">
      <SEO
        title={{
          ar: `سلة التسوق`,

          en: `Shopping Cart`,
        }}
        description={{
          ar: `راجع سلة التسوق الخاصة بك في تشطيبة. قم بتعديل الكميات، تطبيق الكوبونات، والمتابعة لإتمام طلبك.`,

          en: `Review your shopping cart on Tashtiba. Adjust quantities, apply coupons, and proceed to checkout with your selected items.`,
        }}
        url={`https://tashtiba.com/${lang}/cart`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/cart" },
          { lang: "en", href: "https://tashtiba.com/en/cart" },
          { lang: "x-default", href: "https://tashtiba.com/ar/cart" },
        ]}
        robotsTag="noindex, nofollow"
      />
      {/* Cart Items Section */}
      <div className="lg:w-2/3 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
          <span>{t("cart_items", { count: totalQuantity })}</span>
          <span className="text-sm font-normal text-gray-400">
            ({totalQuantity} {t("items")})
          </span>
        </h2>

        <ul className="divide-y divide-gray-50">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <li
                key={`${item.id}-${index}`}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                {/* Product Image */}
                <div className="relative group">
                  <LazyImage
                    src={item?.images?.[0]?.image || "/placeholder.jpg"}
                    alt={item[`name_${lang}`]}
                    className="w-24 h-24 object-contain rounded-xl border border-gray-100 bg-gray-50 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <Link to={`/${lang}/product/${item.id}`}>
                    <h3 className="text-base font-bold text-gray-800 hover:text-[#d62828] transition-colors leading-tight">
                      {item[`name_${lang}`]}
                    </h3>
                  </Link>

                  {/* Display Selected Variant */}
                  {item.selected_variant_text && (
                    <div className="text-[12px] text-brand-600 font-semibold bg-brand-50 w-fit px-2 py-0.5 rounded">
                      {item.selected_variant_text}
                    </div>
                  )}

                  {/* Display Custom Selections (Extras) */}
                  {item.custom_selections &&
                    item.custom_selections.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.custom_selections.map(
                          (selection: any, i: number) => (
                            <div
                              key={i}
                              className="text-[11px] flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
                            >
                              <span className="text-[#d62828] font-bold">
                                •
                              </span>
                              <span className="font-bold text-gray-700">
                                {selection.question?.[`title_${lang}`] ||
                                  selection.question_title}
                                :
                              </span>
                              <span>{selection[`answer_${lang}`]}</span>
                              {Number(selection.price_effect) > 0 && (
                                <span className="text-green-600 font-bold">
                                  (+{selection.price_effect})
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* Prices Logic */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-lg font-black text-[#d62828]">
                      {(
                        Number(item.total_item_price_with_descount) *
                        item.quantity
                      ).toFixed(2)}{" "}
                      {t("egp")}
                    </span>
                    {item.total_item_price_without_descount >
                      item.total_item_price_with_descount && (
                      <span className="line-through text-gray-400 text-sm">
                        {(
                          Number(item.total_item_price_without_descount) *
                          item.quantity
                        ).toFixed(2)}{" "}
                        {t("egp")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-all"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span className="font-bold text-gray-700 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-green-50 hover:text-green-600 transition-all"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(deleteItem({ item }))}
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <DeleteIcon className="text-xl" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center py-20 flex flex-col items-center gap-4 text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center italic text-4xl">
                🛒
              </div>
              <p>{t("empty_cart")}</p>
              <Link
                to={`/${lang}/products`}
                className="text-[#d62828] underline font-bold"
              >
                {t("Common:Buttons.shopNow")}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Order Summary Section */}
      <div className="lg:w-1/3 w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-lg font-bold border-b border-gray-100 pb-4 mb-4">
            {t("order_summary")}
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>{t("total_before_extras")}</span>
              <span>
                {subtotal.toFixed(2)} {t("egp")}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>{t("discount")}</span>
                <span>
                  -{discount.toFixed(2)} {t("egp")}
                </span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>{t("tax")}</span>
              <span>0.00 {t("egp")}</span>
            </div>

            <div className="flex justify-between text-xl font-black border-t border-gray-100 pt-4 mt-4 text-gray-800">
              <span>{t("total")}</span>
              <span>
                {finalTotal.toFixed(2)} {t("egp")}
              </span>
            </div>
          </div>

          {/* Coupon Form */}
          <form
            onSubmit={handleSubmitCoupon}
            className="mt-6 flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("have_coupon")}
                onChange={(e) =>
                  setCuponData({ ...cuponData, code: e.target.value })
                }
                className={`flex-1 border border-gray-200 outline-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#d62828] transition-all ${
                  couponStatus
                    ? couponStatus.success
                      ? "border-green-500"
                      : "border-red-500"
                    : ""
                }`}
              />
              <button
                type="submit"
                className="bg-[#d62828] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-md shadow-red-50"
              >
                {t("apply")}
              </button>
            </div>
            {couponStatus && (
              <p
                className={`text-[11px] font-bold px-2 ${
                  couponStatus.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {couponStatus.message}
              </p>
            )}
          </form>

          <button
            onClick={handleCheckoutButton}
            className="w-full bg-[#d62828] text-white py-4 mt-8 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-red-100 transition-all active:scale-95"
          >
            {t("proceed_to_payment", { count: totalQuantity })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Cart);
