import Navigation from '../../components/Navigation';
import Button from '../../components/Button';
import { IoIosAdd } from 'react-icons/io';
import { DataTable, Column } from '../../components/DataTable';
import { banks as mockBanks } from '../../../../mockdata/banks';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { Bank } from '../../../types/bank';
import BankModal from './components/BankModal';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { useToast } from '../../hooks/useToast';

const Banks = () => {
  const [banks, setBanks] = useState<Array<Bank>>(mockBanks);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>(undefined);
  const [deletingBank, setDeletingBank] = useState<Bank | undefined>(undefined);
  const { showSuccess, showError } = useToast();

  const columns: Column<Bank>[] = [
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
    setSelectedBank(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (bank: Bank) => {
    setModalMode('edit');
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleDelete = (bank: Bank) => {
    setDeletingBank(bank);
  };

  const handleAddBank = (bankData: Omit<Bank, 'id'>) => {
    const newBank: Bank = {
      id: Math.max(...banks.map(b => b.id), 0) + 1,
      ...bankData
    };
    setBanks(prev => [...prev, newBank]);
    setIsModalOpen(false);
  };

  const handleEditBank = (updatedBank: Bank) => {
    setBanks(prev => prev.map(bank =>
      bank.id === updatedBank.id ? updatedBank : bank
    ));
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBank(undefined);
  };

  const handleConfirmDelete = () => {
    if (deletingBank) {
      setBanks(prev => prev.filter(bank => bank.id !== deletingBank.id));
      showSuccess('Bank deleted successfully');
      setDeletingBank(undefined);
    }
  };

  const handleCancelDelete = () => {
    setDeletingBank(undefined);
  };

  return (
    <div className="p-8">
      <Navigation title="Banks" />

      <div className="mb-5 flex items-center justify-between gap-96">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name or TIN number"
          className="my-4"
        />
        <Button icon={IoIosAdd} size="md" className="px-10" onClick={handleAddButtonClick}>
          Add
        </Button>
      </div>

      <DataTable
        data={banks}
        columns={columns}
        searchValue={searchValue}
        searchKeys={['name', 'tinNumber']}
        showActions={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BankModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onAdd={handleAddBank}
        onEdit={handleEditBank}
        bank={selectedBank}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingBank} onOpenChange={() => setDeletingBank(undefined)}>
        <AlertDialog.Content className='bg-popup-bg'>
          <AlertDialog.Title>Delete Bank</AlertDialog.Title>
          <AlertDialog.Description size="3">
            Are you sure you want to delete the bank "{deletingBank?.name}"?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end">
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
                Delete Bank
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Banks;
