import artwork1 from '../../assets/artwork1.png';
import illustrative1 from '../../assets/illustrative1.jpg';
import illustrative2 from '../../assets/illustrative2.avif';
import illustrative3 from '../../assets/illustrative3.avif';

const Home = () => {
  return (
    <main>
      <section className="hero">
        <h1>Discover and Collect<br />Remarkable NFTs</h1>
        <p>Explore an extraordinary selection of artworks from emerging and established societies worldwide.</p>
        <button className="btn btn-primary">Start Bidding</button>
      </section>

      <section className="gallery">
        <div className="gallery-item">
          <img src={artwork1} alt="Featured Artwork" />
        </div>
      </section>

      <section className="tips-section">
        <h2>Discover helpful bidding tips</h2>
        <p className="tips-subtitle">Unlock domain insights so you can bid with confidence.</p>
        
        <div className="tips-container">
          <div className="tip-card">
            <div className="tip-image">
              <img src={illustrative1} alt="How to create an NFT" />
            </div>
            <h3>How to create an NFT</h3>
            <p>Get recommendations on how to create an NFT.</p>
          </div>

          <div className="tip-card">
            <div className="tip-image">
              <img src={illustrative2} alt="Keyword research tips" />
            </div>
            <h3>Keyword research tips</h3>
            <p>Optimize your website for search engines.</p>
          </div>

          <div className="tip-card">
            <div className="tip-image">
              <img src={illustrative3} alt="Auctions bidding guide" />
            </div>
            <h3>Auctions bidding guide</h3>
            <p>Check out our step-by-step bidding guide for Namecheap Auctions.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
