import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About AuctionS</h1>
        <p className="subtitle">Building the future of digital asset trading</p>
      </section>

      <section className="about-content">
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            AuctionS is dedicated to revolutionizing the way digital assets are bought and sold. 
            We provide a secure, transparent, and user-friendly platform for creators and collectors 
            to participate in the exciting world of NFTs.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Secure Trading</h3>
            <p>
              Built on blockchain technology, ensuring secure and transparent transactions 
              for all participants.
            </p>
          </div>

          <div className="feature-card">
            <h3>Fair Bidding</h3>
            <p>
              Our advanced bidding system ensures fair competition and prevents last-minute 
              bid sniping.
            </p>
          </div>

          <div className="feature-card">
            <h3>Creator Support</h3>
            <p>
              We provide tools and resources to help creators mint, list, and promote their 
              digital assets.
            </p>
          </div>

          <div className="feature-card">
            <h3>Community First</h3>
            <p>
              Built with and for our community, with regular updates and features based on 
              user feedback.
            </p>
          </div>
        </div>

        <div className="team-section">
          <h2>Our Team</h2>
          <p>
            AuctionS is built by a team of blockchain enthusiasts, developers, and digital 
            art lovers who believe in the potential of NFTs to transform the creative economy.
          </p>
        </div>

        <div className="contact-section">
          <h2>Get in Touch</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you. Reach out to our team 
            through any of our community channels.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">Discord</a>
            <a href="#" className="social-link">Telegram</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
