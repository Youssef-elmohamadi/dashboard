import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";

const CartData: React.FC = () => {
  const items = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();

  const finalPrice = totalPrice - discount;

  return (
    <div className="bg-white border rounded-xl p-6 sticky top-4 w-full">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Cart Summary
      </h3>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <img
                src={item.images[0].image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 line-clamp-1">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500">{item.description}</div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {(item.price * item.quantity).toFixed(2)} EGP
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeItem(item.id));
                }}
              >
                <RiDeleteBin6Line className="text-error-500 text-2xl" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-6 border-t pt-4 flex justify-between text-lg font-semibold text-gray-800">
          <span>Total:</span>
          {discount > 0 ? (
            <div className="flex flex-col items-end text-sm">
              <span className="line-through text-gray-400">
                {totalPrice.toFixed(2)} EGP
              </span>
              <span className="text-green-600 font-semibold">
                {finalPrice.toFixed(2)} EGP
              </span>
            </div>
          ) : (
            <span>{totalPrice.toFixed(2)} EGP</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CartData;
