import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="border-t border-[#006fee]/20">
      <div className="container py-4 flex flex-col gap-5 md:flex-row justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold gradient-text">
            Predator
          </Link>
        </div>
        <div>
          <div className="ml-10 flex items-baseline gap-5">
            {[
              {
                title: "Term",
                route: "/term",
              },
              {
                title: "Privacy",
                route: "/privacy",
              },
              {
                title: "Help",
                route: "/help",
              },
            ].map((nav) => (
              <Link
                to={nav.route}
                key={nav.route}
                className={`text-sm hover:text-purple-300 transition-all duration-300 text-black`}
              >
                {nav.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 text-gray-600">
          <Link
            to="https://www.x.com"
            className="p-2 rounded-full border border-gray-400 hover:bg-gray-100"
          >
            <FaTwitter size={20} />
          </Link>
          <Link
            className="p-2 rounded-full border border-gray-400 hover:bg-gray-100"
            to="https://github.com/Akpahsamuel/Auction"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            className="p-2 rounded-full border border-gray-400 hover:bg-gray-100"
            to="https://www.instagram.com"
          >
            <FaInstagram size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
