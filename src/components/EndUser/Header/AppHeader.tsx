import React from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { Separator } from "../Separator/Separator";
import { IoIosMenu } from "react-icons/io";
const AppHeader = () => {
  return (
    <header className="container py-4 flex items-center justify-start gap-12">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex gap-2 items-center w-full">
          {/* MenuIcon */}
          <div className="md:hidden">
            <button>
              <IoIosMenu className="text-2xl" />
            </button>
          </div>
          {/* logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-[1]">
            <div>
              <Link to="/">
                <img src="/images/logo.webp" className="w-32" alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="md:hidden">
            <CiSearch className="text-2xl" />
          </div>
        </div>
      </div>
      {/* search */}
      <div className="md:flex items-center gap-2 hidden flex-[3] lg:flex-[2]">
        <div className="flex items-center gap-2 relative w-full">
          <input
            type="text"
            placeholder="i'm Search about..."
            className="rounded-full text-sm px-4 py-2 border border-soft-light focus:outline-none focus:border-secondary-base w-full"
          />
          <div className="absolute right-4">
            <CiSearch className="text-2xl" />
          </div>
        </div>
      </div>
      {/* cart or Login */}
      <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
        <div className="flex items-center gap-2">
          <div>
            <FaRegCircleUser className="text-2xl mt-1 text-secondary bg-transparent" />
          </div>
          <Separator />
        </div>
        <div className="flex items-center gap-2 ">
          <div className="text-secondary text-sm">
            <Link to="/login">Login</Link>
          </div>
          <Separator />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-secondary text-sm">
            <Link to="/signup">Signup</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
