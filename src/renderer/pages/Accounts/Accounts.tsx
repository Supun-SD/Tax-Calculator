import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { MdAdd } from 'react-icons/md';
import { DataTable, Column } from '../../components/DataTable';
import React, { useState } from 'react';
import { Account } from '../../../types/account';
import AccountModal from './components/AccountModal';
import ViewAccountModal from './components/ViewAccountModal';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { useAccounts } from '../../hooks/useAccounts';
import { ClipLoader } from 'react-spinners';

const Accounts = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const {
    accounts,
    loading,
    isDeleting,
    createAccount,
    updateAccount,
    deleteAccount
  } = useAccounts();

  const columns: Column<Account>[] = [
    {
      key: 'id',
      header: 'ID',
      width: 'w-1/6',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      width: 'w-2/5',
      sortable: true,
      searchable: true,
    },
    {
      key: 'tinNumber',
      header: 'TIN Number',
      width: 'w-1/6',
      sortable: true,
      searchable: true,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddButtonClick = () => {
    setModalMode('add');
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setModalMode('edit');
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleView = (account: Account) => {
    setViewingAccount(account);
    setIsViewModalOpen(true);
  };

  const handleDelete = (account: Account) => {
    setDeletingAccount(account);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingAccount) {
      const success = await deleteAccount(deletingAccount.id);
      if (success) {
        setDeletingAccount(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletingAccount(null);
  };

  return (
    <div className="p-8">
      <Navigation title="Accounts" />

      {/* Search and Add Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by name or TIN number"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddButtonClick}
            variant="primary"
            icon={MdAdd}
            iconPosition="left"
          >
            Add Account
          </Button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <div className="flex items-center space-x-3">
              <ClipLoader color="#60A5FA" size={32} />
              <span className="text-gray-300">Loading accounts...</span>
            </div>
          </div>
        ) : (
          <DataTable
            data={accounts}
            columns={columns}
            searchValue={searchValue}
            searchKeys={['name', 'tinNumber']}
            showActions={true}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onCreateAccount={createAccount}
        onUpdateAccount={updateAccount}
        account={selectedAccount}
      />
      <ViewAccountModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        account={viewingAccount}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingAccount}>
        <AlertDialog.Content className="bg-surface-2 border border-white/20 rounded-xl">
          <AlertDialog.Title className="text-white text-lg font-semibold">
            Delete Account
          </AlertDialog.Title>
          <AlertDialog.Description size="3" className="text-gray-300 mt-2">
            Are you sure you want to delete the account "{deletingAccount?.name}"?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button
                variant="secondary"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                size="sm"
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {isDeleting ? (
              <div className="flex items-center justify-center px-6 py-2">
                <ClipLoader color="#EF4444" size={20} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="danger"
                  onClick={handleConfirmDelete}
                  size="sm"
                >
                  Delete Account
                </Button>
              </AlertDialog.Action>
            )}
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Accounts;
