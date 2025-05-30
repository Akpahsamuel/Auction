import { useState } from 'react';
import { Mail, Globe, Twitter, Instagram } from 'lucide-react';
import artwork1 from '../../assets/artwork1.png';
import illustrative1 from '../../assets/illustrative1.jpg';
import heroImg from '../../assets/images/hero-img.jpg';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('owned');
  
  // Mock data - replace with actual data from your backend
  const user = {
    name: 'Alex Johnson',
    username: '@cryptoalex',
    bio: 'Digital art collector and blockchain enthusiast. Always looking for the next innovative NFT project.',
    details: {
      email: 'alex@example.com',
      website: 'alexjohnson.crypto',
      twitter: '@cryptoalex',
      instagram: '@alexjohnson',
      joined: 'January 2022'
    },
    stats: {
      collections: 12,
      owned: 24,
    },
  };

  const nfts = [
    { 
      id: 1, 
      name: 'Virtual Oasis', 
      image: artwork1, 
      price: '2.1 ETH',
      status: 'Owned'
    },
    { 
      id: 2, 
      name: 'Quantum Artifact', 
      image: illustrative1, 
      price: '0.8 ETH',
      status: 'Owned'
    },
    { 
      id: 3, 
      name: 'Digital Genesis', 
      image: heroImg, 
      price: '1.2 ETH',
      status: 'Owned'
    },
  ];

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-gray-700 to-gray-900 overflow-hidden">
        <img 
          src={heroImg} 
          alt="cover" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - About & Details */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Profile Picture */}
              <div className="relative -mt-20 mb-4">
                <img 
                  src={heroImg}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.username}</p>
              
              <div className="flex gap-4 mb-6">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Share
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Edit Profile
                </button>
              </div>

              <h2 className="font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 mb-6">{user.bio}</p>

              <h2 className="font-semibold text-gray-900 mb-2">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{user.details.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-5 h-5 mr-2" />
                  <span>{user.details.website}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Twitter className="w-5 h-5 mr-2" />
                  <span>{user.details.twitter}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Instagram className="w-5 h-5 mr-2" />
                  <span>{user.details.instagram}</span>
                </div>
                <div className="flex items-center text-gray-600 pt-2 border-t">
                  <span>Joined {user.details.joined}</span>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.stats.collections}</div>
                  <div className="text-sm text-gray-600">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.stats.owned}</div>
                  <div className="text-sm text-gray-600">Owned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs & Content */}
          <div className="md:w-2/3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <nav className="flex space-x-8 px-6">
                {['Profile', 'Collection', 'Activity', 'Settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`py-4 px-1 border-b-2 font-medium ${
                      activeTab === tab.toLowerCase()
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div key={nft.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{nft.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">{nft.price}</span>
                      <span className="text-sm text-gray-500">{nft.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
