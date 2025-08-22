import React, { useMemo, useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import Button from '../../../components/Button';
import { useSettingsContext } from '../../../contexts/SettingsContext';
import { DividendIncome } from '../../../../types/calculation';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';

interface DividendProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DividendEntry {
    id: number;
    company: string;
    grossDividend: string;
    rate: string;
    ait: number;
    exempted: string;
}

const Dividend: React.FC<DividendProps> = ({ isOpen, onClose }) => {
    const { settings } = useSettingsContext();
    const { dividendIncome, setDividendIncome } = useCalculationContext();

    const [dividendEntries, setDividendEntries] = useState<DividendEntry[]>([
        { id: 1, company: "", grossDividend: "", rate: Math.round(settings?.reliefsAndAit.aitDividend || 10).toString(), ait: 0, exempted: "" }
    ]);

    // Load existing data when modal opens
    useEffect(() => {
        if (isOpen && dividendIncome) {
            const entries = dividendIncome.incomes.map((income, index) => ({
                id: index + 1,
                company: income.companyName,
                grossDividend: income.grossDividend.toString(),
                rate: income.rate.toString(),
                ait: income.ait,
                exempted: income.exempted.toString()
            }));
            setDividendEntries(entries.length > 0 ? entries : [{ id: 1, company: "", grossDividend: "", rate: Math.round(settings?.reliefsAndAit.aitDividend || 10).toString(), ait: 0, exempted: "" }]);
        } else if (isOpen && !dividendIncome) {
            setDividendEntries([{ id: 1, company: "", grossDividend: "", rate: Math.round(settings?.reliefsAndAit.aitDividend || 10).toString(), ait: 0, exempted: "" }]);
        }
    }, [isOpen, dividendIncome, settings?.reliefsAndAit.aitDividend]);

    const formatCurrency = (amount: number) =>
        CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof DividendEntry, value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {

            setDividendEntries(prev =>
                prev.map(entry => {
                    if (entry.id !== id) return entry;

                    const updated = { ...entry, [field]: value };

                    // Only calculate AIT when gross dividend or rate changes
                    if (field === "grossDividend" || field === "rate") {
                        const gross = CalculationService.parseAndRound(updated.grossDividend);
                        const rate = CalculationService.parseAndRound(updated.rate);
                        const aitAmount = CalculationService.parseAndRound((gross * rate) / 100);
                        updated.ait = aitAmount;
                    }

                    // Handle exempted field separately - keep as string like gross dividend
                    if (field === "exempted") {
                        updated.exempted = value;
                    }

                    return updated;
                })
            );
        }
    };

    const handleCompanyChange = (id: number, value: string) => {
        setDividendEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, company: value } : entry)
        );
    };

    const addNewEntry = () => {
        const newId = dividendEntries.length ? Math.max(...dividendEntries.map(e => e.id)) + 1 : 1;
        setDividendEntries(prev => [...prev, { id: newId, company: "", grossDividend: "", rate: Math.round(settings?.reliefsAndAit.aitDividend || 10).toString(), ait: 0, exempted: "" }]);
    };

    const removeEntry = (id: number) => {
        if (dividendEntries.length > 1) setDividendEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const totalGrossDividend = useMemo(() =>
        dividendEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.grossDividend), 0), [dividendEntries]);

    const isDoneDisabled = useMemo(() =>
        dividendEntries.some(entry => entry.company === "" || entry.grossDividend === "" || entry.rate === ""), [dividendEntries]);

    const totalAit = useMemo(() =>
        dividendEntries.reduce((sum, e) => sum + e.ait, 0), [dividendEntries]);

    const totalExempted = useMemo(() =>
        dividendEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.exempted), 0), [dividendEntries]);

    const handleDone = () => {
        const dividendIncome: DividendIncome = {
            totalGrossDividend: CalculationService.parseAndRound(totalGrossDividend),
            totalAit: CalculationService.parseAndRound(totalAit),
            totalExempted: CalculationService.parseAndRound(totalExempted),
            incomes: dividendEntries.map(entry => {
                const grossDividend = CalculationService.parseAndRound(entry.grossDividend);
                const rate = CalculationService.parseAndRoundWhole(entry.rate);
                const exempted = CalculationService.parseAndRound(entry.exempted);

                return {
                    companyName: entry.company,
                    grossDividend,
                    rate,
                    ait: CalculationService.parseAndRound(entry.ait),
                    exempted
                };
            })
        };

        setDividendIncome(dividendIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Dividend Income"
            maxWidth="1000px"
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
                                <th className="p-2 text-left">Company</th>
                                <th className="p-2 text-right">Gross Dividend</th>
                                <th className="p-2 text-center">Rate</th>
                                <th className="p-2 text-right">AIT</th>
                                <th className="p-2 text-right">Exempted</th>
                                <th className="p-2 w-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dividendEntries.map(entry => (
                                <tr key={entry.id} className="h-14">
                                    {/* Company */}
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                value={entry.company}
                                                onChange={e => handleCompanyChange(entry.id, e.target.value)}
                                                className="bg-transparent text-black w-full outline-none"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </td>

                                    {/* Gross Dividend */}
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.grossDividend}
                                                onChange={e => updateEntry(entry.id, "grossDividend", e.target.value)}
                                                className="bg-transparent text-black w-full text-end outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>

                                    {/* Rate */}
                                    <td className="p-2 text-center">
                                        <div className="bg-white rounded-lg px-4 py-2 flex">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.rate}
                                                onChange={e => updateEntry(entry.id, "rate", e.target.value)}
                                                className="bg-transparent text-black text-center w-16 outline-none"
                                                placeholder={Math.round(settings?.reliefsAndAit.aitDividend || 0).toString()}
                                            />
                                            <span className="text-black pl-1">%</span>
                                        </div>
                                    </td>

                                    {/* AIT */}
                                    <td className="p-2 text-right">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            {formatCurrency(entry.ait)}
                                        </div>
                                    </td>

                                    {/* Exempted */}
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.exempted}
                                                onChange={e => updateEntry(entry.id, "exempted", e.target.value)}
                                                className="bg-transparent text-black w-full text-end outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>

                                    {/* Remove */}
                                    <td className="p-2 text-center">
                                        {dividendEntries.length > 1 && (
                                            <button
                                                onClick={() => removeEntry(entry.id)}
                                                className="text-red-500 hover:text-red-700 text-lg font-bold w-3 h-6 flex items-center justify-center"
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
                                <td className="p-2 font-bold text-black text-lg" colSpan={1}>Total</td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalGrossDividend)}</div></td>
                                <td></td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalAit)}</div></td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalExempted)}</div></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size="sm" className="px-6">
                        Add
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default Dividend;
