import Navigation from '../../components/Navigation';
import Button from '../../components/Button';
import { IoIosAdd } from "react-icons/io";
import { DataTable, Column } from '../../components/DataTable';
import { banks as mockBanks } from '../../../../mockdata/banks';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { Bank } from '../../../types/bank';


const Banks = () => {
    const banks: Array<Bank> = mockBanks;
    const [searchValue, setSearchValue] = useState("");

    const columns: Column<Bank>[] = [
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleEdit = (bank: Bank) => {
        console.log('Edit bank:', bank.id);
        // TODO: Implement edit functionality
    };

    const handleView = (bank: Bank) => {
        console.log('View bank:', bank.id);
        // TODO: Implement view functionality
    };

    const handleDelete = (bank: Bank) => {
        console.log('Delete bank:', bank.id);
        // TODO: Implement delete functionality
    };

    const handleRowClick = (bank: Bank) => {
        console.log('Row clicked:', bank.name);
        // TODO: Navigate to bank details or open modal
    };

    return (
        <div className="p-8">
            <Navigation title="Banks" />

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
                data={banks}
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

export default Banks;