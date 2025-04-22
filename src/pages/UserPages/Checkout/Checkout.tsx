import React from "react";
import CartData from "../../../components/EndUser/Checkout/CartData";
import CheckoutForm from "../../../components/EndUser/Checkout/CheckoutForm";

const Checkout = () => {
  return (
    <div className="flex">
      <CheckoutForm />
      <CartData />
    </div>
  );
};

export default Checkout;
