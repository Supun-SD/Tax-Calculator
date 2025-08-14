import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { IoIosAdd } from 'react-icons/io';
import { accounts as mockAccounts } from '../../../../mockdata/accounts';
import { DataTable, Column } from '../../components/DataTable';
import React, { useState } from 'react';
import { Account } from '../../../types/account';
import AccountModal from './components/AccountModal';
import ViewAccountModal from './components/ViewAccountModal';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { useToast } from '../../hooks/useToast';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Array<Account>>(mockAccounts);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(
    undefined
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingAccount, setViewingAccount] = useState<Account | undefined>(
    undefined
  );
  const [deletingAccount, setDeletingAccount] = useState<Account | undefined>(
    undefined
  );
  const { showSuccess, showError } = useToast();

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

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleView = (account: Account) => {
    setViewingAccount(account);
    setIsViewModalOpen(true);
  };

  const handleDelete = (account: Account) => {
    setDeletingAccount(account);
  };

  const handleConfirmDelete = () => {
    if (deletingAccount) {
      // TODO: Implement actual delete functionality
      // For now, just remove from local state
      setAccounts((prevAccounts) =>
        prevAccounts.filter((acc) => acc.id !== deletingAccount.id)
      );
      showSuccess('Account deleted successfully');
      console.log('Deleting account:', deletingAccount);

      // In a real app, you would:
      // 1. Call API to delete the account
      // 2. Show success message
      // 3. Handle errors appropriately
    }
    setDeletingAccount(undefined);
  };

  const handleCancelDelete = () => {
    setDeletingAccount(undefined);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddAccount = (newAccount: Omit<Account, 'id'>) => {
    // TODO: Implement actual add functionality
    // For now, just add to local state with a temporary ID
    const accountWithId: Account = {
      ...newAccount,
      id: Date.now(), // Temporary ID generation
    };
    setAccounts((prevAccounts) => [...prevAccounts, accountWithId]);
    console.log('Adding new account:', accountWithId);

    // In a real app, you would:
    // 1. Call API to save the account
    // 2. Update the local state with the response
    // 3. Show success message
  };

  const handleEditAccount = (updatedAccount: Account) => {
    // TODO: Implement actual edit functionality
    // For now, just update local state
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.id === updatedAccount.id ? updatedAccount : acc
      )
    );
    console.log('Updating account:', updatedAccount);

    // In a real app, you would:
    // 1. Call API to update the account
    // 2. Update the local state
    // 3. Show success message
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(undefined);
  };

  const handleAddButtonClick = () => {
    setEditingAccount(undefined);
    setIsModalOpen(true);
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

      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddAccount}
        onEdit={handleEditAccount}
        account={editingAccount}
      />
      <ViewAccountModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        account={viewingAccount}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root
        open={!!deletingAccount}
        onOpenChange={() => setDeletingAccount(undefined)}
      >
        <AlertDialog.Content maxWidth="450px" className="bg-popup-bg">
          <AlertDialog.Title>Delete Account</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete the account "{deletingAccount?.name}
            "? This action cannot be undone and all associated data will be
            permanently removed.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={handleConfirmDelete}
              >
                Delete Account
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Accounts;
