import React, { useState, useEffect } from 'react';
import { Text, Flex } from '@radix-ui/themes';
import Modal from "../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import Button from '../../../components/Button';

interface EmploymentProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IncomeEntry {
    id: number;
    name: string;
    amount: number;
    multiplier: number;
    product: number;
}

const Employment: React.FC<EmploymentProps> = ({ isOpen, onClose }) => {
    const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
        { id: 1, name: "", amount: 0, multiplier: 1, product: 0 }
    ]);
    const [totalIncome, setTotalIncome] = useState<number>(0);

    useEffect(() => {
        const total = incomeEntries.reduce((sum, entry) => sum + entry.product, 0);
        setTotalIncome(total);
    }, [incomeEntries]);

    const handleNameChange = (id: number, value: string) => {
        setIncomeEntries(prev => prev.map(entry => {
            if (entry.id === id) {
                return { ...entry, name: value }
            }
            return entry;
        }))
    }

    const handleAmountChange = (id: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        setIncomeEntries(prev => prev.map(entry => {
            if (entry.id === id) {
                const product = numValue * entry.multiplier;
                return { ...entry, amount: numValue, product };
            }
            return entry;
        }));
    };

    const handleMultiplierChange = (id: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        setIncomeEntries(prev => prev.map(entry => {
            if (entry.id === id) {
                const product = entry.amount * numValue;
                return { ...entry, multiplier: numValue, product };
            }
            return entry;
        }));
    };

    const addNewEntry = () => {
        const newId = Math.max(...incomeEntries.map(entry => entry.id)) + 1;
        const newEntry: IncomeEntry = {
            id: newId,
            name: "",
            amount: 0,
            multiplier: 1,
            product: 0
        };
        setIncomeEntries(prev => [...prev, newEntry]);
    };

    const removeEntry = (id: number) => {
        if (incomeEntries.length > 1) {
            setIncomeEntries(prev => prev.filter(entry => entry.id !== id));
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
            title="Employment Income"
            maxWidth="750px"
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
                    {incomeEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-3">
                            {/* Name Input */}
                            <div className="bg-white rounded-lg px-4 py-2 flex-[2]">
                                <input
                                    type="text"
                                    value={entry.name}
                                    onChange={(e) => handleNameChange(entry.id, e.target.value)}
                                    className="bg-transparent text-black w-full outline-none"
                                    placeholder='Name'
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="bg-white rounded-lg px-4 py-2 flex-[1]">
                                <input
                                    type="number"
                                    value={entry.amount}
                                    onChange={(e) => handleAmountChange(entry.id, e.target.value)}
                                    className="bg-transparent text-black w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    step="0.01"
                                />
                            </div>

                            {/* Multiplier */}
                            <div className="bg-gray-500 rounded-lg px-3 py-2">
                                <input
                                    type="number"
                                    value={entry.multiplier}
                                    onChange={(e) => handleMultiplierChange(entry.id, e.target.value)}
                                    className="bg-transparent text-white text-center w-12 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="1"
                                />
                            </div>

                            {/* Product Display */}
                            <div className="bg-white rounded-lg px-4 py-2 flex-1">
                                <Text className="text-black text-center font-semibold">
                                    {formatCurrency(entry.product)}
                                </Text>
                            </div>

                            {/* Remove Button (only show if more than 1 entry) */}
                            {incomeEntries.length > 1 && (
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    className="text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                <Flex justify='end'>
                    <Button onClick={addNewEntry} icon={IoAdd} size='sm' className='px-6'>Add</Button>
                </Flex>

                {/* Total Income */}
                <div className="rounded-lg p-4 bg-white justify-between flex px-10">
                    <Text className="text-black text-center font-bold text-lg">
                        Total
                    </Text>
                    <Text className="text-black text-center font-bold text-lg">
                        {formatCurrency(totalIncome)}
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default Employment;