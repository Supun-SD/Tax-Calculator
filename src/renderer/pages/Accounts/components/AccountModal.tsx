import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { Text, Select } from '@radix-ui/themes';
import { MdAccountCircle, MdPerson, MdReceipt } from 'react-icons/md';
import { Account, AccountCreateReq, AccountUpdateReq } from '../../../../types/account';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  onCreateAccount: (account: AccountCreateReq) => Promise<Account | null>;
  onUpdateAccount: (id: number, account: AccountUpdateReq) => Promise<Account | null>;
  account?: Account;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  mode,
  onCreateAccount,
  onUpdateAccount,
  account,

}) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    tinNumber: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title,
        name: account.name,
        tinNumber: account.tinNumber.toString(),
      });
    } else {
      setFormData({ title: '', name: '', tinNumber: '' });
    }
  }, [account]);

  const handleInputChange = (field: 'title' | 'name' | 'tinNumber', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (mode === 'edit' && account) {
      const newAccountData: AccountUpdateReq = {
        title: formData.title.trim(),
        name: formData.name.trim(),
        tinNumber: formData.tinNumber.trim(),
      }
      const result = await onUpdateAccount(account.id, newAccountData);
      if (result) {
        setFormData({ title: '', name: '', tinNumber: '' });
        onClose();
      }
    } else if (mode === 'add') {
      const newAccountData: AccountCreateReq = {
        title: formData.title.trim(),
        name: formData.name.trim(),
        tinNumber: formData.tinNumber.trim(),
      }
      const result = await onCreateAccount(newAccountData);
      if (result) {
        setFormData({ title: '', name: '', tinNumber: '' });
        onClose();
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({ title: '', name: '', tinNumber: '' });
    onClose();
  };

  const isFormValid = formData.title.trim() && formData.name.trim() && formData.tinNumber.trim();

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add new account';
      case 'edit':
        return 'Edit account';
      default:
        return 'Account';
    }
  };

  const getActions = () => {
    return [
      {
        label: 'Cancel',
        onClick: handleCancel,
        variant: 'secondary' as const,
        className: 'bg-gray-600 hover:bg-gray-700 text-white',
      },
      {
        label: mode === 'edit' ? 'Update' : 'Add',
        onClick: handleSubmit,
        variant: 'primary' as const,
        disabled: !isFormValid,
        className: isFormValid ? '' : 'opacity-50 cursor-not-allowed',
      },
    ];
  };

  const titles = ['Capt', 'Cm', 'Dr', 'Major', 'Miss', 'Mr', 'Mrs', 'Ms', 'Prof', 'Rev', 'Sec', 'The Hon']

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <MdAccountCircle className="text-blue-300 text-lg" />
          </div>
          <Text className="text-white text-xl font-semibold">{getTitle()}</Text>
        </div>
      }
      actions={getActions()}
      maxWidth="500px"
      loading={loading}
      isDark={true}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <MdPerson className="text-blue-300 text-sm" />
              <Text as="div" size="3" className="text-gray-300 font-medium">
                Title
              </Text>
            </div>
            <div className="relative">
              <Select.Root
                value={formData.title}
                onValueChange={(value) => handleInputChange('title', value)}
                size="3"
              >
                <Select.Trigger
                  className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
                <Select.Content className="bg-surface-2 border border-white/20 rounded-lg">
                  {titles.map((title) => (
                    <Select.Item key={title} value={title} className="text-white hover:bg-white/10">
                      {title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <div className="col-span-5">
            <div className="flex items-center space-x-2 mb-3">
              <MdPerson className="text-green-300 text-sm" />
              <Text as="div" size="3" className="text-gray-300 font-medium">
                Full name
              </Text>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 px-3"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MdReceipt className="text-purple-300 text-sm" />
            <Text as="div" size="3" className="text-gray-300 font-medium">
              TIN number
            </Text>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.tinNumber}
              onChange={(e) => handleInputChange('tinNumber', e.target.value)}
              placeholder="Enter TIN number"
              className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 px-3"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountModal;
