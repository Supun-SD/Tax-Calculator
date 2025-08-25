import React, { useState, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import Modal from '../../../../components/Modal';
import SearchBar from '../../../../components/SearchBar';
import { Account } from '../../../../../types/account';
import { FiCalendar } from 'react-icons/fi';
import { useAccounts } from '../../../../hooks/useAccounts';
import { ClipLoader } from 'react-spinners';

interface SelectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account, startDate: string, endDate: string) => void;
}

const SelectAccountModal: React.FC<SelectAccountModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { accounts, loading } = useAccounts();

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    return Array.from({ length: 10 }, (_, index) => String(startYear + index));
  }, []);

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.tinNumber.toString().includes(searchTerm)
    );
  }, [accounts, searchTerm]);

  const handleSelect = () => {
    if (selectedAccount) {
      onSelect(selectedAccount, startDate, endDate);
      onClose();
      setSelectedAccount(null);
      setSearchTerm('');
    }
  };

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setSearchTerm('');
  };

  const handleCancel = () => {
    onClose();
    setSelectedAccount(null);
    setSearchTerm('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedAccount(null);
      }}
      title="Select account"
      maxWidth="600px"
      actions={[
        {
          label: 'Cancel',
          onClick: () => {
            handleCancel();
            setSelectedAccount(null);
          },
          variant: 'secondary',
          className: 'bg-gray-300 text-black hover:bg-gray-400',
        },
        {
          label: 'Select',
          onClick: handleSelect,
          variant: 'primary',
          disabled: !selectedAccount || !startDate || !endDate,
        },
      ]}
    >
      <Flex direction="column" gap="6">
        {/* Search Bar with Overlay */}
        <div className="relative">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or TIN number"
            className="bg-white"
            inputTextColor="black"
          />

          {/* Account List Overlay */}
          {searchTerm && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
              {loading ? (
                <div className="flex items-center justify-center p-10">
                  <div className="flex items-center gap-2">
                    <ClipLoader color="gray" size={20} />
                    <Text size="3" className="text-gray-500">Loading accounts...</Text>
                  </div>
                </div>
              ) : filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={`cursor-pointer border-b border-gray-200 p-3 last:border-b-0 hover:bg-gray-100 ${selectedAccount?.id === account.id ? 'bg-blue-100' : ''
                      }`}
                    onClick={() => handleAccountClick(account)}
                  >
                    <Flex justify="between" className="text-black">
                      <Text size="3">{account.name}</Text>
                      <Text size="3">{account.tinNumber}</Text>
                    </Flex>
                  </div>
                ))
              ) : (
                <div className="p-5 text-gray-500">
                  <Text size="3">No accounts found</Text>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-2 gap-3 text-black">
          <div className="flex flex-col bg-white rounded-lg px-6 py-4">
            <Text size="3" className="font-medium">
              Name
            </Text>
            <Text size="3">{selectedAccount ? selectedAccount.name : '-'}</Text>
          </div>
          <div className="flex flex-col bg-white rounded-lg px-6 py-4">
            <Text size="3" className="font-medium">
              TIN Number
            </Text>
            <Text size="3">
              {selectedAccount ? selectedAccount.tinNumber : '-'}
            </Text>
          </div>
        </div>

        {/* Year of Assessment */}
        <Flex direction="column" gap="3">
          <Text size="3" className="font-medium text-black">
            Year of assessment
          </Text>
          <Flex gap="3">
            <div className="relative flex-1">
              <select
                value={startDate}
                onChange={(e) => {
                  const selectedYear = e.target.value;
                  setStartDate(selectedYear);
                  if (selectedYear) {
                    const nextYear = String(parseInt(selectedYear) + 1);
                    setEndDate(nextYear);
                  }
                }}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-black"
              >
                <option value="" disabled>
                  Select year
                </option>
                {years.map((year) => (
                  <option key={`start-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
            <div className="relative flex-1">
              <select
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-black"
              >
                <option value="" disabled>
                  Select year
                </option>
                {years.map((year) => (
                  <option key={`end-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default SelectAccountModal;
