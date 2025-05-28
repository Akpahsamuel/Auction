import logo from '../assets/logo.svg';

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="AuctionS Logo" className="logo" />
        </Link>
        <div className="nav-links">
          <Link to="/create">Create</Link>
          <Link to="/bidding">Bidding</Link>
          <Link to="/about">About</Link>
        </div>
        <button className="btn btn-primary">Connect Wallet</button>
      </nav>
    </header>
  );
};

export default Header;
