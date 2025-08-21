import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { IoIosAdd } from 'react-icons/io';
import { DataTable, Column } from '../../components/DataTable';
import React, { useState } from 'react';
import { Account } from '../../../types/account';
import AccountModal from './components/AccountModal';
import ViewAccountModal from './components/ViewAccountModal';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { useToast } from '../../hooks/useToast';
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

      <div className="mb-5 flex items-center justify-between gap-96">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name or TIN number"
          className="my-4"
        />
        <Button
          icon={IoIosAdd}
          size="md"
          className="px-10"
          onClick={handleAddButtonClick}
        >
          Add
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <ClipLoader color="white" />
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
        <AlertDialog.Content className="bg-popup-bg">
          <AlertDialog.Title>Delete Account</AlertDialog.Title>
          <AlertDialog.Description size="3">
            Are you sure you want to delete the account "{deletingAccount?.name}"?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button variant="secondary" onClick={handleCancelDelete} disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {isDeleting ? (
              <div className="flex items-center justify-center px-14 mx-3">
                <ClipLoader color="gray" size={28} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  onClick={handleConfirmDelete}
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
