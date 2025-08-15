import React, { useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd, IoClose } from "react-icons/io5";
import Button from '../../../components/Button';

interface BusinessProps {
    isOpen: boolean;
    onClose: () => void;
}

interface BusinessEntry {
    id: number;
    hospital: string;
    amount: number;
}

const Business: React.FC<BusinessProps> = ({ isOpen, onClose }) => {
    const [businessEntries, setBusinessEntries] = useState<BusinessEntry[]>([
        {
            id: 1,
            hospital: "",
            amount: 0
        }
    ]);

    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [taxablePercentage, setTaxablePercentage] = useState<number>(35);

    useEffect(() => {
        const total = businessEntries.reduce((sum, entry) => sum + entry.amount, 0);
        setTotalIncome(total);
    }, [businessEntries]);

    const handleHospitalChange = (id: number, value: string) => {
        setBusinessEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, hospital: value } : entry
        ));
    };

    const handleAmountChange = (id: number, value: string) => {
        // Allow empty string
        if (value === '') {
            setBusinessEntries(prev => prev.map(entry =>
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
            setBusinessEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, amount: cleanValue as unknown as number } : entry
            ));
            return;
        }

        // Parse when it's a complete number
        const numValue = parseFloat(cleanValue);
        if (isNaN(numValue)) return;

        const roundedValue = Math.round(numValue * 100) / 100;

        setBusinessEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, amount: roundedValue } : entry
        ));
    };

    const handleTaxablePercentageChange = (value: string) => {
        // Allow empty string
        if (value === '') {
            setTaxablePercentage(0);
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
            setTaxablePercentage(cleanValue as unknown as number);
            return;
        }

        // Parse when it's a complete number
        const numValue = parseFloat(cleanValue);
        if (isNaN(numValue)) return;

        const roundedValue = Math.round(numValue * 100) / 100;
        setTaxablePercentage(roundedValue);
    };

    const addNewEntry = () => {
        const newId = Math.max(...businessEntries.map(entry => entry.id)) + 1;
        const newEntry: BusinessEntry = {
            id: newId,
            hospital: "",
            amount: 0
        };
        setBusinessEntries(prev => [...prev, newEntry]);
    };

    const removeEntry = (id: number) => {
        if (businessEntries.length > 1) {
            setBusinessEntries(prev => prev.filter(entry => entry.id !== id));
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
            title="Business Income"
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
                    {businessEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-4">
                            {/* Hospital Input */}
                            <div className="bg-white rounded-lg border border-gray-300 flex-1">
                                <input
                                    type="text"
                                    value={entry.hospital}
                                    onChange={(e) => handleHospitalChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                    placeholder="Hospital Name"
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
                            {businessEntries.length > 1 && (
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

                {/* Total Section */}
                <div className="flex justify-between items-center">
                    <div className="text-gray-700 font-medium">Total</div>
                    <div className="bg-white rounded-lg px-6 py-3">
                        <div className="text-xl font-bold text-gray-800">
                            {formatCurrency(totalIncome)}
                        </div>
                    </div>
                </div>

                {/* Percentage for Taxable Income */}
                <div className="flex justify-between items-center">
                    <div className="text-gray-700 font-medium">Percentage for taxable income</div>
                    <div className="bg-white rounded-lg border border-gray-300 px-4 py-2">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={taxablePercentage === 0 ? "" : taxablePercentage.toString()}
                                onChange={(e) => handleTaxablePercentageChange(e.target.value)}
                                className="w-20 bg-transparent text-gray-800 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                            />
                            <span className="text-gray-600 ml-1">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Business;
