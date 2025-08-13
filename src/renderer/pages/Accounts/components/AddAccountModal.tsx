import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import { TextField } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
import { Account } from '../../../../types/account';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (account: Omit<Account, 'id'>) => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
    isOpen,
    onClose,
    onAdd
}) => {
    const [formData, setFormData] = useState({
        name: '',
        tinNumber: ''
    });

    const handleInputChange = (field: 'name' | 'tinNumber', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAdd = () => {
        if (formData.name.trim() && formData.tinNumber.trim()) {
            onAdd({
                name: formData.name.trim(),
                tinNumber: parseInt(formData.tinNumber.trim())
            });

            console.log({
                name: formData.name.trim(),
                tinNumber: parseInt(formData.tinNumber.trim())
            });

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
            title="Add new account"
            showCloseButton={false}
            actions={[
                {
                    label: 'Cancel',
                    onClick: handleCancel,
                    variant: 'secondary'
                },
                {
                    label: 'Add',
                    onClick: handleAdd,
                    variant: 'primary',
                    disabled: !isFormValid
                }
            ]}
        >
            <div className="space-y-4">
                <div>
                    <Text as="div" size="3" mb="1">
                        Full name
                    </Text >
                    <div className='bg-white rounded-xl'>
                        <TextField.Root
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            size="3"
                            className='ring-0 rounded-xl bg-white h-12 px-1 focus:ring-0 focus:outline-none [&:focus-within]:ring-0 [&:focus-within]:outline-none [&>input]:focus:ring-0 [&>input]:focus:outline-none'
                        />
                    </div>
                </div>
                <div>
                    <Text as="div" size="3" mb="1">
                        TIN number
                    </Text>
                    <div className='bg-white rounded-xl'>
                        <TextField.Root
                            value={formData.tinNumber}
                            onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                            size="3"
                            className='ring-0 rounded-xl bg-white h-12 px-1 focus:ring-0 focus:outline-none [&:focus-within]:ring-0 [&:focus-within]:outline-none [&>input]:focus:ring-0 [&>input]:focus:outline-none'
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddAccountModal;
