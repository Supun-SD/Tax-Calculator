import React, { useMemo, useState, useEffect } from 'react';
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdBusiness, MdAttachMoney, MdCalculate, MdReceipt, MdTrendingUp } from "react-icons/md";
import { Text, Flex } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { DividendIncome } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

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
    const { currentCalculation, updateDividendIncome } = useCalculationContext();

    const [dividendEntries, setDividendEntries] = useState<DividendEntry[]>([]);

    const dividendIncome = currentCalculation?.calculationData?.sourceOfIncome?.dividendIncome;
    const aitRate: number = currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitDividend;

    const totalGrossDividend = useMemo(
        () => dividendEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.grossDividend), 0),
        [dividendEntries]
    );

    const totalAit = useMemo(
        () => dividendEntries.reduce((sum, e) => sum + e.ait, 0),
        [dividendEntries]
    );

    const totalExempted = useMemo(
        () => dividendEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.exempted), 0),
        [dividendEntries]
    );

    const isDoneDisabled = useMemo(
        () =>
            dividendEntries.some(
                entry =>
                    entry.company === "" ||
                    entry.grossDividend === "" ||
                    entry.rate === "" ||
                    entry.rate === "0"
            ),
        [dividendEntries]
    );

    useEffect(() => {
        if (isOpen && dividendIncome) {
            const entries = dividendIncome.incomes.map(
                (income: any, index: number) => ({
                    id: index + 1,
                    company: income.companyName,
                    grossDividend: income.grossDividend.toString(),
                    rate: income.rate.toString(),
                    ait: income.ait,
                    exempted: income.exempted.toString()
                })
            );

            setDividendEntries(
                entries.length > 0
                    ? entries
                    : [{
                        id: 1,
                        company: "",
                        grossDividend: "",
                        rate: Math.round(aitRate).toString(),
                        ait: 0,
                        exempted: ""
                    }]
            );
        } else if (isOpen && !dividendIncome) {
            setDividendEntries([{
                id: 1,
                company: "",
                grossDividend: "",
                rate: Math.round(aitRate).toString(),
                ait: 0,
                exempted: ""
            }]);
        }
    }, [isOpen, dividendIncome, aitRate]);

    const formatCurrency = (amount: number) => CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof DividendEntry, value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setDividendEntries(prev =>
                prev.map(entry => {
                    if (entry.id !== id) return entry;

                    const updated = { ...entry, [field]: value };

                    if (field === "grossDividend" || field === "rate") {
                        const gross = CalculationService.parseAndRound(updated.grossDividend);
                        const rate = CalculationService.parseAndRound(updated.rate);
                        const aitAmount = CalculationService.parseAndRound((gross * rate) / 100);
                        updated.ait = aitAmount;
                    }

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
            prev.map(entry => (entry.id === id ? { ...entry, company: value } : entry))
        );
    };

    const addNewEntry = () => {
        const newId = dividendEntries.length
            ? Math.max(...dividendEntries.map(e => e.id)) + 1
            : 1;

        setDividendEntries(prev => [
            ...prev,
            {
                id: newId,
                company: "",
                grossDividend: "",
                rate: Math.round(aitRate).toString(),
                ait: 0,
                exempted: ""
            }
        ]);
    };

    const removeEntry = (id: number) => {
        if (dividendEntries.length > 1) {
            setDividendEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

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

        updateDividendIncome(dividendIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                        <MdAttachMoney className="text-yellow-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Dividend Income Details</Text>
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
                                            <MdBusiness className="text-yellow-300" />
                                            <span>Company</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdAttachMoney className="text-green-300" />
                                            <span>Gross Dividend</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide w-20">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdCalculate className="text-purple-300" />
                                            <span>Rate</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdReceipt className="text-red-300" />
                                            <span>AIT</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdTrendingUp className="text-blue-300" />
                                            <span>Exempted</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 w-8"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {dividendEntries.map((entry, index) => (
                                    <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                        {/* Company */}
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={entry.company}
                                                    onChange={e => handleCompanyChange(entry.id, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="Company Name"
                                                />
                                            </div>
                                        </td>

                                        {/* Gross Dividend */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.grossDividend}
                                                    onChange={e => updateEntry(entry.id, "grossDividend", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        {/* Rate */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="inline-block">
                                                <div className="flex items-center bg-purple-400/20 border border-purple-400/30 rounded-lg px-3 py-2">
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={entry.rate}
                                                        onChange={e => updateEntry(entry.id, "rate", e.target.value)}
                                                        className="bg-transparent text-purple-300 text-center w-12 outline-none placeholder-purple-300/50 focus:outline-none"
                                                        placeholder={Math.round(aitRate).toString()}
                                                    />
                                                    <span className="text-purple-300 pl-1 text-sm">%</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* AIT */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="inline-block w-full px-3 py-2 bg-red-400/20 border border-red-400/30 rounded-lg">
                                                <Text className="text-red-300 font-semibold text-sm text-right">
                                                    {formatCurrency(entry.ait)}
                                                </Text>
                                            </div>
                                        </td>

                                        {/* Exempted */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.exempted}
                                                    onChange={e => updateEntry(entry.id, "exempted", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        {/* Remove Button */}
                                        <td className="px-4 py-4 text-center">
                                            {dividendEntries.length > 1 && (
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

                            <tfoot className="bg-yellow-400/10 border-t-2 border-yellow-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4">
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-yellow-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg'>
                                            <Text className="text-yellow-300 font-bold text-lg">
                                                {formatCurrency(totalGrossDividend)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td></td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg'>
                                            <Text className="text-yellow-300 font-bold text-lg">
                                                {formatCurrency(totalAit)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg'>
                                            <Text className="text-yellow-300 font-bold text-lg">
                                                {formatCurrency(totalExempted)}
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
                        className="bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};

export default Dividend;
