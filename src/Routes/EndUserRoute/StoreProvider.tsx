// components/EndUser/EndUserWrapper.jsx
import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../../pages/UserPages/Context/ModalContext";
import BottomNav from "../../components/EndUser/BottomNav/BottomNav";
import ProductModal from "../../components/EndUser/ProductModal/ProductModal";
import AddToCartModal from "../../components/EndUser/AddedSuccess/AddToCartModal";
import { ToastContainer } from "react-toastify";
import { EndUserProvider } from "../../components/EndUser/context/EndUserProvider";

const EndUserWrapper = () => {
  return (
    <EndUserProvider>
      <ModalProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          className="custom-toast-container"
        />
        <Provider store={Store}>
          <BottomNav />
          <Outlet />
          <ProductModal />
          <AddToCartModal />
        </Provider>
      </ModalProvider>
    </EndUserProvider>
  );
};

export default EndUserWrapper;
