import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { Text } from '@radix-ui/themes';
import { Bank, BankCreateReq, BankUpdateReq } from '../../../../types/bank';
import { MdAccountBalance, MdBusiness, MdReceipt } from 'react-icons/md';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <MdAccountBalance className="text-blue-300 text-lg" />
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
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MdBusiness className="text-green-300 text-sm" />
            <Text as="div" size="3" className="text-gray-300 font-medium">
              Bank name
            </Text>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter bank name"
              className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 px-3"
            />
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

export default BankModal;
