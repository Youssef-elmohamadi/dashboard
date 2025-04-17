import AppHeader from "../../../components/EndUser/Header/AppHeader";
import NavBar from "../../../components/EndUser/NavBar/NavBar";
import AppTopBar from "../../../components/EndUser/TopBar/AppTopBar";
import { Outlet } from "react-router-dom";

export default function EndUserLayout() {
  return (
    <>
      <AppTopBar />
      <AppHeader />
      <NavBar />
      <Outlet />
    </>
  );
}
