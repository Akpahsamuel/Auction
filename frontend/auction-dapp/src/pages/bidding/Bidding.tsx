import { useState } from 'react';
import './Bidding.css';

interface AuctionItem {
  id: string;
  name: string;
  description: string;
  currentBid: number;
  imageUrl: string;
  endTime: Date;
  creator: string;
}

const Bidding = () => {
  // Mock data - replace with real data from your backend
  const [auctions] = useState<AuctionItem[]>([
    {
      id: '1',
      name: 'Cosmic Perspective #1',
      description: 'A unique digital artwork exploring the vastness of space',
      currentBid: 0.5,
      imageUrl: 'https://placeholder.com/400',
      endTime: new Date(Date.now() + 86400000), // 24 hours from now
      creator: '0x1234...5678'
    },
    // Add more mock items as needed
  ]);

  const formatAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const timeLeft = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bidding-page">
      <div className="bidding-header">
        <h1>Live Auctions</h1>
        <div className="filters">
          <select defaultValue="all">
            <option value="all">All Categories</option>
            <option value="art">Art</option>
            <option value="collectibles">Collectibles</option>
            <option value="music">Music</option>
          </select>
          <select defaultValue="recent">
            <option value="recent">Recently Added</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className="auctions-grid">
        {auctions.map(auction => (
          <div key={auction.id} className="auction-card">
            <div className="auction-image">
              <img src={auction.imageUrl} alt={auction.name} />
              <div className="time-left">
                <span>{timeLeft(auction.endTime)} left</span>
              </div>
            </div>
            <div className="auction-info">
              <h3>{auction.name}</h3>
              <p className="creator">Created by {formatAddress(auction.creator)}</p>
              <div className="bid-info">
                <div>
                  <span className="label">Current Bid</span>
                  <span className="value">{auction.currentBid} ETH</span>
                </div>
                <button className="btn btn-primary bid-button">Place Bid</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bidding;
