import { useEffect, useState } from "react";
import { useAdminHook } from "../../../hooks/use-admin";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Settings, Coins, RefreshCw, Shield, AlertTriangle, UserPlus, TrendingUp, Database, Users, Lock, CheckCircle2, ArrowDownToLine } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the admin panel.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Admin access requires an AuctionHouseCap NFT in your connected wallet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Admin Access</h2>
          <p className="text-gray-600">Checking your admin capabilities...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have the required admin capabilities to access this panel.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-red-800 mb-2">Admin access requires:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Ownership of an AuctionHouseCap NFT</li>
                  <li>• Connected wallet with admin privileges</li>
                  <li>• Valid network connection</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={verifyAdminAccess}
              disabled={checkingAdmin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {checkingAdmin ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh Admin Status
                </div>
              )}
            </button>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Connected as:</p>
              <p className="text-sm font-mono text-gray-700 break-all">{currentAccount.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md mb-4">
            <Settings className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage auction house fees, treasury settings, and administrative capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Admin Functions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fee Collection Dashboard */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Fee Collection Dashboard</h3>
                    <p className="text-gray-600">Monitor and manage collected auction fees</p>
                  </div>
                </div>
                <button
                  onClick={fetchFeeInfo}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Fee Balance Display */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-6 w-6" />
                        <span className="text-lg font-semibold">Available Fees</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-90">Total Collected</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold">
                        {registryFeeInfo ? formatSui(registryFeeInfo.feeBalance) : '0.0000'} SUI
                      </p>
                      <p className="text-green-100 text-sm">
                        1% fee from completed auctions
                      </p>
                      {registryFeeInfo && (
                        <p className="text-xs text-green-200 font-mono">
                          {registryFeeInfo.feeBalance} MIST
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdrawRegistryFees}
                    disabled={isWithdrawing || !registryFeeInfo?.feeBalance}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {isWithdrawing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Withdrawing Fees...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ArrowDownToLine className="h-5 w-5 mr-2" />
                        Withdraw Collected Fees
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Treasury Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-full bg-purple-100">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Treasury Management</h3>
                  <p className="text-gray-600">Configure treasury address for fee collection</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-purple-800 mb-3">
                    Current Treasury Address
                  </label>
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <p className="text-sm font-mono text-gray-900 break-all">
                      {loading ? (
                        <span className="animate-pulse bg-gray-200 rounded h-4 block"></span>
                      ) : (
                        registryFeeInfo?.treasuryAddress || 'Not available'
                      )}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newTreasuryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    New Treasury Address
                  </label>
                  <input
                    type="text"
                    id="newTreasuryAddress"
                    value={newTreasuryAddress}
                    onChange={(e) => setNewTreasuryAddress(e.target.value)}
                    placeholder="0x... (Enter new treasury address)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This address will receive future fee payments
                  </p>
                </div>
                
                <button
                  onClick={handleUpdateTreasuryAddress}
                  disabled={isUpdatingTreasury || !newTreasuryAddress.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isUpdatingTreasury ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Database className="h-5 w-5 mr-2" />
                      Update Treasury Address
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Admin Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-full bg-blue-100">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Admin Management</h3>
                  <p className="text-gray-600">Create new admin capabilities for trusted users</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-2">Security Warning</p>
                      <p className="text-sm text-yellow-700">
                        Creating admin capabilities grants full administrative access to the auction house. 
                        Only grant admin access to trusted addresses. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newAdminAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address for New Admin Capability
                  </label>
                  <input
                    type="text"
                    id="newAdminAddress"
                    value={newAdminAddress}
                    onChange={(e) => setNewAdminAddress(e.target.value)}
                    placeholder="0x... (66 characters)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The recipient will receive an AuctionHouseCap NFT granting admin privileges
                  </p>
                </div>
                
                <button
                  onClick={handleCreateAdminCap}
                  disabled={isCreatingAdmin || !newAdminAddress.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isCreatingAdmin ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Admin Capability...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Admin Capability
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Information Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Fee Information Card */}
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Fee Collection Info</h3>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Fee Rate</p>
                    <p className="text-blue-100">1% of winning bid amount</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Collection Trigger</p>
                    <p className="text-blue-100">When auctions complete (NFT claimed or creator claims proceeds)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Storage</p>
                    <p className="text-blue-100">All fees stored in auction registry</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Currency</p>
                    <p className="text-blue-100">Collected and stored in SUI</p>
                  </div>
                </div>
              </div>

              {/* Admin Status Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Admin Status</h3>
                  <p className="text-green-600 font-medium">Authenticated</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Connected Account</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{currentAccount.address}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Network</p>
                    <p className="text-sm text-gray-600">Sui Devnet</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Access Level</p>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-600 font-medium">Full Admin Access</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="h-6 w-6" />
                  <h3 className="text-lg font-bold">Security Notice</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-red-100">
                    Only accounts with AuctionHouseCap can perform admin actions.
                  </p>
                  <p className="text-red-100">
                    Keep your admin capabilities secure and never share access with untrusted parties.
                  </p>
                  <p className="text-red-100">
                    All admin actions are recorded on the blockchain for transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;