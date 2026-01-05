import React, { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
const HomeProducts = React.lazy(
  () => import("../../../components/EndUser/Home/HomeProducts")
);
const LatestProducts = React.lazy(
  () => import("../../../components/EndUser/Home/HomeLatest")
);
const CircleSlider = React.lazy(
  () => import("../../../components/EndUser/Home/CircleSlider")
);

const LastPart = () => {
  const { t } = useTranslation("EndUserHome", {
    useSuspense: false,
  });
  const { data: categories, isLoading } = useCategories("parent");

  return (
    <>
      <div className="enduser_container">
        <Suspense fallback={<div>Loading</div>}>
          <CircleSlider items={categories || []} loading={isLoading} />
        </Suspense>
      </div>
      <div className="enduser_container">
        <Suspense fallback={<div>Loading</div>}>
          <LatestProducts title={t("latestProducts")} />
        </Suspense>
      </div>
      <div className="enduser_container">
        <Suspense fallback={<div>Loading</div>}>
          <HomeProducts title={t("latestProducts")} />
        </Suspense>
      </div>
    </>
  );
};

export default LastPart;
