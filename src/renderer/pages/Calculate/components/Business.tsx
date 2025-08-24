import React, { useMemo, useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import Button from '../../../components/Button';
import { BusinessIncome } from '../../../../types/calculation';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';

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
            title="Business Income"
            maxWidth="900px"
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
                                <th className="p-2 text-left">Hospital</th>
                                <th className="p-2 text-right">Amount</th>
                                <th className="p-2 text-right">Professional Practice</th>
                                <th className="p-2 w-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {businessEntries.map(entry => (
                                <tr key={entry.id} className="h-14">
                                    <td className="p-2">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                value={entry.hospital}
                                                onChange={e => handleHospitalChange(entry.id, e.target.value)}
                                                className="bg-transparent text-black w-full outline-none"
                                                placeholder="Hospital Name"
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
                                    <td className="p-2 text-right">
                                        <div className="bg-white rounded-lg px-4 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={entry.professionalPractice}
                                                onChange={e => updateEntry(entry.id, "professionalPractice", e.target.value)}
                                                className="bg-transparent text-black w-full text-end outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        {businessEntries.length > 1 && (
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
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalAmount)}</div></td>
                                <td className="p-2 font-bold text-white text-lg text-end"><div className='bg-popup-title-bg rounded-xl px-4 py-2'>{formatCurrency(totalProfessionalPractice)}</div></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size="sm" className="px-6">Add</Button>
                </div>

                {/* Taxable Percentage */}
                <div className="flex justify-between items-center">
                    <div className="text-gray-700 font-medium">Percentage for taxable income</div>
                    <div className='flex items-center gap-5'>
                        <div className="bg-white rounded-lg border border-gray-300 px-4 py-2">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={taxablePercentage}
                                    onChange={e => handleTaxablePercentageChange(e.target.value)}
                                    className="w-20 bg-transparent text-gray-800 text-center outline-none"
                                    placeholder="0"
                                />
                                <span className="text-gray-600 ml-1">%</span>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg border border-gray-300 px-4 py-2'>{formatCurrency(totalAmount * CalculationService.parseAndRound(taxablePercentage) / 100)}</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Business;
