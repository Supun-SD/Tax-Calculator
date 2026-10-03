import React, { useMemo, useState, useEffect } from 'react';
import { Text, Flex } from '@radix-ui/themes';
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdHome, MdAttachMoney, MdCalculate } from "react-icons/md";
import Button from '../../../../components/Button';
import ClearConfirmation from './ClearConfirmation';
import { RentalIncome, RentalIncomeRecord } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface RentProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IncomeEntry {
    id: number;
    name: string;
    amount: string;
    multiplier: string;
    product: number;
    aitDeducted: boolean;
    ait: number;
}

const Rent: React.FC<RentProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateRentalIncome } = useCalculationContext();
    const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
    const [applyRentRelief, setApplyRentRelief] = useState(true);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);

    const rentalIncome = currentCalculation?.calculationData?.sourceOfIncome?.rentalIncome;
    const aitRate = currentCalculation?.calculationData?.settings?.reliefsAndAit?.whtRent;

    const isDoneDisabled = useMemo(
        () =>
            incomeEntries.some(
                entry =>
                    entry.name === "" ||
                    entry.amount === "" ||
                    entry.multiplier === "" ||
                    entry.multiplier === "0" ||
                    entry.amount === "0"
            ),
        [incomeEntries]
    );

    const totalIncome = useMemo(
        () => incomeEntries.reduce((sum, e) => sum + e.product, 0),
        [incomeEntries]
    );

    const totalAit = useMemo(
        () => incomeEntries.reduce((sum, e) => sum + e.ait, 0),
        [incomeEntries]
    );

    useEffect(() => {
        if (isOpen && rentalIncome) {
            const entries = rentalIncome.incomes.map(
                (income: RentalIncomeRecord, index: number) => {
                    const product = income.value * income.multiplier;
                    const aitDeducted = income.aitDeducted ?? true;
                    return {
                        id: index + 1,
                        name: income.name,
                        amount: income.value.toString(),
                        multiplier: income.multiplier.toString(),
                        product,
                        aitDeducted,
                        ait: aitDeducted ? product * (aitRate ?? 0) / 100 : 0
                    };
                }
            );

            setIncomeEntries(
                entries.length > 0
                    ? entries
                    : [{ id: 1, name: "", amount: "", multiplier: "1", product: 0, aitDeducted: true, ait: 0 }]
            );
            setApplyRentRelief(rentalIncome.applyRentRelief !== false);
        } else if (isOpen && !rentalIncome) {
            setIncomeEntries([{ id: 1, name: "", amount: "", multiplier: "1", product: 0, aitDeducted: true, ait: 0 }]);
            setApplyRentRelief(true);
        }
    }, [isOpen, rentalIncome]);

    const formatCurrency = (amount: number) => CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof IncomeEntry, value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setIncomeEntries(prev =>
                prev.map(entry => {
                    if (entry.id !== id) return entry;

                    const updated = { ...entry, [field]: value };
                    const amount = CalculationService.parseAndRound(updated.amount);
                    const multiplier = CalculationService.parseAndRound(updated.multiplier);
                    updated.product = amount * multiplier;
                    updated.ait = updated.aitDeducted ? updated.product * (aitRate ?? 0) / 100 : 0;

                    return updated;
                })
            );
        }
    };

    const toggleAitDeducted = (id: number) => {
        setIncomeEntries(prev =>
            prev.map(entry => {
                if (entry.id !== id) return entry;
                const aitDeducted = !entry.aitDeducted;
                return { ...entry, aitDeducted, ait: aitDeducted ? entry.product * (aitRate ?? 0) / 100 : 0 };
            })
        );
    };

    const handleNameChange = (id: number, value: string) => {
        setIncomeEntries(prev =>
            prev.map(entry => (entry.id === id ? { ...entry, name: value } : entry))
        );
    };

    const addNewEntry = () => {
        const newId = incomeEntries.length
            ? Math.max(...incomeEntries.map(e => e.id)) + 1
            : 1;

        setIncomeEntries(prev => [
            ...prev,
            { id: newId, name: "", amount: "", multiplier: "1", product: 0, aitDeducted: true, ait: 0 }
        ]);
    };

    const removeEntry = (id: number) => {
        if (incomeEntries.length > 1) {
            setIncomeEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    const clearAllEntries = () => {
        setIncomeEntries([{ id: 1, name: "", amount: "", multiplier: "1", product: 0, aitDeducted: true, ait: 0 }]);
        updateRentalIncome(null);
    };

    const handleConfirmClear = () => {
        clearAllEntries();
        setShowClearConfirmation(false);
    };

    const handleCancelClear = () => {
        setShowClearConfirmation(false);
    };

    const handleDone = () => {
        const rentalIncome: RentalIncome = {
            total: CalculationService.parseAndRound(totalIncome),
            totalAit: CalculationService.parseAndRound(totalAit),
            applyRentRelief,
            incomes: incomeEntries.map(entry => {
                const amount = CalculationService.parseAndRound(entry.amount);
                const multiplier = CalculationService.parseAndRound(entry.multiplier);
                const product = CalculationService.parseAndRound(entry.product);

                return {
                    name: entry.name,
                    value: CalculationService.parseAndRound(amount),
                    multiplier: CalculationService.parseAndRoundWhole(multiplier),
                    total: CalculationService.parseAndRound(product),
                    aitDeducted: entry.aitDeducted,
                    ait: CalculationService.parseAndRound(entry.ait)
                };
            })
        };

        updateRentalIncome(rentalIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                        <MdHome className="text-green-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Rental Income Details</Text>
                </div>
            }
            maxWidth="1000px"
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
                                            <MdHome className="text-green-300" />
                                            <span>Name</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center space-x-2">
                                            <MdAttachMoney className="text-green-300" />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdCalculate className="text-purple-300" />
                                            <span>X</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdCalculate className="text-yellow-300" />
                                            <span>Product</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdAttachMoney className="text-blue-300" />
                                            <span>AIT({aitRate}%)</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {incomeEntries.map((entry, index) => (
                                    <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={entry.name}
                                                    onChange={e => handleNameChange(entry.id, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter name"
                                                />
                                            </div>
                                        </td>

                                        <td className="p-2 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.amount}
                                                    onChange={e => updateEntry(entry.id, "amount", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        <td className="p-2 py-4 text-center">
                                            <div className="inline-block">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.multiplier}
                                                    onChange={e => updateEntry(entry.id, "multiplier", e.target.value)}
                                                    className="w-12 px-2 py-2 bg-purple-400/20 border border-purple-400/30 rounded-lg text-purple-300 text-center placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="1"
                                                />
                                            </div>
                                        </td>

                                        <td className="p-2 py-4 text-end">
                                            <div className="inline-block w-full px-3 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
                                                <Text className="text-yellow-300 font-semibold text-sm">
                                                    {formatCurrency(entry.product)}
                                                </Text>
                                            </div>
                                        </td>

                                        <td className="p-2 py-4">
                                            <div
                                                className="flex items-center justify-between px-3 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg cursor-pointer"
                                                onClick={() => toggleAitDeducted(entry.id)}
                                            >
                                                <Text className="text-blue-300 font-semibold text-sm">
                                                    {entry.aitDeducted ? formatCurrency(entry.ait) : '-'}
                                                </Text>
                                                <input
                                                    type="checkbox"
                                                    checked={entry.aitDeducted}
                                                    onChange={() => toggleAitDeducted(entry.id)}
                                                    onClick={e => e.stopPropagation()}
                                                    className="w-4 h-4 accent-blue-400 cursor-pointer"
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            {incomeEntries.length > 1 && (
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

                            <tfoot className="bg-green-400/10 border-t-2 border-green-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4" colSpan={3}>
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-green-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg'>
                                            <Text className="text-green-300 font-bold text-lg">
                                                {formatCurrency(totalIncome)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg'>
                                            <Text className="text-blue-300 font-bold text-lg">
                                                {formatCurrency(totalAit)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="flex items-center space-x-3 px-1">
                    <input
                        type="checkbox"
                        id="applyRentRelief"
                        checked={applyRentRelief}
                        onChange={e => setApplyRentRelief(e.target.checked)}
                        className="w-4 h-4 accent-green-400 cursor-pointer"
                    />
                    <label htmlFor="applyRentRelief" className="text-gray-300 text-sm cursor-pointer select-none">
                        Apply Rent Relief deduction
                    </label>
                </div>

                <Flex justify="end">
                    <Button
                        onClick={() => setShowClearConfirmation(true)}
                        icon={MdDelete}
                        size="sm"
                        variant="secondary"
                        className="mr-2 bg-red-400/20 hover:bg-red-400/30 text-red-300 border border-red-400/30"
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={addNewEntry}
                        icon={IoAdd}
                        size="sm"
                        variant="secondary"
                        className="bg-green-400/20 hover:bg-green-400/30 text-green-300 border border-green-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>
            </div>
            <ClearConfirmation
                open={showClearConfirmation}
                title="Clear Rental Income"
                description="Are you sure you want to clear all rental income entries? This will remove all rows."
                onCancel={handleCancelClear}
                onConfirm={handleConfirmClear}
            />
        </Modal>
    );
};

export default Rent;
