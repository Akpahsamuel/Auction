import { FaGithub, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="border-t border-[#006fee]/20">
      <div className="container py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold gradient-text">
            NFTVerse
          </Link>
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
        </div>
      </div>
    </div>
  );
};

export default Footer;
