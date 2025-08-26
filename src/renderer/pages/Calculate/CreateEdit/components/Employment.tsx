import React, { useMemo, useState, useEffect } from 'react';
import { Text, Flex } from '@radix-ui/themes';
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdPerson, MdAttachMoney, MdCalculate, MdReceipt } from "react-icons/md";
import Button from '../../../../components/Button';
import { EmploymentIncome, EmploymentIncomeRecord } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface EmploymentProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IncomeEntry {
    id: number;
    name: string;
    amount: string;
    multiplier: string;
    appit: string;
    product: number;
}

const Employment: React.FC<EmploymentProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateEmploymentIncome } = useCalculationContext();
    const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);

    const employmentIncome = currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome;

    const isDoneDisabled = useMemo(
        () =>
            incomeEntries.some(
                entry =>
                    entry.name === "" ||
                    entry.amount === "" ||
                    entry.multiplier === "" ||
                    entry.multiplier === "0" ||
                    entry.appit === ""
            ),
        [incomeEntries]
    );

    const totalIncome = useMemo(
        () => incomeEntries.reduce((sum, e) => sum + e.product, 0),
        [incomeEntries]
    );

    const totalAppit = useMemo(
        () => incomeEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.appit), 0),
        [incomeEntries]
    );

    useEffect(() => {
        if (isOpen && employmentIncome) {
            const entries = employmentIncome.incomes.map(
                (income: EmploymentIncomeRecord, index: number) => ({
                    id: index + 1,
                    name: income.name,
                    amount: income.value.toString(),
                    multiplier: income.multiplier.toString(),
                    appit: income.appit.toString(),
                    product: income.value * income.multiplier
                })
            );

            setIncomeEntries(
                entries.length > 0
                    ? entries
                    : [{ id: 1, name: "", amount: "", multiplier: "1", appit: "", product: 0 }]
            );
        } else if (isOpen && !employmentIncome) {
            setIncomeEntries([{ id: 1, name: "", amount: "", multiplier: "1", appit: "", product: 0 }]);
        }
    }, [isOpen, employmentIncome]);

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

                    return updated;
                })
            );
        }
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
            { id: newId, name: "", amount: "", multiplier: "1", appit: "", product: 0 }
        ]);
    };

    const removeEntry = (id: number) => {
        if (incomeEntries.length > 1) {
            setIncomeEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    const handleDone = () => {
        const employmentIncome: EmploymentIncome = {
            total: CalculationService.parseAndRound(totalIncome),
            appitTotal: CalculationService.parseAndRound(totalAppit),
            incomes: incomeEntries.map(entry => {
                const amount = CalculationService.parseAndRound(entry.amount);
                const multiplier = CalculationService.parseAndRound(entry.multiplier);
                const appit = CalculationService.parseAndRound(entry.appit);
                const product = amount * multiplier;

                return {
                    name: entry.name,
                    value: CalculationService.parseAndRound(amount),
                    multiplier: CalculationService.parseAndRoundWhole(multiplier),
                    appit: CalculationService.parseAndRound(appit),
                    total: CalculationService.parseAndRound(product)
                };
            })
        };

        updateEmploymentIncome(employmentIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                        <MdPerson className="text-blue-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Employment Income Details</Text>
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
                                            <MdPerson className="text-blue-300" />
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
                                        <div className="flex items-center justify-end space-x-2">
                                            <MdReceipt className="text-orange-300" />
                                            <span>APPIT</span>
                                        </div>
                                    </th>
                                    <th className="p-2 w-8"></th>
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
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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

                                        <td className="p-2 py-4 text-center">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.appit}
                                                    onChange={e => updateEntry(entry.id, "appit", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="0.00"
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

                            <tfoot className="bg-blue-400/10 border-t-2 border-blue-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4" colSpan={3}>
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-blue-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg'>
                                            <Text className="text-blue-300 font-bold text-lg">
                                                {formatCurrency(totalIncome)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg'>
                                            <Text className="text-blue-300 font-bold text-lg">
                                                {formatCurrency(totalAppit)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <Flex justify="end">
                    <Button
                        onClick={addNewEntry}
                        icon={IoAdd}
                        size="sm"
                        variant="secondary"
                        className="bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 border border-blue-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};

export default Employment;
