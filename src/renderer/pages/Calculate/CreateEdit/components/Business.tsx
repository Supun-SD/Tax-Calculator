import React, { useMemo, useState, useEffect } from 'react';
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdBusiness, MdAttachMoney, MdCalculate, MdReceipt, MdLocalHospital } from "react-icons/md";
import { Text, Flex } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { BusinessIncome } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface BusinessProps {
    isOpen: boolean;
    onClose: () => void;
}

interface BusinessEntry {
    id: number;
    hospital: string;
    amount: string;
    professionalPractice: string;
}

const Business: React.FC<BusinessProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateBusinessIncome } = useCalculationContext();
    const [businessEntries, setBusinessEntries] = useState<BusinessEntry[]>([]);
    const [taxablePercentage, setTaxablePercentage] = useState<string>("");

    const businessIncome = currentCalculation?.calculationData?.sourceOfIncome?.businessIncome;

    useEffect(() => {
        if (isOpen && businessIncome) {
            const entries = businessIncome.incomes.map((income: any, index: number) => ({
                id: index + 1,
                hospital: income.hospitalName,
                amount: income.value.toString(),
                professionalPractice: income.professionalPractice.toString()
            }));
            setBusinessEntries(entries.length > 0 ? entries : [{ id: 1, hospital: "", amount: "", professionalPractice: "" }]);
            setTaxablePercentage(businessIncome.assessableIncomePercentage.toString());
        } else if (isOpen && !businessIncome) {
            setBusinessEntries([{ id: 1, hospital: "", amount: "", professionalPractice: "" }]);
            setTaxablePercentage("");
        }
    }, [isOpen, businessIncome]);

    const formatCurrency = (amount: number) =>
        CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof BusinessEntry, value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setBusinessEntries(prev =>
                prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry)
            );
        }
    };

    const handleHospitalChange = (id: number, value: string) => {
        setBusinessEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, hospital: value } : entry)
        );
    };

    const handleTaxablePercentageChange = (value: string) => {
        if (value.match(/^\d*\.?\d{0,2}$/)) {
            setTaxablePercentage(value);
        }
    };

    const addNewEntry = () => {
        const newId = businessEntries.length ? Math.max(...businessEntries.map(e => e.id)) + 1 : 1;
        setBusinessEntries(prev => [...prev, { id: newId, hospital: "", amount: "", professionalPractice: "" }]);
    };

    const removeEntry = (id: number) => {
        if (businessEntries.length > 1) setBusinessEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const totalAmount = useMemo(() =>
        businessEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.amount), 0), [businessEntries]);

    const totalProfessionalPractice = useMemo(() =>
        businessEntries.reduce((sum, e) => sum + CalculationService.parseAndRound(e.professionalPractice), 0), [businessEntries]);

    const isDoneDisabled = useMemo(() =>
        businessEntries.some(e => e.hospital === "" || e.amount === "" || e.professionalPractice === "") ||
        taxablePercentage === "" || taxablePercentage === "0",
        [businessEntries, taxablePercentage]
    );

    const handleDone = () => {
        const assessableIncomePercentage = CalculationService.parseAndRoundWhole(taxablePercentage);
        const amountForAssessableIncome = CalculationService.parseAndRound((totalAmount * assessableIncomePercentage) / 100);

        const businessIncome: BusinessIncome = {
            total: CalculationService.parseAndRound(totalAmount),
            professionalPracticeTotal: CalculationService.parseAndRound(totalProfessionalPractice),
            incomes: businessEntries.map(entry => ({
                hospitalName: entry.hospital,
                value: CalculationService.parseAndRound(entry.amount),
                professionalPractice: CalculationService.parseAndRound(entry.professionalPractice)
            })),
            amountForAssessableIncome,
            assessableIncomePercentage
        };

        updateBusinessIncome(businessIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                        <MdBusiness className="text-red-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Business Income Details</Text>
                </div>
            }
            maxWidth="900px"
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
                                            <MdLocalHospital className="text-red-300" />
                                            <span>Hospital</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdAttachMoney className="text-green-300" />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdReceipt className="text-blue-300" />
                                            <span>Professional Practice</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 w-8"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {businessEntries.map((entry, index) => (
                                    <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                        {/* Hospital */}
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={entry.hospital}
                                                    onChange={e => handleHospitalChange(entry.id, e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="Hospital Name"
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

                                        {/* Professional Practice */}
                                        <td className="p-2 py-4 text-center">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={entry.professionalPractice}
                                                    onChange={e => updateEntry(entry.id, "professionalPractice", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>

                                        {/* Remove Button */}
                                        <td className="px-4 py-4 text-center">
                                            {businessEntries.length > 1 && (
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

                            <tfoot className="bg-red-400/10 border-t-2 border-red-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4">
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-red-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-lg'>
                                            <Text className="text-red-300 font-bold text-lg">
                                                {formatCurrency(totalAmount)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="p-2 text-end">
                                        <div className='inline-block w-full px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-lg'>
                                            <Text className="text-red-300 font-bold text-lg">
                                                {formatCurrency(totalProfessionalPractice)}
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
                        className="bg-red-400/20 hover:bg-red-400/30 text-red-300 border border-red-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>

                {/* Taxable Percentage */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MdCalculate className="text-red-300" />
                            <Text className="text-white font-medium">Percentage for taxable income</Text>
                        </div>
                        <div className='flex items-center gap-5'>
                            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-red-400 focus-within:border-transparent transition-all duration-200">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={taxablePercentage}
                                        onChange={e => handleTaxablePercentageChange(e.target.value)}
                                        className="w-20 bg-transparent text-white text-center outline-none placeholder-gray-400"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-300 ml-1">%</span>
                                </div>
                            </div>
                            <div className='bg-red-400/20 border border-red-400/30 rounded-lg px-4 py-2'>
                                <Text className="text-red-300 font-semibold">
                                    {formatCurrency(totalAmount * CalculationService.parseAndRound(taxablePercentage) / 100)}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Business;
