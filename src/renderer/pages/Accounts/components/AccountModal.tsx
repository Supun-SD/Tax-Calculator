import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { TextField } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
import { Account } from '../../../../types/account';
import { useToast } from '../../../hooks/useToast';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (account: Omit<Account, 'id'>) => void;
  onEdit?: (account: Account) => void;
  account?: Account;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  account,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    tinNumber: '',
  });
  const { showSuccess, showError } = useToast();

  // Check if we're in edit mode
  const isEditMode = !!account;

  // Update form data when account prop changes (for edit mode)
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        tinNumber: account.tinNumber.toString(),
      });
    } else {
      setFormData({ name: '', tinNumber: '' });
    }
  }, [account]);

  const handleInputChange = (field: 'name' | 'tinNumber', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (formData.name.trim() && formData.tinNumber.trim()) {
      if (isEditMode && onEdit && account) {
        // Edit mode
        onEdit({
          ...account,
          name: formData.name.trim(),
          tinNumber: parseInt(formData.tinNumber.trim()),
        });
        showSuccess('Account updated successfully');
      } else {
        // Add mode
        onAdd({
          name: formData.name.trim(),
          tinNumber: parseInt(formData.tinNumber.trim()),
        });
        showSuccess('Account added successfully');
      }

      // Reset form and close modal
      setFormData({ name: '', tinNumber: '' });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', tinNumber: '' });
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.tinNumber.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit account' : 'Add new account'}
      actions={[
        {
          label: 'Cancel',
          onClick: handleCancel,
          variant: 'secondary',
          className: '!px-10 rounded-2xl',
        },
        {
          label: isEditMode ? 'Update' : 'Add',
          onClick: handleSubmit,
          variant: 'primary',
          disabled: !isFormValid,
          className: '!px-10 rounded-2xl',
        },
      ]}
    >
      <div className="space-y-4">
        <div>
          <Text as="div" size="3" mb="1">
            Full name
          </Text>
          <div className="rounded-xl bg-white">
            <TextField.Root
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              size="3"
              className="h-12 rounded-xl bg-white px-1 ring-0 focus:outline-none focus:ring-0 [&:focus-within]:outline-none [&:focus-within]:ring-0 [&>input]:focus:outline-none [&>input]:focus:ring-0"
            />
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
              className="h-12 rounded-xl bg-white px-1 ring-0 focus:outline-none focus:ring-0 [&:focus-within]:outline-none [&:focus-within]:ring-0 [&>input]:focus:outline-none [&>input]:focus:ring-0"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountModal;
