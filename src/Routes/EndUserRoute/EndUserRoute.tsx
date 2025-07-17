import { Routes, Route, Navigate } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout";
import Home from "../../pages/UserPages/Home/Home";
import EndUserWrapper from "./StoreProvider";
import { lazy, Suspense } from "react";
const UserForgotPassword = lazy(
  () => import("../../pages/UserPages/AuthPages/UserForgotPassword")
);
import LazyPages from "./LazyPages";
const EndUserSignIn = lazy(
  () => import("../../pages/UserPages/AuthPages/EndUserSignin")
);
const EndUserSignUp = lazy(
  () => import("../../pages/UserPages/AuthPages/EndUserSignUp")
);

const Checkout = lazy(() => import("../../pages/UserPages/Checkout/Checkout"));

const EndUserRoutes = () => {
  return (
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

        {/* Authentication Routes - These should probably be outside the :lang layout
            if they don't always need the layout, or include the :lang prefix directly.
            Given your current setup, it seems they are independent. */}
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

        {/* Checkout Route - It seems like this might not always have the :lang prefix based on its current definition.
            If it *should* have the :lang prefix, change path to ":lang/checkout".
            If it's truly global, define it higher up or ensure it's specifically handled.
            For now, I'm keeping it as is, but be aware of its interaction with the :lang paths. */}
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
  );
};

export default EndUserRoutes;
