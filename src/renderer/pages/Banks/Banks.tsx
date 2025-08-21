import Navigation from '../../components/Navigation';
import Button from '../../components/Button';
import { IoIosAdd } from 'react-icons/io';
import { DataTable, Column } from '../../components/DataTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { Bank } from '../../../types/bank';
import BankModal from './components/BankModal';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { useToast } from '../../hooks/useToast';
import { ClipLoader } from 'react-spinners';
import { bankService } from '../../services/bankService';

const Banks = () => {
  const [banks, setBanks] = useState<Array<Bank>>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>(undefined);
  const [deletingBank, setDeletingBank] = useState<Bank | undefined>(undefined);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const banks: Bank[] = await bankService.getAllBanks();
        setBanks(banks);
      } catch (error) {
        showError('Error loading banks');
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

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

  const handleAddBank = (newBank: Bank) => {
    setBanks((prev) => [newBank, ...prev]);
  };

  const handleEditBank = (updatedBank: Bank) => {
    setBanks((prev) =>
      prev.map((bank) => (bank.id === updatedBank.id ? updatedBank : bank))
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBank(undefined);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    if (deletingBank) {
      try {
        await bankService.deleteBank(deletingBank.id);
        setBanks((prev) => prev.filter((bank) => bank.id !== deletingBank.id));
        showSuccess('Bank deleted successfully');
        setDeletingBank(undefined);
      } catch (error) {
        showError('Error deleting bank');
      } finally {
        setIsDeleting(false);
      }
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
          data={banks}
          columns={columns}
          searchValue={searchValue}
          searchKeys={['name', 'tinNumber']}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <BankModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onAdd={handleAddBank}
        onEdit={handleEditBank}
        bank={selectedBank}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingBank}>
        <AlertDialog.Content className="bg-popup-bg">
          <AlertDialog.Title>Delete Bank</AlertDialog.Title>
          <AlertDialog.Description size="3">
            Are you sure you want to delete the bank "{deletingBank?.name}
            "?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button variant="secondary" onClick={handleCancelDelete} disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {isDeleting ? (
              <div className="flex items-center justify-center px-14">
                <ClipLoader color="gray" size={28} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  onClick={handleConfirmDelete}
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
