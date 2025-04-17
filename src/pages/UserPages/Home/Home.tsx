import React from "react";
import AdBanner from "../../../components/EndUser/AdBanner/AdBanner";
import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";

const Home = () => {
  return (
    <section className="container">
      <div>
        <AdBanner imageUrl="/images/banner.webp" linkUrl="/" />
        <FeaturesSection />
      </div>
    </section>
  );
};

export default Home;
