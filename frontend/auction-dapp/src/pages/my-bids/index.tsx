import { useState } from 'react';
import illustrative2 from '../../assets/illustrative2.avif';

const MyBids = () => {
  const [activeTab, setActiveTab] = useState('active');

  const lostBids = [
    {
      id: 3,
      title: 'Holographic Memories',
      image: illustrative2,
      bid: '3.0 ETH',
      status: 'Lost',
      placedTime: 'Placed 4 days ago',
      timeLeft: 'Ended 2 days ago'
    }
  ];

  const wonBids = [
    {
      id: 2,
      title: 'Virtual Oasis',
      image: illustrative2,
      bid: '2.1 ETH',
      status: 'Won',
      placedTime: 'Placed 3 days ago',
      timeLeft: 'Ended yesterday'
    }
  ];

  const activeBids = [
    {
      id: 1,
      title: 'Cosmic Dreamscape',
      image: illustrative2,
      bid: '2.45 ETH',
      status: 'Currently Winning',
      timeLeft: '10 hours left',
      placedTime: 'Placed 2 hours ago'
    },
    {
      id: 2,
      title: 'Neon Metropolis',
      image: illustrative2,
      bid: '3.5 ETH',
      status: 'Outbid',
      timeLeft: '21 hours left',
      placedTime: 'Placed 5 hours ago'
    },
    {
      id: 3,
      title: 'Ethereal Construct',
      image: illustrative2,
      bid: '1.65 ETH',
      status: 'Outbid',
      timeLeft: '8 hours left',
      placedTime: 'Placed 1 day ago'
    },
    {
      id: 4,
      title: 'Fractal Universe',
      image: illustrative2,
      bid: '2.7 ETH',
      status: 'Pending Confirmation',
      timeLeft: '14 hours left',
      placedTime: 'Placed just now'
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ marginBottom: '16px' }}>My Bids</h1>
        <p className="text-gray-600" style={{ marginBottom: '32px' }}>Track all your active and past bids in one place</p>

        <div className="flex gap-10" style={{ marginBottom: '32px' }}>
          <div 
            className="flex items-center gap-2 relative cursor-pointer"
            onClick={() => setActiveTab('active')}
          >
            <span className={`font-medium pb-2 border-b-2 ${activeTab === 'active' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'}`}>
              Active Bids
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              4
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('won')}
          >
            <span className={`font-medium pb-2 border-b-2 ${activeTab === 'won' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'}`}>
              Won
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'won' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              1
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('lost')}
          >
            <span className={`font-medium pb-2 border-b-2 ${activeTab === 'lost' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'}`}>
              Lost
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'lost' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              1
            </span>
          </div>
        </div>

        <div className="mt-24">
          {activeTab === 'active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeBids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-[24px] p-5 pb-6 shadow-2xl hover:shadow-3xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-4 w-full">
                  <img src={bid.image} alt={bid.title} className="w-[72px] h-[72px] rounded-2xl object-cover flex-shrink-0" />
                  <div className="w-full">
                    <h3 className="text-[16px] font-bold text-gray-900 mb-1">{bid.title}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-[16px] font-semibold">{bid.bid}</span>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-1">
                      <span className="text-[12px] text-gray-500">{bid.placedTime}</span>
                      <span className="text-[12px] text-gray-500 text-right">{bid.timeLeft}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  bid.status === 'Currently Winning' ? 'bg-green-50 text-green-600' :
                  bid.status === 'Outbid' ? 'bg-red-50 text-red-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {bid.status}
                </span>
              </div>
              <div className="pt-6">
                <div className="flex gap-4 justify-center">
                  <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-[#E6F0FF] text-[#0052CC] rounded-xl text-[14px] font-medium hover:bg-blue-100 transition-colors">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View NFT
                  </button>
                  {bid.status === 'Outbid' && (
                    <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-[#0066FF] text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl shadow-black/20 hover:shadow-black/30">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      Place New Bid
                    </button>
                  )}
                  {bid.status === 'Pending Confirmation' && (
                    <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[14px] font-medium cursor-wait">
                      <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Confirming
                    </button>
                  )}
                </div>
              </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'won' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wonBids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-[24px] p-5 pb-6 shadow-2xl hover:shadow-3xl transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-4 w-full">
                      <img src={bid.image} alt={bid.title} className="w-[72px] h-[72px] rounded-2xl object-cover flex-shrink-0" />
                      <div className="w-full">
                        <h3 className="text-[16px] font-bold text-gray-900 mb-1">{bid.title}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-[16px] font-semibold">{bid.bid}</span>
                        </div>
                        <div className="grid grid-cols-2 w-full mt-1">
                          <span className="text-[12px] text-gray-500">{bid.placedTime}</span>
                          <span className="text-[12px] text-gray-500 text-right">{bid.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-green-50 text-green-600">
                      Won
                    </span>
                  </div>
                  <div className="pt-6">
                    <div className="flex gap-4 justify-center">
                      <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-[#E6F0FF] text-[#0052CC] rounded-xl text-[14px] font-medium hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View NFT
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-[#22C55E] text-black rounded-xl text-[14px] font-medium hover:bg-green-600 hover:text-white transition-colors shadow-lg hover:shadow-xl shadow-black/20 hover:shadow-black/30">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Claim NFT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'lost' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lostBids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-[24px] p-5 pb-6 shadow-2xl hover:shadow-3xl transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-4 w-full">
                      <img src={bid.image} alt={bid.title} className="w-[72px] h-[72px] rounded-2xl object-cover flex-shrink-0" />
                      <div className="w-full">
                        <h3 className="text-[16px] font-bold text-gray-900 mb-1">{bid.title}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-[16px] font-semibold">{bid.bid}</span>
                        </div>
                        <div className="grid grid-cols-2 w-full mt-1">
                          <span className="text-[12px] text-gray-500">{bid.placedTime}</span>
                          <span className="text-[12px] text-gray-500 text-right">{bid.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-red-50 text-red-600">
                      Lost
                    </span>
                  </div>
                  <div className="pt-6">
                    <div className="flex gap-4 justify-center">
                      <button className="flex-1 flex items-center justify-center px-4 py-1.5 bg-[#E6F0FF] text-[#0052CC] rounded-xl text-[14px] font-medium hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View NFT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBids;
