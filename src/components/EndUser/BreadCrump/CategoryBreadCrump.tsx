import { Link } from "react-router-dom";

const CategoryBreadCrump = ({ currentPage }) => {
  return (
    <div className="-mt-7">
      <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
          <Link
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden  focus:text-blue-600"
            to="/"
          >
            Home
          </Link>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-gray-800 truncate"
          aria-current="page"
        >
          {currentPage}
        </li>
      </ol>
    </div>
  );
};

export default CategoryBreadCrump;
