import React, { useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd, IoClose } from "react-icons/io5";
import Button from '../../../components/Button';

interface DividendProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DividendEntry {
    id: number;
    company: string;
    grossDividend: number;
    rate: number;
    ait: number;
    exempted: number;
}

const Dividend: React.FC<DividendProps> = ({ isOpen, onClose }) => {
    const [dividendEntries, setDividendEntries] = useState<DividendEntry[]>([
        {
            id: 1,
            company: "",
            grossDividend: 0,
            rate: 10,
            ait: 0,
            exempted: 0
        }
    ]);

    const [totalGrossDividend, setTotalGrossDividend] = useState<number>(0);

    useEffect(() => {
        const total = dividendEntries.reduce((sum, entry) => sum + entry.grossDividend, 0);
        setTotalGrossDividend(total);
    }, [dividendEntries]);

    const handleCompanyChange = (id: number, value: string) => {
        setDividendEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, company: value } : entry
        ));
    };

    const handleGrossDividendChange = (id: number, value: string) => {
        // Allow empty string
        if (value === '') {
            setDividendEntries(prev => prev.map(entry =>
                entry.id === id ? {
                    ...entry,
                    grossDividend: 0,
                    ait: 0,
                    exempted: 0
                } : entry
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
            setDividendEntries(prev => prev.map(entry =>
                entry.id === id ? {
                    ...entry,
                    grossDividend: cleanValue as unknown as number,
                    ait: 0,
                    exempted: 0
                } : entry
            ));
            return;
        }

        // Parse when it's a complete number
        const numValue = parseFloat(cleanValue);
        if (isNaN(numValue)) return;

        const roundedValue = Math.round(numValue * 100) / 100;
        const entry = dividendEntries.find(e => e.id === id);
        if (!entry) return;

        const aitAmount = Math.round((roundedValue * entry.rate) / 100 * 100) / 100;
        const exemptedAmount = Math.round((roundedValue * entry.rate) / 100 * 100) / 100;

        setDividendEntries(prev => prev.map(entry =>
            entry.id === id ? {
                ...entry,
                grossDividend: roundedValue,
                ait: aitAmount,
                exempted: exemptedAmount
            } : entry
        ));
    };

    const handleRateChange = (id: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        const entry = dividendEntries.find(e => e.id === id);
        if (!entry) return;

        const aitAmount = Math.round((entry.grossDividend * numValue) / 100 * 100) / 100;
        const exemptedAmount = Math.round((entry.grossDividend * numValue) / 100 * 100) / 100;

        setDividendEntries(prev => prev.map(entry =>
            entry.id === id ? {
                ...entry,
                rate: numValue,
                ait: aitAmount,
                exempted: exemptedAmount
            } : entry
        ));
    };

    const addNewEntry = () => {
        const newId = Math.max(...dividendEntries.map(entry => entry.id)) + 1;
        const newEntry: DividendEntry = {
            id: newId,
            company: "",
            grossDividend: 0,
            rate: 10,
            ait: 0,
            exempted: 0
        };
        setDividendEntries(prev => [...prev, newEntry]);
    };

    const removeEntry = (id: number) => {
        if (dividendEntries.length > 1) {
            setDividendEntries(prev => prev.filter(entry => entry.id !== id));
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
            title="Dividend Income"
            maxWidth="70vw"
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
                {/* Table Header */}
                <div className="grid grid-cols-[2.5fr_1.5fr_0.8fr_1.5fr_1.5fr] gap-4 text-sm font-medium text-gray-700">
                    <div>Company</div>
                    <div className="text-end">Gross Dividend</div>
                    <div className="text-center">Rate</div>
                    <div className="text-end">AIT</div>
                    <div className="text-end pr-8">Exempted</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-2">
                    {dividendEntries.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-[2.5fr_1.5fr_0.8fr_1.5fr_1.5fr] gap-4">
                            {/* Company */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="text"
                                    value={entry.company}
                                    onChange={(e) => handleCompanyChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                    placeholder="Company Name"
                                />
                            </div>

                            {/* Gross Dividend */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="text"
                                    value={entry.grossDividend === 0 ? "" : entry.grossDividend.toString()}
                                    onChange={(e) => handleGrossDividendChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Rate */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={entry.rate}
                                        onChange={(e) => handleRateChange(entry.id, e.target.value)}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                    <span className="text-gray-600 pr-2">%</span>
                                </div>
                            </div>

                            {/* AIT */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="number"
                                    value={entry.ait}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                    placeholder="0.00"
                                    readOnly
                                />
                            </div>

                            {/* Exempted */}
                            <div className="flex items-center gap-2">
                                <div className="bg-white rounded-lg border border-gray-300 flex-1">
                                    <input
                                        type="number"
                                        value={entry.exempted}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                        placeholder="0.00"
                                        readOnly
                                    />
                                </div>
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    className="text-gray-600 hover:text-gray-800 p-1"
                                    disabled={dividendEntries.length === 1}
                                >
                                    <IoClose size={16} color='red' />
                                </button>
                            </div>
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
                    <div className="bg-white rounded-lg px-8 py-4">
                        <div className="text-center">
                            <div className="text-xl font-bold text-gray-800">
                                {formatCurrency(totalGrossDividend)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Dividend;
