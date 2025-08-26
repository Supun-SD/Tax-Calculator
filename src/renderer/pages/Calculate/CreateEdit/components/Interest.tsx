import React, { useState, useEffect, useMemo } from 'react';
import Modal from "../../../../components/Modal";
import { IoAdd, IoChevronDown } from "react-icons/io5";
import { MdDelete, MdAccountBalance, MdAttachMoney, MdCalculate, MdReceipt, MdSearch } from "react-icons/md";
import { Text, Flex } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { ClipLoader } from 'react-spinners';
import { useBanks } from '../../../../hooks/useBanks';
import { Bank } from '../../../../../types/bank';
import { InterestIncome, InterestIncomeRecord } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface InterestProps {
    isOpen: boolean;
    onClose: () => void;
}

interface InterestEntry {
    id: number;
    bank: {
        name: string;
        tinNumber: string;
    };
    accountNumber: string;
    certificateNumber: string;
    isJoint: boolean;
    grossInterest: string;
    ait: number;
}

const Interest: React.FC<InterestProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateInterestIncome } = useCalculationContext();

    const [interestEntries, setInterestEntries] = useState<InterestEntry[]>([]);
    const [totalGrossInterest, setTotalGrossInterest] = useState<number>(0);
    const [totalAIT, setTotalAIT] = useState<number>(0);
    const [bankSearchTerm, setBankSearchTerm] = useState<string>("");
    const [activeBankDropdown, setActiveBankDropdown] = useState<number | null>(null);

    const { banks, loading: isBanksLoading } = useBanks();

    const interestIncome = currentCalculation?.calculationData?.sourceOfIncome?.interestIncome;
    const aitRate: number = currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitInterest;

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );

    const isDoneDisabled = useMemo(() => {
        return interestEntries.some(entry =>
            entry.bank.name === "Select Bank" ||
            (!entry.accountNumber && !entry.certificateNumber) ||
            entry.grossInterest === ""
        );
    }, [interestEntries]);

    useEffect(() => {
        if (isOpen && interestIncome) {
            const entries = interestIncome.incomes.map(
                (income: InterestIncomeRecord, index: number) => ({
                    id: index + 1,
                    bank: income.bank,
                    accountNumber: income.accountNumber || "",
                    certificateNumber: income.certificateNumber || "",
                    isJoint: income.isJoint,
                    grossInterest: income.grossInterest.toString(),
                    ait: income.ait
                })
            );

            setInterestEntries(
                entries.length > 0
                    ? entries
                    : [{
                        id: 1,
                        bank: { name: "Select Bank", tinNumber: "" },
                        accountNumber: "",
                        certificateNumber: "",
                        isJoint: false,
                        grossInterest: "",
                        ait: 0
                    }]
            );
        } else if (isOpen && !interestIncome) {
            setInterestEntries([{
                id: 1,
                bank: { name: "Select Bank", tinNumber: "" },
                accountNumber: "",
                certificateNumber: "",
                isJoint: false,
                grossInterest: "",
                ait: 0
            }]);
        }
    }, [isOpen, interestIncome]);

    useEffect(() => {
        let grossTotal = 0;
        let aitTotal = 0;

        interestEntries.forEach(entry => {
            const gross = CalculationService.parseAndRound(entry.grossInterest);
            const contribution = entry.isJoint ? gross / 2 : gross;
            const aitAmount = CalculationService.parseAndRound((contribution * aitRate) / 100);

            entry.ait = aitAmount;
            grossTotal += contribution;
            aitTotal += aitAmount;
        });

        setTotalGrossInterest(CalculationService.parseAndRound(grossTotal));
        setTotalAIT(CalculationService.parseAndRound(aitTotal));
    }, [interestEntries, aitRate]);

    const formatCurrency = (amount: number) => CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof InterestEntry, value: string) => {
        if (field === "grossInterest") {
            if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
            const parts = value.split(".");
            if (parts[1] && parts[1].length > 2) return;
        }

        setInterestEntries(prev =>
            prev.map(entry => (entry.id === id ? { ...entry, [field]: value } : entry))
        );
    };

    const handleBankChange = (id: number, bank: Bank) => {
        setInterestEntries(prev =>
            prev.map(entry =>
                entry.id === id
                    ? { ...entry, bank: { name: bank.name, tinNumber: bank.tinNumber } }
                    : entry
            )
        );
        setActiveBankDropdown(null);
        setBankSearchTerm("");
    };

    const addNewEntry = () => {
        const newId = interestEntries.length
            ? Math.max(...interestEntries.map(e => e.id)) + 1
            : 1;

        const lastEntry = interestEntries[interestEntries.length - 1];
        const defaultBank = { name: "Select Bank", tinNumber: "" };
        const selectedBank =
            lastEntry?.bank.name !== "Select Bank" ? lastEntry.bank : defaultBank;

        setInterestEntries(prev => [
            ...prev,
            {
                id: newId,
                bank: selectedBank,
                accountNumber: "",
                certificateNumber: "",
                isJoint: false,
                grossInterest: "",
                ait: 0
            }
        ]);
    };

    const removeEntry = (id: number) => {
        if (interestEntries.length > 1) {
            setInterestEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    const handleDone = () => {
        const interestIncome: InterestIncome = {
            totalGrossInterest: CalculationService.parseAndRound(totalGrossInterest),
            totalAit: CalculationService.parseAndRound(totalAIT),
            incomes: interestEntries.map(e => {
                const gross = CalculationService.parseAndRound(e.grossInterest);
                const contribution = e.isJoint ? gross / 2 : gross;
                return {
                    bank: e.bank,
                    accountNumber: e.accountNumber,
                    certificateNumber: e.certificateNumber,
                    isJoint: e.isJoint,
                    grossInterest: CalculationService.parseAndRound(gross),
                    contribution: CalculationService.parseAndRound(contribution),
                    ait: CalculationService.parseAndRound(e.ait)
                };
            })
        };
        updateInterestIncome(interestIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                        <MdAccountBalance className="text-purple-300 text-lg" />
                    </div>
                    <Text className="text-white text-xl font-semibold">Interest Income Details</Text>
                </div>
            }
            maxWidth="95vw"
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
                <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="overflow-visible">
                        <table className="w-full">
                            <thead className="bg-white/10 border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide w-64">
                                        <div className="flex items-center space-x-2">
                                            <MdAccountBalance className="text-purple-300" />
                                            <span>Bank</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center space-x-2">
                                            <MdReceipt className="text-blue-300" />
                                            <span>Account Number</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center space-x-2">
                                            <MdReceipt className="text-indigo-300" />
                                            <span>Certificate Number</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide w-16">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdCalculate className="text-green-300" />
                                            <span>Joint</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide w-40">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdAttachMoney className="text-yellow-300" />
                                            <span>Gross Interest</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdCalculate className="text-orange-300" />
                                            <span>Contribution</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide w-24">
                                        <div className="flex items-center justify-end space-x-2">
                                            <MdReceipt className="text-red-300" />
                                            <span>AIT({Math.round(aitRate)}%)</span>
                                        </div>
                                    </th>
                                    <th className="p-2 py-4 w-8"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {interestEntries.map((entry, index) => {
                                    const gross = CalculationService.parseAndRound(entry.grossInterest);
                                    const contribution = entry.isJoint ? gross / 2 : gross;

                                    return (
                                        <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                            {/* Bank Dropdown */}
                                            <td className="px-4 py-4">
                                                <div className="relative min-w-0 max-w-64">
                                                    <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveBankDropdown(activeBankDropdown === entry.id ? null : entry.id)}
                                                            className="w-full bg-transparent text-white px-3 py-2 outline-none cursor-pointer flex items-center justify-between min-w-0 hover:bg-white/5 transition-colors duration-200"
                                                        >
                                                            <span className={`${entry.bank.name === "Select Bank" ? "text-gray-400" : "text-white"} truncate`}>
                                                                {entry.bank.name}
                                                            </span>
                                                            <IoChevronDown size={16} className="flex-shrink-0 text-gray-300" />
                                                        </button>
                                                    </div>
                                                    {activeBankDropdown === entry.id && (
                                                        <div className="absolute z-50 w-full mt-1 bg-surface-2 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
                                                            <div className="p-2 border-b border-gray-600">
                                                                <div className="relative">
                                                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search banks..."
                                                                        value={bankSearchTerm}
                                                                        onChange={(e) => setBankSearchTerm(e.target.value)}
                                                                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            </div>
                                                            {isBanksLoading ? (
                                                                <div className="py-10 flex justify-center">
                                                                    <ClipLoader color="#A78BFA" size={28} />
                                                                </div>
                                                            ) : (
                                                                filteredBanks.map(bank => (
                                                                    <button
                                                                        key={bank.id}
                                                                        onClick={() => handleBankChange(entry.id, bank)}
                                                                        className="w-full text-left px-3 py-2 hover:bg-gray-700 cursor-pointer text-white transition-colors duration-200 border-b border-gray-700 last:border-b-0"
                                                                    >
                                                                        {bank.name}
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Account Number */}
                                            <td className="p-2 py-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={entry.accountNumber}
                                                        onChange={e => updateEntry(entry.id, "accountNumber", e.target.value)}
                                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                        placeholder="Account Number"
                                                    />
                                                </div>
                                            </td>

                                            {/* Certificate Number */}
                                            <td className="p-2 py-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={entry.certificateNumber}
                                                        onChange={e => updateEntry(entry.id, "certificateNumber", e.target.value)}
                                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                                                        placeholder="Certificate Number"
                                                    />
                                                </div>
                                            </td>

                                            {/* Joint */}
                                            <td className="p-2 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={entry.isJoint}
                                                        onChange={e => updateEntry(entry.id, "isJoint", e.target.checked as unknown as string)}
                                                        className="w-5 h-5 text-green-600 bg-white/10 border border-white/20 rounded cursor-pointer focus:ring-2 focus:ring-green-400 focus:ring-offset-0"
                                                    />
                                                </div>
                                            </td>

                                            {/* Gross Interest */}
                                            <td className="p-2 py-4 text-center">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={entry.grossInterest}
                                                        onChange={e => updateEntry(entry.id, "grossInterest", e.target.value)}
                                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </td>

                                            {/* Contribution */}
                                            <td className="p-2 py-4 text-center">
                                                <div className="inline-block w-full px-3 py-2 bg-orange-400/20 border border-orange-400/30 rounded-lg">
                                                    <Text className="text-orange-300 font-semibold text-sm text-right">
                                                        {formatCurrency(contribution)}
                                                    </Text>
                                                </div>
                                            </td>

                                            {/* AIT */}
                                            <td className="p-2 py-4 text-center">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={entry.ait}
                                                        className="w-full min-w-36 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        readOnly
                                                    />
                                                </div>
                                            </td>

                                            {/* Remove Button */}
                                            <td className="px-4 py-4 text-center">
                                                {interestEntries.length > 1 && (
                                                    <button
                                                        onClick={() => removeEntry(entry.id)}
                                                        className="w-6 h-6 bg-red-400/20 hover:bg-red-400/30 text-red-300 hover:text-red-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-red-400/30"
                                                    >
                                                        <MdDelete size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot className="bg-purple-400/10 border-t-2 border-purple-400/20">
                                <tr>
                                    <td className="p-2 font-bold text-white text-lg py-4" colSpan={5}>
                                        <div className='px-3 py-2 flex items-center space-x-2'>
                                            <MdCalculate className="text-purple-300" />
                                            <span>Total</span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className='inline-block w-full px-4 py-2 bg-purple-400/20 border border-purple-400/30 rounded-lg'>
                                            <Text className="text-purple-300 font-bold text-lg">
                                                {formatCurrency(totalGrossInterest)}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className='inline-block w-full px-4 py-2 bg-purple-400/20 border border-purple-400/30 rounded-lg'>
                                            <Text className="text-purple-300 font-bold text-lg">
                                                {formatCurrency(totalAIT)}
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
                        className="bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 border border-purple-400/30"
                    >
                        Add New Entry
                    </Button>
                </Flex>
            </div>
        </Modal>
    );
};

export default Interest;
