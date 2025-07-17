import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../../components/EndUser/context/ModalContext";
import BottomNav from "../../components/EndUser/Layout/BottomNav";
import ProductModal from "../../components/EndUser/Product/ProductModal";
import AddToCartModal from "../../components/EndUser/Checkout/AddToCartModal";
import { ToastContainer } from "react-toastify";
import { EndUserProvider } from "../../components/EndUser/context/EndUserProvider";

const EndUserWrapper = () => {
  return (
    <Provider store={Store}>
      <EndUserProvider>
        <ModalProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            className="custom-toast-container"
          />
          <BottomNav />
          <Outlet />
          <ProductModal />
          <AddToCartModal />
        </ModalProvider>
      </EndUserProvider>
    </Provider>
  );
};

export default EndUserWrapper;
