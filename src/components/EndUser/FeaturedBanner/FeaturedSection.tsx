// components/FeaturesSection.jsx
import FeatureItem from "./FeatureItem";
import { FaShippingFast, FaUndo, FaMapMarkedAlt, FaTags } from "react-icons/fa";

const FeaturesSection = () => {
  const features =[
    {
      icon: <FaShippingFast />,
      title: "Fast Delivery",
      description: "We guarantee the best delivery speed",
    },
    {
      icon: <FaUndo />,
      title: "Returnable",
      description: "Returnable within 7 days",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Full Coverage",
      description: "Coverage across all cities in the Kingdom",
    },
    {
      icon: <FaTags />,
      title: "Current Offers",
      description: "Massive deals across all categories",
    },
  ];
  

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-white p-4 rounded-xl">
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeaturesSection;
