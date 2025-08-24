import React, { useMemo, useState, useEffect } from 'react';
import { Text, Flex } from '@radix-ui/themes';
import Modal from "../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import Button from '../../../components/Button';
import { EmploymentIncome } from '../../../../types/calculation';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';

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
    const { employmentIncome, updateIncomeData } = useCalculationContext();
    const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
        { id: 1, name: "", amount: "", multiplier: "1", appit: "", product: 0 }
    ]);

    // Load existing data when modal opens
    useEffect(() => {
        if (isOpen && employmentIncome) {
            const entries = employmentIncome.incomes.map((income, index) => ({
                id: index + 1,
                name: income.name,
                amount: income.value.toString(),
                multiplier: income.multiplier.toString(),
                appit: income.appit.toString(),
                product: income.total
            }));
            setIncomeEntries(entries.length > 0 ? entries : [{ id: 1, name: "", amount: "", multiplier: "1", appit: "", product: 0 }]);
        } else if (isOpen && !employmentIncome) {
            setIncomeEntries([{ id: 1, name: "", amount: "", multiplier: "1", appit: "", product: 0 }]);
        }
    }, [isOpen, employmentIncome]);

    // Helpers
    const formatCurrency = (amount: number) =>
        CalculationService.formatCurrency(amount);

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
            prev.map(entry => entry.id === id ? { ...entry, name: value } : entry)
        );
    };

    const addNewEntry = () => {
        const newId = incomeEntries.length ? Math.max(...incomeEntries.map(e => e.id)) + 1 : 1;
        setIncomeEntries(prev => [...prev, { id: newId, name: "", amount: "", multiplier: "1", appit: "", product: 0 }]);
    };

    const removeEntry = (id: number) => {
        if (incomeEntries.length > 1) {
            setIncomeEntries(prev => {
                const updated = prev.filter(entry => entry.id !== id);
                return updated;
            });
        }
    };

    const isDoneDisabled = useMemo(() => incomeEntries.some(entry => entry.name === "" || entry.amount === "" || entry.multiplier === "" || entry.appit === ""), [incomeEntries]);

    // Totals
    const totalIncome = useMemo(() => incomeEntries.reduce((sum, e) => sum + e.product, 0), [incomeEntries]);
    const totalAppit = useMemo(() => incomeEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.appit), 0), [incomeEntries]);

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
        updateIncomeData('employmentIncome', employmentIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Employment Income"
            maxWidth="900px"
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
                    disabled: isDoneDisabled,
                },
            ]}
        >
            <div className="space-y-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-black font-bold text-sm">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-center">Multiplier</th>
                                <th className="p-2 text-center">Product</th>
                                <th className="p-2 text-center">APPIT</th>
                                <th className="p-2 w-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeEntries.map(entry => (
                                <tr key={entry.id} className="h-14">
                                    {/* Name */}
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                value={entry.name}
                                                onChange={e => handleNameChange(entry.id, e.target.value)}
                                                className="bg-transparent text-black w-full outline-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.amount}
                                                onChange={e => updateEntry(entry.id, "amount", e.target.value)}
                                                className="bg-transparent text-black w-full text-end outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>

                                    {/* Multiplier */}
                                    <td className="p-2 text-center">
                                        <div className="bg-gray-500 rounded-lg px-3 py-2 inline-block">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.multiplier}
                                                onChange={e => updateEntry(entry.id, "multiplier", e.target.value)}
                                                className="bg-transparent text-white text-center w-12 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder=""
                                            />
                                        </div>
                                    </td>

                                    {/* Product */}
                                    <td className="p-2 text-center">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <Text className="text-black text-center font-semibold">
                                                {formatCurrency(entry.product)}
                                            </Text>
                                        </div>
                                    </td>

                                    {/* APPIT */}
                                    <td className="p-2 text-center">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.appit}
                                                onChange={e => updateEntry(entry.id, "appit", e.target.value)}
                                                className="bg-transparent text-black text-end w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>

                                    {/* Remove */}
                                    <td className="p-2 text-center">
                                        {incomeEntries.length > 1 && (
                                            <button
                                                onClick={() => removeEntry(entry.id)}
                                                className="text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* Totals */}
                        <tfoot>
                            <tr>
                                <td className="p-2 font-bold text-black text-lg" colSpan={3}><div className='px-4 py-2'>Total</div></td>
                                <td className="p-2 font-bold text-white text-lg text-center"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalIncome)}</div></td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalAppit)}</div></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Add Button */}
                <Flex justify="end">
                    <Button onClick={addNewEntry} icon={IoAdd} size="sm" className="px-6">
                        Add
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};

export default Employment;
