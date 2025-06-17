import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useAdminManagement } from '../hooks/use-admin-management';
import { useAdminHook } from '../hooks/use-admin';
import { toast } from 'react-toastify';

export const AdminPanel: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { 
    isLoading: managementLoading,
    getAdminRegistryStats,
    createAdminCapTransaction,
    revokeAdminCapTransaction,
    getActiveAdmins 
  } = useAdminManagement();
  
  const { 
    checkIsAdmin,
    withdrawRegistryFees,
    updateTreasuryAddress,
    getRegistryFeeInfo 
  } = useAdminHook();

  const [adminStats, setAdminStats] = useState<any>(null);
  const [activeAdmins, setActiveAdmins] = useState<string[]>([]);
  const [feeInfo, setFeeInfo] = useState<any>(null);
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [revokeAddress, setRevokeAddress] = useState('');
  const [newTreasuryAddress, setNewTreasuryAddress] = useState('');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentAccount?.address) {
        const adminStatus = await checkIsAdmin();
        setIsUserAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [currentAccount, checkIsAdmin]);

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (isUserAdmin) {
        setLoading(true);
        try {
          // Load registry stats
          const stats = await getAdminRegistryStats();
          setAdminStats(stats);

          // Load active admins
          const admins = await getActiveAdmins();
          setActiveAdmins(admins);

          // Load fee info
          const fees = await getRegistryFeeInfo();
          setFeeInfo(fees);
        } catch (error) {
          console.error('Error loading admin data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAdminData();
  }, [isUserAdmin, getAdminRegistryStats, getActiveAdmins, getRegistryFeeInfo]);

  const handleCreateAdmin = async () => {
    if (!newAdminAddress.trim()) {
      toast.error('Please enter a valid address');
      return;
    }

    try {
      setLoading(true);
      const transaction = await createAdminCapTransaction(newAdminAddress.trim());
      
      signAndExecuteTransaction(
        { transaction },
        {
          onSuccess: () => {
            toast.success('Admin capability created successfully!');
            setNewAdminAddress('');
            // Refresh admin data
            getActiveAdmins().then(setActiveAdmins);
            getAdminRegistryStats().then(setAdminStats);
          },
          onError: (error) => {
            console.error('Failed to create admin capability:', error);
            toast.error('Failed to create admin capability');
          },
        }
      );
    } catch (error) {
      console.error('Error creating admin capability:', error);
      toast.error('Error creating admin capability');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!revokeAddress.trim()) {
      toast.error('Please enter a valid address');
      return;
    }

    try {
      setLoading(true);
      const transaction = await revokeAdminCapTransaction(revokeAddress.trim());
      
      signAndExecuteTransaction(
        { transaction },
        {
          onSuccess: () => {
            toast.success('Admin capability revoked successfully!');
            setRevokeAddress('');
            // Refresh admin data
            getActiveAdmins().then(setActiveAdmins);
            getAdminRegistryStats().then(setAdminStats);
          },
          onError: (error) => {
            console.error('Failed to revoke admin capability:', error);
            toast.error('Failed to revoke admin capability');
          },
        }
      );
    } catch (error) {
      console.error('Error revoking admin capability:', error);
      toast.error('Error revoking admin capability');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTreasury = async () => {
    if (!newTreasuryAddress.trim()) {
      toast.error('Please enter a valid treasury address');
      return;
    }

    try {
      setLoading(true);
      await updateTreasuryAddress(newTreasuryAddress.trim());
      setNewTreasuryAddress('');
      // Refresh fee info
      const fees = await getRegistryFeeInfo();
      setFeeInfo(fees);
    } catch (error) {
      console.error('Error updating treasury address:', error);
      toast.error('Error updating treasury address');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFees = async () => {
    try {
      setLoading(true);
      await withdrawRegistryFees();
      // Refresh fee info
      const fees = await getRegistryFeeInfo();
      setFeeInfo(fees);
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      toast.error('Error withdrawing fees');
    } finally {
      setLoading(false);
    }
  };

  if (!currentAccount) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>
        <p className="text-gray-600">Please connect your wallet to access the admin panel.</p>
      </div>
    );
  }

  if (!isUserAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>
        <p className="text-gray-600">You don't have admin privileges. Only users with admin capabilities can access this panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Auction House Admin Panel</h2>
        
        {loading || managementLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Admin Statistics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Registry Statistics</h3>
              {adminStats ? (
                <div className="space-y-2">
                  <p><span className="font-medium">Deployer:</span> {adminStats.deployer?.slice(0, 8)}...</p>
                  <p><span className="font-medium">Total Admins:</span> {adminStats.totalAdminCount}</p>
                  <p><span className="font-medium">Active Admins:</span> {adminStats.activeAdminCount}</p>
                </div>
              ) : (
                <p className="text-blue-100">Loading statistics...</p>
              )}
            </div>

            {/* Fee Information */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Fee Information</h3>
              {feeInfo ? (
                <div className="space-y-2">
                  <p><span className="font-medium">Fee Balance:</span> {feeInfo.feeBalanceSui?.toFixed(4)} SUI</p>
                  <p><span className="font-medium">Treasury:</span> {feeInfo.treasuryAddress?.slice(0, 8)}...</p>
                  <button
                    onClick={handleWithdrawFees}
                    disabled={loading || !feeInfo.feeBalanceSui || feeInfo.feeBalanceSui === 0}
                    className="mt-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    Withdraw Fees
                  </button>
                </div>
              ) : (
                <p className="text-green-100">Loading fee info...</p>
              )}
            </div>

            {/* Active Admins */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Active Admins</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeAdmins.length > 0 ? (
                  activeAdmins.map((admin, index) => (
                    <div key={index} className="text-sm bg-white bg-opacity-20 rounded px-2 py-1">
                      {admin.slice(0, 8)}...{admin.slice(-6)}
                    </div>
                  ))
                ) : (
                  <p className="text-purple-100">No active admins found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Create Admin */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Admin Capability</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter recipient address"
              value={newAdminAddress}
              onChange={(e) => setNewAdminAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCreateAdmin}
              disabled={loading || !newAdminAddress.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin Capability'}
            </button>
          </div>
        </div>

        {/* Revoke Admin */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Revoke Admin Capability</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter admin address to revoke"
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={handleRevokeAdmin}
              disabled={loading || !revokeAddress.trim()}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Revoking...' : 'Revoke Admin Capability'}
            </button>
          </div>
        </div>
      </div>

      {/* Treasury Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Treasury Management</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter new treasury address"
            value={newTreasuryAddress}
            onChange={(e) => setNewTreasuryAddress(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleUpdateTreasury}
            disabled={loading || !newTreasuryAddress.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Treasury'}
          </button>
        </div>
      </div>
    </div>
  );
}; 