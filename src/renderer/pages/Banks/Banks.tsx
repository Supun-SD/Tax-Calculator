import Navigation from '../../components/Navigation';
import Button from '../../components/Button';
import { DataTable, Column } from '../../components/DataTable';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { Bank } from '../../../types/bank';
import BankModal from './components/BankModal';
import { AlertDialog, Flex, Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import { useBanks } from '../../hooks/useBanks';
import { MdAdd } from 'react-icons/md';

const Banks = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>(undefined);
  const [deletingBank, setDeletingBank] = useState<Bank | undefined>(undefined);

  const {
    banks,
    loading,
    isDeleting,
    createBank,
    updateBank,
    deleteBank
  } = useBanks();

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBank(undefined);
  };

  const handleConfirmDelete = async () => {
    if (deletingBank) {
      const success = await deleteBank(deletingBank.id);
      if (success) {
        setDeletingBank(undefined);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletingBank(undefined);
  };

  return (
    <div className="p-8">
      <Navigation title="Banks" />

      {/* Search and Add section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by name or TIN number"
            />
          </div>
          <Button
            onClick={handleAddButtonClick}
            variant="primary"
            icon={MdAdd}
            iconPosition="left"
          >
            Add Bank
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <ClipLoader color="#3B82F6" />
          </div>
        ) : (
          <DataTable
            data={banks}
            columns={columns}
            searchValue={searchValue}
            searchKeys={['name', 'tinNumber']}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <BankModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onCreateBank={createBank}
        onUpdateBank={updateBank}
        bank={selectedBank}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingBank}>
        <AlertDialog.Content className="bg-surface-2 border border-white/20 rounded-xl">
          <AlertDialog.Title className="text-white">Delete Bank</AlertDialog.Title>
          <AlertDialog.Description size="3" className="text-gray-300">
            Are you sure you want to delete the bank "{deletingBank?.name}"?
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
              <div className="flex items-center justify-center px-4 py-2">
                <ClipLoader color="#EF4444" size={20} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="danger"
                  onClick={handleConfirmDelete}
                  size="sm"
                >
                  Delete Bank
                </Button>
              </AlertDialog.Action>
            )}
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Banks;
