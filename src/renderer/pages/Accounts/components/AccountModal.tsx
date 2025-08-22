import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { TextField, Select } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
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

  // Update form data when account prop changes (for edit mode)
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
      // Edit mode
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
      // Add mode
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
        className: '!px-10 rounded-2xl',
      },
      {
        label: mode === 'edit' ? 'Update' : 'Add',
        onClick: handleSubmit,
        variant: 'primary' as const,
        disabled: !isFormValid,
        className: '!px-10 rounded-2xl',
      },
    ];
  };

  const titles = ['Capt', 'Cm', 'Dr', 'Major', 'Miss', 'Mr', 'Mrs', 'Ms', 'Prof', 'Rev', 'Sec', 'The Hon']

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      actions={getActions()}
      maxWidth="500px"
      loading={loading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          <div className="col-span-2">
            <Text as="div" size="3" mb="1">
              Title
            </Text>
            <div className="rounded-xl bg-white">
              <Select.Root
                value={formData.title}
                onValueChange={(value) => handleInputChange('title', value)}
                size="3"
              >
                <Select.Trigger
                  placeholder="select title"
                  className="rounded-xl bg-white px-3 h-12 ring-0 focus:outline-none focus:ring-0 [&:focus-within]:outline-none [&:focus-within]:ring-0 flex justify-between items-center"
                />
                <Select.Content>
                  {titles.map((title) => (
                    <Select.Item key={title} value={title}>
                      {title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <div className="col-span-5">
            <Text as="div" size="3" mb="1">
              Full name
            </Text>
            <div className="rounded-xl bg-white">
              <TextField.Root
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                size="3"
                placeholder="Enter full name"
                className="h-12 rounded-xl bg-white px-1 ring-0 focus:outline-none focus:ring-0 [&:focus-within]:outline-none [&:focus-within]:ring-0 [&>input]:focus:outline-none [&>input]:focus:ring-0"
              />
            </div>
          </div>
        </div>
        <div>
          <Text as="div" size="3" mb="1">
            TIN number
          </Text>
          <div className="rounded-xl bg-white">
            <TextField.Root
              value={formData.tinNumber}
              onChange={(e) => handleInputChange('tinNumber', e.target.value)}
              size="3"
              placeholder="Enter TIN number"
              type="number"
              className="h-12 rounded-xl bg-white px-1 ring-0 focus:outline-none focus:ring-0 [&:focus-within]:outline-none [&:focus-within]:ring-0 [&>input]:focus:outline-none [&>input]:focus:ring-0"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountModal;
