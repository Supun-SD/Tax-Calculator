import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { IoIosAdd } from "react-icons/io";
import { accounts as mockAccounts } from '../../../../mockdata/accounts';
import { DataTable, Column } from '../../components/DataTable';
import React, { useState } from 'react';
import { Account } from '../../../types/account';

const Accounts = () => {
    const accounts: Array<Account> = mockAccounts;
    const [searchValue, setSearchValue] = useState("");

    const columns: Column<Account>[] = [
        {
            key: 'id',
            header: 'ID',
            width: 'w-1/6',
            sortable: true
        },
        {
            key: 'name',
            header: 'Name',
            width: 'w-2/5',
            sortable: true,
            searchable: true
        },
        {
            key: 'tinNumber',
            header: 'TIN Number',
            width: 'w-1/6',
            sortable: true,
            searchable: true
        }
    ];

    const handleEdit = (account: Account) => {
        console.log('Edit account:', account.id);
        // TODO: Implement edit functionality
    };

    const handleView = (account: Account) => {
        console.log('View account:', account.id);
        // TODO: Implement view functionality
    };

    const handleDelete = (account: Account) => {
        console.log('Delete account:', account.id);
        // TODO: Implement delete functionality
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className="p-8">
            <Navigation title="Accounts" />

            <div className='flex justify-between items-center gap-96 mb-5'>
                <SearchBar
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search by name or TIN number"
                    className="my-4"
                />
                <Button icon={IoIosAdd} size='md' className='px-10'>Add</Button>
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
        </div>
    );
};

export default Accounts;