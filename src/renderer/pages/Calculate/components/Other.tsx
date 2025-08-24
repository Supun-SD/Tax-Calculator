import React, { useState, useMemo, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import Button from '../../../components/Button';
import { OtherIncome } from '../../../../types/calculation';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';

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
            title="Other Income"
            maxWidth="600px"
            actions={[
                { label: 'Cancel', onClick: onClose, variant: 'secondary', className: 'bg-gray-300 text-black hover:bg-gray-400' },
                { label: 'Done', onClick: handleDone, variant: 'primary', disabled: isDoneDisabled }
            ]}
        >
            <div className="space-y-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-black font-bold text-sm">
                                <th className="p-2 text-left">Description</th>
                                <th className="p-2 text-right">Amount</th>
                                <th className="p-2 w-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherEntries.map(entry => (
                                <tr key={entry.id} className="h-14">
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                value={entry.description}
                                                onChange={e => handleDescriptionChange(entry.id, e.target.value)}
                                                className="bg-transparent text-black w-full outline-none"
                                                placeholder="Income type"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2 text-right">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.amount}
                                                onChange={e => updateEntry(entry.id, "amount", e.target.value)}
                                                className="bg-transparent text-black w-full text-end outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        {otherEntries.length > 1 && (
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
                        <tfoot>
                            <tr>
                                <td className="p-2 font-bold text-black text-lg">Total</td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalIncome)}</div></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size="sm" className="px-6">Add</Button>
                </div>
            </div>
        </Modal>
    );
};

export default Other;
