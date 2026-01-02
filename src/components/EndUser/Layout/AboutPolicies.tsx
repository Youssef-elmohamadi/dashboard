import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { Policy } from "../../../types/Home";
import { useTranslation } from "react-i18next";

interface AboutPoliciesProps {
  policies: Policy[];
}

const AboutPolicies: React.FC<AboutPoliciesProps> = ({ policies }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-20 pt-12 border-t border-gray-200">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-800">
          {t("Common:AboutSection.Politics.heading")}
        </h3>
        <p className="mt-2 text-md text-gray-500">
          {t("Common:AboutSection.Politics.description")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {policies.map((policy) => (
          <Link key={policy.title} to={policy.href} className="group">
            <div className="bg-white shadow-sm rounded-xl p-6 text-center transition-all duration-300 ease-in-out hover:shadow-red-200 hover:shadow-lg hover:-translate-y-2 border border-transparent hover:border-red-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-md mx-auto bg-gray-100 group-hover:bg-red-100 transition-colors">
                <Suspense fallback={null}>
                  <policy.icon className="h-6 w-6 text-gray-600 group-hover:text-red-600 transition-colors" />
                </Suspense>
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">
                {policy.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AboutPolicies;
