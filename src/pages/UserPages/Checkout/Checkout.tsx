import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartData from "../../../components/EndUser/Checkout/CartData";
import CheckoutForm from "../../../components/EndUser/Checkout/CheckoutForm";
import CheckoutHeader from "../../../components/EndUser/Checkout/CheckoutHeader";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (!token) {
      toast.error("Please Login First");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white">
        <CheckoutHeader />
      </header>
      <main className="flex flex-col lg:flex-row justify-center items-start w-full max-w-7xl mx-auto px-4 py-8 gap-8">
        <section className="lg:w-6/12 w-full bg-white rounded-2xl p-6 border border-gray-200">
          <CheckoutForm />
        </section>
        <aside className="lg:w-5/12 w-full sticky top-24">
          <CartData />
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
