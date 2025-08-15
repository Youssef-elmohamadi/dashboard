import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../pages/UserPages/Home/Home";
import EndUserWrapper from "./StoreProvider";
import { lazy, Suspense } from "react";
const EndUserLayout = lazy(
  () => import("../../pages/UserPages/EndUserLayout/Layout")
);
import "./index.css";
const UserForgotPassword = lazy(
  () => import("../../pages/UserPages/AuthPages/UserForgotPassword")
);
import LazyPages from "./LazyPages";
import ScrollToTop from "../../components/common/ScrollToTop";
import LoadingPage from "../../components/ui/loading-screen";
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
          <Route path="/" element={<Navigate to="/ar" replace />} />

          <Route
            path="/:lang"
            element={
              <Suspense fallback={<LoadingPage />}>
                <EndUserLayout />
              </Suspense>
            }
          >
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
