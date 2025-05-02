// components/EndUser/EndUserWrapper.jsx
import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../../pages/UserPages/Context/ModalContext";
import BottomNav from "../../components/EndUser/BottomNav/BottomNav";
import ProductModal from "../../components/EndUser/ProductModal/ProductModal";
import AddToCartModal from "../../components/EndUser/AddedSuccess/AddToCartModal";

const EndUserWrapper = () => {
  return (
    <ModalProvider>
      <Provider store={Store}>
        <BottomNav />
        <Outlet />
        <ProductModal />
        <AddToCartModal/>
      </Provider>
    </ModalProvider>
  );
};

export default EndUserWrapper;
