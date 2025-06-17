import { useEffect, useState } from "react";
import { useAdminHook } from "../../../hooks/use-admin";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Settings, Coins, RefreshCw, Shield, AlertTriangle, UserPlus } from "lucide-react";

const AdminPage = () => {
  const [registryFeeInfo, setRegistryFeeInfo] = useState<{
    feeBalance: number;
    treasuryAddress: string;
  } | null>(null);
  const [newTreasuryAddress, setNewTreasuryAddress] = useState("");
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isUpdatingTreasury, setIsUpdatingTreasury] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const { 
    withdrawRegistryFees, 
    updateTreasuryAddress,
    getRegistryFeeInfo,
    checkIsAdmin,
    createAdminCap,
  } = useAdminHook();
  
  const currentAccount = useCurrentAccount();

  const verifyAdminAccess = async () => {
    if (!currentAccount) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    setCheckingAdmin(true);
    try {
      const hasAdminAccess = await checkIsAdmin();
      setIsAdmin(hasAdminAccess);
    } catch (error) {
      console.error("Error verifying admin access:", error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchFeeInfo = async () => {
    setLoading(true);
    try {
      const registryInfo = await getRegistryFeeInfo();
      console.log("Raw registry fee info:", registryInfo); // Debug log
      setRegistryFeeInfo(registryInfo);
    } catch (error) {
      console.error("Error fetching fee info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdminAccess();
  }, [currentAccount]);

  useEffect(() => {
    if (isAdmin === true) {
      fetchFeeInfo();
    }
  }, [isAdmin]);

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

  const handleCreateAdminCap = async () => {
    if (!newAdminAddress.trim()) {
      alert("Please enter a valid recipient address");
      return;
    }

    // Basic address validation
    if (!newAdminAddress.startsWith("0x") || newAdminAddress.length !== 66) {
      alert("Please enter a valid Sui address (should start with 0x and be 66 characters long)");
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await createAdminCap(newAdminAddress.trim());
      setNewAdminAddress("");
    } catch (error) {
      console.error("Error creating admin capability:", error);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const formatSui = (mist: number) => {
    const suiValue = mist / 1_000_000_000;
    console.log(`Converting ${mist} MIST to ${suiValue} SUI`); // Debug log
    return suiValue.toFixed(4);
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

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Admin Access</h2>
          <p className="text-gray-600">Checking your admin capabilities...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have the required admin capabilities to access this panel.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-red-800">
              <strong>Admin access requires:</strong>
            </p>
            <ul className="text-sm text-red-700 mt-2 space-y-1">
              <li>• Ownership of an AuctionHouseCap NFT</li>
              <li>• Connected wallet with admin privileges</li>
            </ul>
          </div>
          <div className="mt-6">
            <button
              onClick={verifyAdminAccess}
              disabled={checkingAdmin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
            >
              {checkingAdmin ? 'Checking...' : 'Refresh Admin Status'}
            </button>
            <p className="text-xs text-gray-500">
              Connected as: <span className="font-mono">{currentAccount.address}</span>
            </p>
          </div>
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

        {/* Fee Information Card */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Coins className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Collected Fees</h3>
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
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {registryFeeInfo ? formatSui(registryFeeInfo.feeBalance) : '0.0000'} SUI
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Total fees collected from completed auctions (1% of winning bids)
                </p>
                {registryFeeInfo && (
                  <p className="text-xs text-gray-400 mb-4">
                    Raw value: {registryFeeInfo.feeBalance} MIST
                  </p>
                )}
                <button
                  onClick={handleWithdrawRegistryFees}
                  disabled={isWithdrawing || !registryFeeInfo?.feeBalance}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Collected Fees'}
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
              <p className="text-sm font-mono bg-gray-100 p-3 rounded border break-all">
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
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdatingTreasury ? 'Updating...' : 'Update Treasury Address'}
            </button>
          </div>
        </div>

        {/* Admin Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Admin Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important Security Notice</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Creating admin capabilities grants full administrative access to the auction house. 
                    Only grant admin access to trusted addresses.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="newAdminAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address for New Admin Capability
              </label>
              <input
                type="text"
                id="newAdminAddress"
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                placeholder="0x... (66 characters)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                The recipient will receive an AuctionHouseCap NFT granting admin privileges
              </p>
            </div>
            
            <button
              onClick={handleCreateAdminCap}
              disabled={isCreatingAdmin || !newAdminAddress.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingAdmin ? 'Creating Admin Capability...' : 'Create Admin Capability'}
            </button>
          </div>
        </div>

        {/* Fee Collection Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Fee Collection Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Fee Rate:</strong> 1% of winning bid amount</p>
            <p><strong>Collection Trigger:</strong> When auctions are completed (NFT claimed or creator claims proceeds)</p>
            <p><strong>Fee Storage:</strong> All fees are stored in the auction registry</p>
            <p><strong>Withdrawal:</strong> Only admin accounts with AuctionHouseCap can withdraw fees</p>
            <p><strong>Currency:</strong> Fees are collected and stored in SUI</p>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Information</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Connected Account:</strong> {currentAccount.address}</p>
            <p><strong>Network:</strong> Devnet</p>
            <p><strong>Package ID:</strong> {registryFeeInfo ? 'Connected' : 'Loading...'}</p>
            <p className="text-xs text-gray-600 mt-4">
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