import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../../components/EndUser/context/ModalContext";
import { EndUserProvider } from "../../components/EndUser/context/EndUserProvider"; 
import { lazy, Suspense } from 'react';
const BottomNav = lazy(() => import("../../components/EndUser/Layout/BottomNav"));
const ProductModal = lazy(() => import("../../components/EndUser/Product/ProductModal"));
const AddToCartModal = lazy(() => import("../../components/EndUser/Checkout/AddToCartModal"));
const ToastContainer = lazy(() => 
  import("react-toastify").then(module => ({ default: module.ToastContainer }))
); 

const EndUserWrapper = () => {
  return (
    <Provider store={Store}>
      <EndUserProvider>
        <ModalProvider>
          
          <Suspense fallback={null}>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              className="custom-toast-container"
            />
            <BottomNav />
            
            <ProductModal />
            <AddToCartModal />
          </Suspense>
          <Outlet />

        </ModalProvider>
      </EndUserProvider>
    </Provider>
  );
};

export default EndUserWrapper;