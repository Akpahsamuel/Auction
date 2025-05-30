import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#0052CC"/>
                <path d="M12 6L16.5 13.5H7.5L12 6Z" fill="white"/>
                <path d="M12 18L7.5 10.5H16.5L12 18Z" fill="white"/>
              </svg>
              <span className="text-xl font-bold text-[#0052CC]">NFTVERSE</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                Home
              </Link>
              <Link 
                to="/explore" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/explore' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                Explore
              </Link>
              <Link 
                to="/auctions" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/auctions' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                Auctions
              </Link>
              <Link 
                to="/my-bids" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/my-bids' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                My Bids
              </Link>
              <Link 
                to="/wallet" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/wallet' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                Wallet
              </Link>
              <Link 
                to="/profile" 
                className={`px-1 pt-1 border-b-2 text-base font-semibold ${location.pathname === '/profile' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`}
              >
                Profile
              </Link>
            </div>
          </nav>
          
          <div className="flex items-center">
            <button className="bg-[#0052CC] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
