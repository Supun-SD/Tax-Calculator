import React, { useState, useMemo, useEffect } from 'react';
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdTrendingUp, MdAttachMoney, MdCalculate, MdDescription } from "react-icons/md";
import { Text, Flex } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { OtherIncome } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface OtherProps {
    isOpen: boolean;
    onClose: () => void;
}

interface OtherEntry {
    id: number;
    description: string;
    amount: string;
}

const Other: React.FC<OtherProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateOtherIncome } = useCalculationContext();
    const [otherEntries, setOtherEntries] = useState<OtherEntry[]>([]);

    const otherIncome = currentCalculation?.calculationData?.sourceOfIncome?.otherIncome;

    useEffect(() => {
        if (isOpen && otherIncome) {
            const entries = otherIncome.incomes.map((income: any, index: number) => ({
                id: index + 1,
                description: income.incomeType,
                amount: income.value.toString()
            }));
            setOtherEntries(entries.length > 0 ? entries : [{ id: 1, description: "", amount: "" }]);
        } else if (isOpen && !otherIncome) {
            setOtherEntries([{ id: 1, description: "", amount: "" }]);
        }
    }, [isOpen, otherIncome]);

    const formatCurrency = (amount: number) =>
        CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof OtherEntry, value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setOtherEntries(prev =>
                prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry)
            );
        }
    };

    const handleDescriptionChange = (id: number, value: string) => {
        setOtherEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, description: value } : entry)
        );
    };

    const addNewEntry = () => {
        const newId = otherEntries.length ? Math.max(...otherEntries.map(e => e.id)) + 1 : 1;
        setOtherEntries(prev => [...prev, { id: newId, description: "", amount: "" }]);
    };

    const removeEntry = (id: number) => {
        if (otherEntries.length > 1) setOtherEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const totalIncome = useMemo(() =>
        otherEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.amount), 0), [otherEntries]);

    const isDoneDisabled = useMemo(() =>
        otherEntries.some(e => e.description === "" || e.amount === ""), [otherEntries]
    );

    const handleDone = () => {
        const otherIncome: OtherIncome = {
            total: CalculationService.parseAndRound(totalIncome),
            incomes: otherEntries.map(entry => ({
                incomeType: entry.description,
                value: CalculationService.parseAndRound(entry.amount)
            }))
        };
        updateOtherIncome(otherIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                        <MdTrendingUp className="text-indigo-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Other Income Details</Text>
                </div>
            }
            maxWidth="600px"
            isDark={true}
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'secondary',
                    className: 'bg-gray-600 hover:bg-gray-700 text-white',
                },
                {
                    label: 'Done',
                    onClick: handleDone,
                    variant: 'primary',
                    disabled: isDoneDisabled,
                    className: isDoneDisabled ? 'opacity-50 cursor-not-allowed' : '',
                },
            ]}
        >
            <div className="space-y-6">
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/10 border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center space-x-2">
                                            <MdDescription className="text-indigo-300" />
                                            <span>Description</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdAttachMoney className="text-green-300" />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 w-8"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {otherEntries.map((entry, index) => (
                                    <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                        {/* Description */}
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={entry.description}
                                                    onChange={e => handleDescriptionChange(entry.id, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="Income type"
                                                />
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.amount}
                                                    onChange={e => updateEntry(entry.id, "amount", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        {/* Remove Button */}
                                        <td className="px-4 py-4 text-center">
                                            {otherEntries.length > 1 && (
                                                <button
                                                    onClick={() => removeEntry(entry.id)}
                                                    className="w-6 h-6 bg-red-400/20 hover:bg-red-400/30 text-red-300 hover:text-red-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-red-400/30"
                                                >
                                                    <MdDelete size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot className="bg-indigo-400/10 border-t-2 border-indigo-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4">
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-indigo-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-indigo-400/20 border border-indigo-400/30 rounded-lg'>
                                            <Text className="text-indigo-300 font-bold text-lg">
                                                {formatCurrency(totalIncome)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Add Button */}
                <Flex justify="end">
                    <Button
                        onClick={addNewEntry}
                        icon={IoAdd}
                        size="sm"
                        variant="secondary"
                        className="bg-indigo-400/20 hover:bg-indigo-400/30 text-indigo-300 border border-indigo-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};

export default Other;
