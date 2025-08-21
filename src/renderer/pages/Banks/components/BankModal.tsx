import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { TextField, Text } from '@radix-ui/themes';
import { Bank } from '../../../../types/bank';
import { BankUpdateReq } from '../../../../types/BankUpdateReq';
import { BankCreateReq } from '../../../../types/BankCreateReq';

type ModalMode = 'add' | 'edit';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  onCreateBank: (bank: BankCreateReq) => Promise<Bank | null>;
  onUpdateBank: (id: number, bank: BankUpdateReq) => Promise<Bank | null>;
  bank?: Bank;
}

const BankModal: React.FC<BankModalProps> = ({
  isOpen,
  onClose,
  mode,
  onCreateBank,
  onUpdateBank,
  bank,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    tinNumber: '',
  });
  const [loading, setLoading] = useState(false);

  // Update form data when bank prop changes (for edit mode)
  useEffect(() => {
    if (bank) {
      setFormData({
        name: bank.name,
        tinNumber: bank.tinNumber.toString(),
      });
    } else {
      setFormData({ name: '', tinNumber: '' });
    }
  }, [bank]);

  const handleInputChange = (field: 'name' | 'tinNumber', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (mode === 'edit' && bank) {
      // Edit mode
      const newBankData: BankUpdateReq = {
        name: formData.name.trim(),
        tinNumber: formData.tinNumber.trim(),
      }
      const result = await onUpdateBank(bank.id, newBankData);
      if (result) {
        setFormData({ name: '', tinNumber: '' });
        onClose();
      }
    } else if (mode === 'add') {
      // Add mode
      const newBankData: BankCreateReq = {
        name: formData.name.trim(),
        tinNumber: formData.tinNumber.trim(),
      }
      const result = await onCreateBank(newBankData);
      if (result) {
        setFormData({ name: '', tinNumber: '' });
        onClose();
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', tinNumber: '' });
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.tinNumber.trim();

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add new bank';
      case 'edit':
        return 'Edit bank';
      default:
        return 'Bank';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      actions={getActions()}
      maxWidth="450px"
      loading={loading}
    >
      <div className="space-y-4">
        <div>
          <Text as="div" size="3" mb="1">
            Bank name
          </Text>
          <div className="rounded-xl bg-white">
            <TextField.Root
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              size="3"
              placeholder="Enter bank name"
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

export default BankModal;
