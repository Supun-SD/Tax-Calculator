import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { IoIosAdd } from 'react-icons/io';
import { accounts as mockAccounts } from '../../../../mockdata/accounts';
import { DataTable, Column } from '../../components/DataTable';
import React, { useState } from 'react';
import { Account } from '../../../types/account';
import AddAccountModal from './components/AddAccountModal';

const Accounts = () => {
    const accounts: Array<Account> = mockAccounts;
    const [searchValue, setSearchValue] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        // TODO: Implement edit functionality
        // Placeholder for edit functionality
    };

    const handleView = (account: Account) => {
        // TODO: Implement view functionality
        // Placeholder for view functionality
    };

    const handleDelete = (account: Account) => {
        // TODO: Implement delete functionality
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleAddAccount = (newAccount: Omit<Account, 'id'>) => {
        // TODO: Implement actual add functionality
        // For now, just log the new account
        console.log('Adding new account:', newAccount);

        // In a real app, you would:
        // 1. Call API to save the account
        // 2. Update the local state
        // 3. Show success message
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
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add
                </Button>
            </div>

            <DataTable
                data={accounts}
                columns={columns}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchKeys={['name', 'tinNumber']}
                showActions={true}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
            />

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAccount}
            />
        </div>
    );
};

export default Accounts;
