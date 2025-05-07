import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import FooterSection from "./FooterLinks";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { handleLogout } from "../Auth/Logout";

export default function Footer() {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sellerAreaOpen, setSellerAreaOpen] = useState(false);
  const [Categories, setCategories] = useState<any>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="w-28 h-18">
              <img
                src="/images/logo/logo-white.png"
                alt="Company Logo"
                className="mb-4"
              />
            </div>
            <p className="max-w-md text-sm mt-2">Best Choice for E-Commerce</p>
          </div>
        </div>

        {/* Newsletter + Social */}
        <div className="flex flex-col lg:flex-row justify-center lg:items-center lg:justify-between my-4 gap-8">
          <div>
            <p className="my-4">
              Subscribe to our newsletter to get the latest updates on offers
              and coupons.
            </p>
            <div className="w-full md:w-auto flex gap-3 flex-wrap">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 text-sm rounded bg-white text-black w-full sm:w-64"
              />
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="mb-2">Follow us</p>
              <div className="flex gap-4 text-2xl">
                {[
                  FaLinkedin,
                  FaYoutube,
                  FaInstagram,
                  FaTwitter,
                  FaFacebook,
                ].map((Icon, i) => (
                  <Icon
                    key={i}
                    className="hover:text-purple-400 transition duration-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2">Mobile Apps</p>
              <div className="flex gap-4 my-4">
                <Link
                  to="/"
                  className="hover:opacity-80 transition duration-300"
                >
                  <img
                    src="/images/appstore.webp"
                    alt="App Store"
                    className="h-10"
                  />
                </Link>
                <Link
                  to="/"
                  className="hover:opacity-80 transition duration-300"
                >
                  <img
                    src="/images/googleplay.webp"
                    alt="Google Play"
                    className="h-10"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-6 transition-all duration-300 mt-10">
          <FooterSection
            title="Quick Links"
            isOpen={quickLinksOpen}
            setIsOpen={setQuickLinksOpen}
          >
            <ul className="mt-1">
              {Categories?.slice(0, 4).map((category, i) => (
                <li key={i}>
                  <Link
                    to={`/category/${category.id}`}
                    className="text-white py-1 block hover:text-purple-400 transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection
            title="Contact"
            isOpen={contactOpen}
            setIsOpen={setContactOpen}
          >
            <ul className="mt-1">
              <li className="p-1">Egypt - Cairo</li>
              <li className="p-1">Phone: 966501326310</li>
              <li className="p-1">Email: admin@sfqa.io</li>
            </ul>
          </FooterSection>

          <FooterSection
            title="My Account"
            isOpen={accountOpen}
            setIsOpen={setAccountOpen}
          >
            <ul className="mt-1 space-y-1">
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-500 transition"
                >
                  Logout
                </button>
              </li>
              <li>
                <Link
                  to="/order-history"
                  className="hover:text-purple-400 transition"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  to="/u-favorite"
                  className="hover:text-purple-400 transition"
                >
                  Favorite List
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-400 transition">
                  Be A Seller
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection
            title="Seller Zone"
            isOpen={sellerAreaOpen}
            setIsOpen={setSellerAreaOpen}
          >
            <ul className="mt-1">
              <li className="p-1">
                <Link
                  to="/admin"
                  className="text-purple-500 hover:underline transition"
                >
                  Join
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>All rights reserved © 2025</p>
          <div className="flex gap-3 mt-2 md:mt-0">
            <img
              src="/images/cards/card-01.jpg"
              alt="License 1"
              className="h-6"
            />
            <img
              src="/images/cards/card-01.jpg"
              alt="License 2"
              className="h-6"
            />
            <img
              src="/images/cards/card-01.jpg"
              alt="Payments"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
