// components/EndUser/EndUserProvider.jsx
import { Provider } from "react-redux";
import Store from "../../components/EndUser/Redux/Store";
import { Outlet } from "react-router-dom";

const StoreProvider = () => {
  return (
    <Provider store={Store}>
      <Outlet />
    </Provider>
  );
};

export default StoreProvider;
