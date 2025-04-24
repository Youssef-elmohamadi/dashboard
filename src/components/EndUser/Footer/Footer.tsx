import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import FooterSection from "./FooterLinks";

export default function Footer() {
  const [queikLinksOpen, setQueikLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sellerAreaOpen, setSellerAreaOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <img
              src="/images/logo.webp"
              alt="Company Logo"
              className="h-12 mb-4"
            />
            <p className="max-w-md text-sm">Best Choice for E-Commerce</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center lg:items-center lg:justify-between my-2">
          <div>
            <p className="my-6">
              Subscribe to our newsletter to get the latest updates on offers
              and coupons.
            </p>
            <div className="w-full md:w-auto flex gap-3">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 text-sm rounded bg-white text-black w-full sm:w-64"
              />
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
                Subscribe
              </button>
            </div>
          </div>
          {/* Social + Apps */}
          <div className="flex flex-col justify-between gap-6">
            <div className="my-2">
              <p className="my-2">Follow us</p>
              <div className="flex gap-4 text-2xl">
                <FaLinkedin />
                <FaYoutube />
                <FaInstagram />
                <FaTwitter />
                <FaFacebook />
              </div>
            </div>
            <div>
              <p className="mb-2">Mobile Apps</p>
              <div className="flex gap-4 my-4">
                <Link to="/">
                  <img
                    src="/images/appstore.webp"
                    alt="App Store"
                    className="h-10"
                  />
                </Link>
                <Link to="/">
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
        {/* Links - collapsible on small screens */}
        <div className="grid md:grid-cols-4 gap-6 transition-all duration-300">
          <FooterSection
            title="Quick Links"
            isOpen={queikLinksOpen}
            setIsOpen={setQueikLinksOpen}
          >
            <>
              <li className="p-1">
                <Link to="/">Electronic</Link>
              </li>
              <li className="p-1">
                <Link to="/">Clothes</Link>
              </li>
              <li className="p-1">
                <Link to="/">Home Appliances</Link>
              </li>
              <li className="p-1">
                <Link to="/">Fashion</Link>
              </li>
            </>
          </FooterSection>

          <FooterSection
            title="Contact"
            isOpen={contactOpen}
            setIsOpen={setContactOpen}
          >
            <>
              <li className="p-1">Saudi Arabia - Al Madinah</li>
              <li className="p-1">Phone: 966501326310</li>
              <li className="p-1">Email: admin@sfqa.io</li>
            </>
          </FooterSection>

          <FooterSection
            title="My Account"
            isOpen={accountOpen}
            setIsOpen={setAccountOpen}
          >
            <>
              <li className="p-1">
                <Link to="/">Logout</Link>
              </li>
              <li className="p-1">
                <Link to="/">Order History</Link>
              </li>
              <li className="p-1">
                <Link to="/">Favorite List</Link>
              </li>
              <li className="p-1">
                <Link to="/">Track Order</Link>
              </li>
              <li className="p-1">
                <Link to="/">Be A Seller</Link>
              </li>
            </>
          </FooterSection>

          <FooterSection
            title="Seller Zone"
            isOpen={sellerAreaOpen}
            setIsOpen={setSellerAreaOpen}
          >
            <>
              <li className="text-purple-500 p-1">
                <Link to="/">Join</Link>
              </li>
              <li className="p-1">
                <Link to="/">Download Seller App</Link>
              </li>
            </>
          </FooterSection>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>All rights reserved © 2025</p>
          <div className="flex gap-2 mt-2 md:mt-0">
            <img src="/license1.png" alt="License 1" className="h-6" />
            <img src="/license2.png" alt="License 2" className="h-6" />
            <img src="/payment.png" alt="Payments" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
