import logo from '../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src={logo} alt="AuctionS Logo" className="footer-logo" />
          <p className="footer-description">
            A decentralized marketplace for unique digital assets and NFTs.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Explore</a></li>
            <li><a href="#">Create</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Platform Status</a></li>
            <li><a href="#">Partners</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Telegram</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AuctionS. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
