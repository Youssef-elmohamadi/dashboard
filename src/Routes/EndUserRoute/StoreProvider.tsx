// components/EndUser/EndUserWrapper.jsx
import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../../pages/UserPages/Context/ModalContext";

const EndUserWrapper = () => {
  return (
    <ModalProvider>
      <Provider store={Store}>
        <Outlet />
      </Provider>
    </ModalProvider>
  );
};

export default EndUserWrapper;
