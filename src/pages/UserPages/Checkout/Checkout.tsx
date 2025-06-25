import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartData from "../../../components/EndUser/Checkout/CartData";
import CheckoutForm from "../../../components/EndUser/Checkout/CheckoutForm";
import CheckoutHeader from "../../../components/EndUser/Checkout/CheckoutHeader";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Checkout = () => {
    const { t } = useTranslation(["EndUserCheckout"]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      toast.error("Please login first.");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t("mainTitle")}</title>
        <meta
          name="description"
          content={t("categoryDescription", {
            defaultValue:
              "تسوق من مجموعة متنوعة من المنتجات داخل هذه الفئة بأسعار تنافسية وجودة عالية.",
          })}
        />
      </Helmet>
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <CheckoutHeader />
      </header>

      <main className="flex flex-col lg:flex-row justify-center items-start w-full max-w-7xl mx-auto px-4 py-10 gap-10">
        <section className="lg:w-6/12 w-full bg-white rounded-2xl p-8  border border-gray-200">
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
