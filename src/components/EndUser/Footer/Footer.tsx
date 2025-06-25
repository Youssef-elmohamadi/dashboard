import { useState, useMemo } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSignOutAlt,
  FaBoxOpen,
  FaHeart,
  FaStore,
  FaRocket,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FooterSection from "./FooterLinks";
import { handleLogout } from "../../common/Logout";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LazyImage from "../../common/LazyImage";
import { Category } from "../../../types/Categories";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

export default function Footer() {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sellerAreaOpen, setSellerAreaOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserFooter"]);
  const { data: categories } = useCategories();
  const { lang } = useDirectionAndLanguage();
  const socialIcons = useMemo(
    () => [FaLinkedin, FaYoutube, FaInstagram, FaTwitter, FaFacebook],
    []
  );

  const iconClass =
    "text-gray-400 hover:text-purple-400 transition duration-300 transform hover:scale-125";

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-14 shadow-inner">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Logo & Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-700 pb-8">
          <div>
            <LazyImage
              src="/images/logo/logo-white.png"
              alt="Company Logo"
              className="h-16 w-auto mb-3 drop-shadow-lg"
            />
            <p className="text-sm text-gray-300 italic tracking-wide">
              {t("footer.tagline")}
            </p>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Newsletter */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 w-full lg:w-1/2 transition hover:shadow-purple-800/30">
            <h3 className="text-lg font-semibold mb-2">
              {t("footer.newsletter_title")}
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {t("footer.newsletter_description")}
            </p>
            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                placeholder={t("footer.newsletter_placeholder")}
                className="px-4 py-2 rounded-lg bg-white text-black text-sm w-full sm:w-64 focus:outline-purple-500"
                aria-label="Email"
              />
              <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 text-white rounded-lg shadow-md transition hover:scale-105 duration-300">
                {t("footer.newsletter_button")}
              </button>
            </div>
          </div>

          {/* Socials & App Download */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="mb-2 font-medium text-sm">
                {t("footer.follow_us")}
              </p>
              <div className="flex gap-4 text-2xl">
                {socialIcons.map((Icon, idx) => (
                  <Icon key={idx} className={iconClass} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-sm">
                {t("footer.download_app")}
              </p>
              <div className="flex gap-4">
                {[
                  { src: "/images/appstore.webp", alt: "App Store" },
                  { src: "/images/googleplay.webp", alt: "Google Play" },
                ].map(({ src, alt }, i) => (
                  <Link
                    key={i}
                    to="/"
                    className="hover:scale-105 transition duration-300"
                  >
                    <LazyImage src={src} alt={alt} className="h-10 w-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-700 pt-10">
          {/* Quick Links */}
          <FooterSection
            title={t("footer.quick_links")}
            isOpen={quickLinksOpen}
            setIsOpen={setQuickLinksOpen}
          >
            <ul>
              {categories?.slice(0, 4).map((category: Category) => (
                <li key={category.id}>
                  <Link
                    to={`${lang}/category/${category.id}`}
                    className="block py-1 hover:text-purple-400 text-sm transition-all duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection
            title={t("footer.contact")}
            isOpen={contactOpen}
            setIsOpen={setContactOpen}
          >
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-400" />
                {t("footer.location")}
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-purple-400" />
                {t("footer.phone")}
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-purple-400" />
                {t("footer.email")}
              </li>
            </ul>
          </FooterSection>

          {/* My Account */}
          <FooterSection
            title={t("footer.my_account")}
            isOpen={accountOpen}
            setIsOpen={setAccountOpen}
          >
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <FaBoxOpen className="text-purple-400" />
                <Link to="/order-history" className="hover:text-purple-400">
                  {t("footer.order_history")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FaHeart className="text-purple-400" />
                <Link to="/u-favorite" className="hover:text-purple-400">
                  {t("footer.favorite_list")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FaStore className="text-purple-400" />
                <Link to="/admin" className="hover:text-purple-400">
                  {t("footer.be_seller")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FaSignOutAlt className="text-purple-400" />
                <button
                  onClick={() => {
                    handleLogout("end_user", navigate);
                  }}
                  className="hover:text-red-500"
                  aria-label="Logout"
                >
                  {t("footer.logout")}
                </button>
              </li>
            </ul>
          </FooterSection>

          {/* Seller Portal */}
          <FooterSection
            title={t("footer.seller_zone")}
            isOpen={sellerAreaOpen}
            setIsOpen={setSellerAreaOpen}
          >
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  to="/admin"
                  className="text-purple-500 flex items-center gap-2 hover:underline"
                >
                  <FaRocket className="text-purple-400" />
                  {t("footer.join_seller_portal")}
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p
            dangerouslySetInnerHTML={{ __html: t("footer.rights_reserved") }}
          />
          <div className="flex gap-2 mt-3 md:mt-0">
            {["card-01", "card-02", "card-03"].map((card) => (
              <LazyImage
                key={card}
                src={`/images/cards/${card}.jpg`}
                alt="Payment Option"
                className="h-6 rounded shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
