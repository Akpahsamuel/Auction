import { useEffect, useState } from "react";
import { useAdminHook } from "../../../hooks/use-admin";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Settings, DollarSign, Wallet, RefreshCw, Shield } from "lucide-react";

const AdminPage = () => {
  const [registryFeeInfo, setRegistryFeeInfo] = useState<{
    feeBalance: number;
    treasuryAddress: string;
  } | null>(null);
  const [capFeeBalance, setCapFeeBalance] = useState<number>(0);
  const [newTreasuryAddress, setNewTreasuryAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isUpdatingTreasury, setIsUpdatingTreasury] = useState(false);

  const { 
    withdrawRegistryFees, 
    withdrawCapFees, 
    updateTreasuryAddress,
    getRegistryFeeInfo,
    getAuctionHouseCapFeeBalance
  } = useAdminHook();
  
  const currentAccount = useCurrentAccount();

  const fetchFeeInfo = async () => {
    setLoading(true);
    try {
      const [registryInfo, capBalance] = await Promise.all([
        getRegistryFeeInfo(),
        getAuctionHouseCapFeeBalance()
      ]);
      
      setRegistryFeeInfo(registryInfo);
      setCapFeeBalance(capBalance);
    } catch (error) {
      console.error("Error fetching fee info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeInfo();
  }, []);

  const handleWithdrawRegistryFees = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawRegistryFees();
      // Refresh fee info after withdrawal
      await fetchFeeInfo();
    } catch (error) {
      console.error("Error withdrawing registry fees:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawCapFees = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawCapFees();
      // Refresh fee info after withdrawal
      await fetchFeeInfo();
    } catch (error) {
      console.error("Error withdrawing cap fees:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleUpdateTreasuryAddress = async () => {
    if (!newTreasuryAddress.trim()) {
      alert("Please enter a valid treasury address");
      return;
    }

    setIsUpdatingTreasury(true);
    try {
      await updateTreasuryAddress(newTreasuryAddress.trim());
      setNewTreasuryAddress("");
      // Refresh fee info after update
      await fetchFeeInfo();
    } catch (error) {
      console.error("Error updating treasury address:", error);
    } finally {
      setIsUpdatingTreasury(false);
    }
  };

  const formatSui = (mist: number) => {
    return (mist / 1_000_000_000).toFixed(4);
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600">Please connect your wallet to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Manage auction house fees and administrative settings
          </p>
        </div>

        {/* Fee Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Registry Fees Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Registry Fees</h3>
              </div>
              <button
                onClick={fetchFeeInfo}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {registryFeeInfo ? formatSui(registryFeeInfo.feeBalance) : '0.0000'} SUI
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Available for withdrawal from registry
                </p>
                <button
                  onClick={handleWithdrawRegistryFees}
                  disabled={isWithdrawing || !registryFeeInfo?.feeBalance}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Registry Fees'}
                </button>
              </div>
            )}
          </div>

          {/* Auction House Cap Fees Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cap Fees</h3>
              </div>
            </div>
            
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {formatSui(capFeeBalance)} SUI
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Available for withdrawal from auction house cap
                </p>
                <button
                  onClick={handleWithdrawCapFees}
                  disabled={isWithdrawing || !capFeeBalance}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Cap Fees'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Treasury Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treasury Management</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Treasury Address
              </label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded border break-all">
                {loading ? 'Loading...' : (registryFeeInfo?.treasuryAddress || 'Not available')}
              </p>
            </div>
            
            <div>
              <label htmlFor="newTreasuryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                New Treasury Address
              </label>
              <input
                type="text"
                id="newTreasuryAddress"
                value={newTreasuryAddress}
                onChange={(e) => setNewTreasuryAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleUpdateTreasuryAddress}
              disabled={isUpdatingTreasury || !newTreasuryAddress.trim()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingTreasury ? 'Updating...' : 'Update Treasury Address'}
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Connected Account:</strong> {currentAccount.address}</p>
            <p><strong>Network:</strong> Devnet</p>
            <p><strong>Fee Percentage:</strong> 1% per auction</p>
            <p className="text-xs text-blue-600 mt-4">
              Note: Only accounts with the AuctionHouseCap can perform admin actions. 
              If you encounter authorization errors, ensure you have the proper admin capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 