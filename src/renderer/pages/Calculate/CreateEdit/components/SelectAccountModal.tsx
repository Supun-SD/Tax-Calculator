import React, { useState, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import Modal from '../../../../components/Modal';
import { Account } from '../../../../../types/account';
import { FiCalendar } from 'react-icons/fi';
import { MdAccountCircle, MdSearch, MdDescription } from "react-icons/md";
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
      title={
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <MdAccountCircle className="text-blue-300 text-lg" />
          </div>
          <Text className="text-white text-xl font-semibold">Select Account</Text>
        </div>
      }
      maxWidth="600px"
      isDark={true}
      actions={[
        {
          label: 'Cancel',
          onClick: () => {
            handleCancel();
            setSelectedAccount(null);
          },
          variant: 'secondary',
          className: 'bg-gray-600 hover:bg-gray-700 text-white',
        },
        {
          label: 'Select',
          onClick: handleSelect,
          variant: 'primary',
          disabled: !selectedAccount || !startDate || !endDate,
          className: !selectedAccount || !startDate || !endDate ? 'opacity-50 cursor-not-allowed' : '',
        },
      ]}
    >
      <Flex direction="column" gap="6">
        {/* Search Bar with Overlay */}
        <div className="relative">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or TIN number"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Account List Overlay */}
          {searchTerm && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-white/20 bg-surface-2 shadow-2xl">
              {loading ? (
                <div className="flex items-center justify-center p-10">
                  <div className="flex items-center gap-2">
                    <ClipLoader color="#60A5FA" size={20} />
                    <Text size="3" className="text-gray-300">Loading accounts...</Text>
                  </div>
                </div>
              ) : filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={`cursor-pointer border-b border-white/10 p-3 last:border-b-0 hover:bg-white/5 transition-colors ${selectedAccount?.id === account.id ? 'bg-blue-400/20' : ''
                      }`}
                    onClick={() => handleAccountClick(account)}
                  >
                    <Flex justify="between" className="text-white">
                      <Text size="3">{account.name}</Text>
                      <Text size="3" className="text-gray-300">{account.tinNumber}</Text>
                    </Flex>
                  </div>
                ))
              ) : (
                <div className="p-5 text-gray-300">
                  <Text size="3">No accounts found</Text>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col bg-white/5 rounded-lg px-6 py-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <MdDescription className="text-blue-300" size={16} />
              <Text size="3" className="font-medium text-gray-300">
                Name
              </Text>
            </div>
            <Text size="3" className="text-white">{selectedAccount ? selectedAccount.name : '-'}</Text>
          </div>
          <div className="flex flex-col bg-white/5 rounded-lg px-6 py-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <MdAccountCircle className="text-blue-300" size={16} />
              <Text size="3" className="font-medium text-gray-300">
                TIN Number
              </Text>
            </div>
            <Text size="3" className="text-white">
              {selectedAccount ? selectedAccount.tinNumber : '-'}
            </Text>
          </div>
        </div>

        {/* Year of Assessment */}
        <Flex direction="column" gap="3">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-blue-300" size={16} />
            <Text size="3" className="font-medium text-white">
              Year of assessment
            </Text>
          </div>
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
                className="w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="" disabled className="bg-surface-2 text-white">
                  Select year
                </option>
                {years.map((year) => (
                  <option key={`start-${year}`} value={year} className="bg-surface-2 text-white">
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
                className="w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="" disabled className="bg-surface-2 text-white">
                  Select year
                </option>
                {years.map((year) => (
                  <option key={`end-${year}`} value={year} className="bg-surface-2 text-white">
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
