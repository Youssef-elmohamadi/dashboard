import { Routes, Route, Navigate } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout";
import Home from "../../pages/UserPages/Home/Home";
import EndUserWrapper from "./StoreProvider";
import { lazy, Suspense } from "react";
import "./index.css";
const UserForgotPassword = lazy(
  () => import("../../pages/UserPages/AuthPages/UserForgotPassword")
);
import LazyPages from "./LazyPages";
import ScrollToTop from "../../components/common/ScrollToTop";
const EndUserSignIn = lazy(
  () => import("../../pages/UserPages/AuthPages/EndUserSignin")
);
const EndUserSignUp = lazy(
  () => import("../../pages/UserPages/AuthPages/EndUserSignUp")
);

const Checkout = lazy(() => import("../../pages/UserPages/Checkout/Checkout"));

const EndUserRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<EndUserWrapper />}>
          {/* Redirect root path to /en */}
          <Route path="/" element={<Navigate to="/en" replace />} />

          <Route path="/:lang" element={<EndUserLayout />}>
            <Route index element={<Home />} />
            <Route
              path="*"
              element={
                <Suspense fallback={null}>
                  <LazyPages />
                </Suspense>
              }
            />
          </Route>

          <Route
            path=":lang/reset-password"
            element={
              <Suspense fallback={null}>
                <UserForgotPassword />
              </Suspense>
            }
          />
          <Route
            path=":lang/signin"
            element={
              <Suspense fallback={null}>
                <EndUserSignIn />
              </Suspense>
            }
          />
          <Route
            path=":lang/signup"
            element={
              <Suspense fallback={null}>
                <EndUserSignUp />
              </Suspense>
            }
          />

          <Route
            path="/checkout"
            element={
              <Suspense fallback={null}>
                <Checkout />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

export default EndUserRoutes;
