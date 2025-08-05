import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useParams
import CartData from "../../../components/EndUser/Checkout/CartData";
import CheckoutForm from "../../../components/EndUser/Checkout/CheckoutForm";
import CheckoutHeader from "../../../components/EndUser/Checkout/CheckoutHeader";
import { toast } from "react-toastify";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component

const Checkout = () => {
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
      <SEO
        title={{
          ar: `تشطيبة - إتمام الشراء`,
          en: `Tashtiba - Checkout`,
        }}
        description={{
          ar: `أكمل عملية الشراء على تشطيبة. أدخل معلومات الشحن والدفع الخاصة بك لإتمام طلبك بسرعة وأمان في مصر.`,
          en: `Complete your purchase on Tashtiba. Enter your shipping and payment information to finalize your order quickly and securely in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "إتمام الشراء",
            "الدفع",
            "الشحن",
            "الطلب",
            "سلة التسوق",
            "دفع آمن",
            "متجر إلكتروني",
            "مصر",
            "شراء أونلاين",
          ],
          en: [
            "tashtiba",
            "checkout",
            "payment",
            "shipping",
            "order",
            "shopping cart",
            "secure payment",
            "online store",
            "Egypt",
            "buy online",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/checkout" }, // Adjust the path if your actual checkout URL is different
          { lang: "en", href: "https://tashtiba.com/en/checkout" }, // Adjust the path if your actual checkout URL is different
        ]}
        robotsTag="noindex, nofollow"
      />
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
