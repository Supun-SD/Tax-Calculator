import React, { useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd, IoClose } from "react-icons/io5";
import Button from '../../../components/Button';

interface OtherProps {
    isOpen: boolean;
    onClose: () => void;
}

interface OtherEntry {
    id: number;
    description: string;
    amount: number;
}

const Other: React.FC<OtherProps> = ({ isOpen, onClose }) => {
    const [otherEntries, setOtherEntries] = useState<OtherEntry[]>([
        {
            id: 1,
            description: "",
            amount: 0
        }
    ]);

    const [totalIncome, setTotalIncome] = useState<number>(0);

    useEffect(() => {
        const total = otherEntries.reduce((sum, entry) => sum + entry.amount, 0);
        setTotalIncome(total);
    }, [otherEntries]);

    const handleDescriptionChange = (id: number, value: string) => {
        setOtherEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, description: value } : entry
        ));
    };

    const handleAmountChange = (id: number, value: string) => {
        // Allow empty string
        if (value === '') {
            setOtherEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, amount: 0 } : entry
            ));
            return;
        }

        // Only allow numbers and decimal point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanValue.split('.');
        if (parts.length > 2) return;

        // Limit decimal places to 2
        if (parts[1] && parts[1].length > 2) return;

        // If ends with '.' → keep as is (don't parse yet)
        if (cleanValue.endsWith('.')) {
            setOtherEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, amount: cleanValue as unknown as number } : entry
            ));
            return;
        }

        // Parse when it's a complete number
        const numValue = parseFloat(cleanValue);
        if (isNaN(numValue)) return;

        const roundedValue = Math.round(numValue * 100) / 100;

        setOtherEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, amount: roundedValue } : entry
        ));
    };

    const addNewEntry = () => {
        const newId = Math.max(...otherEntries.map(entry => entry.id)) + 1;
        const newEntry: OtherEntry = {
            id: newId,
            description: "",
            amount: 0
        };
        setOtherEntries(prev => [...prev, newEntry]);
    };

    const removeEntry = (id: number) => {
        if (otherEntries.length > 1) {
            setOtherEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const handleDone = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Other Income"
            maxWidth="600px"
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'secondary',
                    className: 'bg-gray-300 text-black hover:bg-gray-400',
                },
                {
                    label: 'Done',
                    onClick: handleDone,
                    variant: 'primary',
                },
            ]}
        >
            <div className="space-y-6">
                {/* Income Entries */}
                <div className="space-y-4">
                    {otherEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-4">
                            {/* Description Input */}
                            <div className="bg-white rounded-lg border border-gray-300 flex-1">
                                <input
                                    type="text"
                                    value={entry.description}
                                    onChange={(e) => handleDescriptionChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                    placeholder="Income type"
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="bg-white rounded-lg border border-gray-300 flex-1">
                                <input
                                    type="text"
                                    value={entry.amount === 0 ? "" : entry.amount.toString()}
                                    onChange={(e) => handleAmountChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Remove Button (only show if more than 1 entry) */}
                            {otherEntries.length > 1 && (
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    className="text-gray-600 hover:text-gray-800 p-1"
                                >
                                    <IoClose size={16} color='red' />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size='sm' className='px-6'>
                        Add
                    </Button>
                </div>

                {/* Total Display */}
                <div className="flex justify-end">
                    <div className="bg-white rounded-lg px-6 py-3">
                        <div className="text-xl font-bold text-gray-800">
                            {formatCurrency(totalIncome)}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Other;
