import { Routes, Route, Navigate } from "react-router-dom";
import EndUserWrapper from "./StoreProvider";
import { lazy, Suspense } from "react";
const EndUserLayout = lazy(
  () => import("../../pages/UserPages/EndUserLayout/Layout")
);
const Home = lazy(() => import("../../pages/UserPages/Home/Home"));
import "./index.css";
const UserForgotPassword = lazy(
  () => import("../../pages/UserPages/AuthPages/UserForgotPassword")
);
import LazyPages from "./LazyPages";
import LoadingPage from "../../components/ui/loading-screen";
import LoadingPageEndUser from "../../components/ui/LoadingPageEndUser";
const ScrollRestoration = lazy(
  () => import("../../components/common/ScrollToTop")
);
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
            <Route
              index
              element={
                <Suspense fallback={<LoadingPageEndUser />}>
                  <Home />
                </Suspense>
              }
            />

            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingPageEndUser />}>
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
              <Suspense fallback={<LoadingPageEndUser />}>
                <EndUserSignIn />
              </Suspense>
            }
          />
          <Route
            path=":lang/signup"
            element={
              <Suspense fallback={<LoadingPageEndUser />}>
                <EndUserSignUp />
              </Suspense>
            }
          />

          <Route
            path="/checkout"
            element={
              <Suspense fallback={<LoadingPageEndUser />}>
                <Checkout />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <ScrollRestoration />
    </>
  );
};

export default EndUserRoutes;
