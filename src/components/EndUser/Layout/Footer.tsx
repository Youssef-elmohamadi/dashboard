import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterSection from "./FooterLinks";
import { handleLogout } from "../../common/Auth/Logout";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LazyImage from "../../common/LazyImage";
import { Category } from "../../../types/Categories";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import {
  FacebookIcon,
  InstagramIcon,
} from "../../../icons/SocialmediaIcon";
import MapIcon from "../../../icons/MapIcon";
import CallIcon from "../../../icons/CallIcon";
import MessageIcon from "../../../icons/MessageIcon";
import RocketIcon from "../../../icons/RocketIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import StoreIcon from "../../../icons/StoreIcon";
import HeartIcon from "../../../icons/HeartIcon";
import { Order } from "../../../icons";
import TiktokIcon from "../../../icons/TiktokIcon";

export default function Footer() {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sellerAreaOpen, setSellerAreaOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserFooter"]);
  const { data: categories } = useCategories();
  const { lang } = useDirectionAndLanguage();
  const iconClass =
    "text-gray-400 hover:text-red-400 transition duration-300 transform hover:scale-125";

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-14 shadow-inner">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-700 pb-8">
          <div>
            <LazyImage
              src={`/images/logo/${lang}-dark-logo.webp`}
              alt="Company Logo"
              className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
            />
            <p className="text-sm text-gray-300 italic tracking-wide">
              {t("footer.tagline")}
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 w-full lg:w-1/2 transition hover:shadow-red-800/30">
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
                className="px-4 py-2 rounded-lg bg-white text-black text-sm w-full sm:w-64 focus:outline-red-500"
                aria-label="Email"
              />
              <button className="bg-red-600 hover:bg-red-700 px-6 py-2 text-white rounded-lg shadow-md transition hover:scale-105 duration-300">
                {t("footer.newsletter_button")}
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="mb-2 font-medium text-sm">
                {t("footer.follow_us")}
              </p>
              <div className="flex gap-4 text-2xl">
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TiktokIcon className={iconClass} />
                </a>
                {/* <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon className={iconClass} />
                </a> */}
                <a
                  href="https://www.instagram.com/tashtiba.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className={iconClass} />
                </a>
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon className={iconClass} />
                </a> */}
                <a
                  href="https://www.facebook.com/share/1aKRVrf8rZ/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon className={iconClass} />
                </a>
              </div>
            </div>

            {/* <div>
              <p className="mb-2 font-medium text-sm">
                {t("footer.download_app")}
              </p>
              <div className="flex gap-4">
                {[
                  {
                    src: "/images/Application/appstore.webp",
                    alt: "App Store",
                  },
                  {
                    src: "/images/Application/googleplay.webp",
                    alt: "Google Play",
                  },
                ].map(({ src, alt }, i) => (
                  <Link
                    key={i}
                    to="/"
                    className="hover:scale-105 transition duration-300"
                  >
                    <LazyImage
                      src={src}
                      alt={alt}
                      className="h-[59px] w-[200px]"
                    />
                  </Link>
                ))}
              </div>
            </div> */}
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
                    to={`/${lang}/category/${category.id}`}
                    className="block py-1 hover:text-red-400 text-sm transition-all duration-200"
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
            <ul className="text-sm space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <MapIcon className="text-red-400 w-4" />
                <span>{t("footer.location")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CallIcon className="text-red-400 w-4" />
                <a
                  href="tel:01557408095"
                  className="hover:text-red-400 transition"
                >
                  01557408095
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageIcon className="text-red-400 w-4" />
                <a
                  href="mailto:tashtiba.eg@gmail.com"
                  className="hover:text-red-400 transition"
                >
                  tashtiba.eg@gmail.com
                </a>
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
                <Order className="text-red-400 text-lg" />
                <Link to="/order-history" className="hover:text-red-400">
                  {t("footer.order_history")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <HeartIcon className="text-red-400 w-4" />
                <Link to="/u-favorite" className="hover:text-red-400">
                  {t("footer.favorite_list")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <StoreIcon className="text-red-400 text-base" />
                <Link to="/admin/signup" className="hover:text-red-400 ">
                  {t("footer.be_seller")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <LogoutIcon className="text-red-400 w-4" />
                <button
                  onClick={() => {
                    handleLogout("end_user", navigate, lang);
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
                  to="/admin/signup"
                  className="text-red-500 flex items-center gap-2 hover:underline"
                >
                  <RocketIcon className="text-red-400 text-lg" />
                  {t("footer.join_seller_portal")}
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 pt-6 flex justify-center items-center text-sm text-gray-400">
          <p
            dangerouslySetInnerHTML={{ __html: t("footer.rights_reserved") }}
          />
          {/* <div className="flex gap-2 mt-3 md:mt-0">
            {["card-01", "card-02", "card-03"].map((card) => (
              <LazyImage
                key={card}
                src={`/images/partners/${card}.webp`}
                alt="Payment Option"
                className="h-[80px] rounded shadow-sm"
              />
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
