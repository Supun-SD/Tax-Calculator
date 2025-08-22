import React, { useState, useEffect, useMemo } from 'react';
import Modal from "../../../components/Modal";
import { IoAdd, IoClose, IoChevronDown } from "react-icons/io5";
import Button from '../../../components/Button';
import { ClipLoader } from 'react-spinners';
import { useBanks } from '../../../hooks/useBanks';
import { Bank } from '../../../../types/bank';
import { useSettingsContext } from '../../../contexts/SettingsContext';
import { InterestIncome } from '../../../../types/calculation';
import { useCalculationContext } from '../../../contexts/CalculationContext';
import { CalculationService } from '../../../services/calculationService';

interface InterestProps {
    isOpen: boolean;
    onClose: () => void;
}

interface InterestEntry {
    id: number;
    bank: Bank;
    accountNumber: string;
    certificateNumber: string;
    isJoint: boolean;
    grossInterest: string;
    ait: number;
}

const Interest: React.FC<InterestProps> = ({ isOpen, onClose }) => {
    const { settings } = useSettingsContext();
    const { interestIncome, setInterestIncome } = useCalculationContext();

    const [interestEntries, setInterestEntries] = useState<InterestEntry[]>([
        {
            id: 1,
            bank: { id: 0, name: "Select Bank", tinNumber: "", createdAt: "", updatedAt: "" },
            accountNumber: "",
            certificateNumber: "",
            isJoint: false,
            grossInterest: "",
            ait: 0
        }
    ]);

    const [totalGrossInterest, setTotalGrossInterest] = useState<number>(0);
    const [totalAIT, setTotalAIT] = useState<number>(0);
    const [bankSearchTerm, setBankSearchTerm] = useState<string>("");
    const [activeBankDropdown, setActiveBankDropdown] = useState<number | null>(null);

    const { banks, loading: isBanksLoading } = useBanks();

    // Load existing data when modal opens
    useEffect(() => {
        if (isOpen && interestIncome) {
            const entries = interestIncome.incomes.map((income, index) => ({
                id: index + 1,
                bank: income.bank,
                accountNumber: income.accountNumber || "",
                certificateNumber: income.certificateNumber || "",
                isJoint: income.isJoint,
                grossInterest: income.grossInterest.toString(),
                ait: income.ait
            }));
            setInterestEntries(entries.length > 0 ? entries : [{
                id: 1,
                bank: { id: 0, name: "Select Bank", tinNumber: "", createdAt: "", updatedAt: "" },
                accountNumber: "",
                certificateNumber: "",
                isJoint: false,
                grossInterest: "",
                ait: 0
            }]);
        } else if (isOpen && !interestIncome) {
            setInterestEntries([{
                id: 1,
                bank: { id: 0, name: "Select Bank", tinNumber: "", createdAt: "", updatedAt: "" },
                accountNumber: "",
                certificateNumber: "",
                isJoint: false,
                grossInterest: "",
                ait: 0
            }]);
        }
    }, [isOpen, interestIncome]);

    // Calculate totals and update AIT per entry
    useEffect(() => {
        let grossTotal = 0;
        let aitTotal = 0;

        interestEntries.forEach(entry => {
            const gross = CalculationService.parseAndRound(entry.grossInterest);
            const contribution = entry.isJoint ? gross / 2 : gross;
            const aitAmount = CalculationService.parseAndRound((contribution * settings.reliefsAndAit.aitInterest) / 100);

            entry.ait = aitAmount;
            grossTotal += contribution;
            aitTotal += aitAmount;
        });

        setTotalGrossInterest(CalculationService.parseAndRound(grossTotal));
        setTotalAIT(CalculationService.parseAndRound(aitTotal));
    }, [interestEntries, settings.reliefsAndAit.aitInterest]);

    const formatCurrency = (amount: number) =>
        CalculationService.formatCurrency(amount);

    const updateEntry = (id: number, field: keyof InterestEntry, value: string) => {
        if (field === "grossInterest") {
            if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
            const parts = value.split(".");
            if (parts[1] && parts[1].length > 2) return;
        }

        setInterestEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry)
        );
    };

    const handleBankChange = (id: number, bank: Bank) => {
        setInterestEntries(prev =>
            prev.map(entry => entry.id === id ? { ...entry, bank } : entry)
        );
        setActiveBankDropdown(null);
        setBankSearchTerm("");
    };

    const addNewEntry = () => {
        const newId = interestEntries.length ? Math.max(...interestEntries.map(e => e.id)) + 1 : 1;
        const lastEntry = interestEntries[interestEntries.length - 1];
        const defaultBank = { id: 0, name: "Select Bank", tinNumber: "", createdAt: "", updatedAt: "" };
        const selectedBank = lastEntry?.bank.id ? lastEntry.bank : defaultBank;

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

    const filteredBanks = banks.filter(bank => bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()));

    const isDoneDisabled = useMemo(() => {
        return interestEntries.some(entry =>
            entry.bank.id === 0 ||
            (!entry.accountNumber && !entry.certificateNumber) ||
            entry.grossInterest === ""
        );
    }, [interestEntries]);

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
        setInterestIncome(interestIncome);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Interest Income"
            maxWidth="90vw"
            actions={[
                { label: 'Cancel', onClick: onClose, variant: 'secondary', className: 'bg-gray-300 text-black hover:bg-gray-400' },
                { label: 'Done', onClick: handleDone, variant: 'primary', disabled: isDoneDisabled }
            ]}
        >
            <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1.8fr_2.7fr_auto_1.4fr_1.4fr_1.4fr] gap-2 text-sm font-medium text-gray-700">
                    <div>Bank</div>
                    <div>Account Number</div>
                    <div>Certificate Number</div>
                    <div className="text-center w-12">Joint</div>
                    <div className='text-end'>Gross Interest</div>
                    <div className='text-end'>Contribution</div>
                    <div className='text-end pr-8'>AIT({Math.round(settings.reliefsAndAit.aitInterest)}%)</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-2">
                    {interestEntries.map(entry => {
                        const gross = CalculationService.parseAndRound(entry.grossInterest);
                        const contribution = entry.isJoint ? gross / 2 : gross;

                        return (
                            <div key={entry.id} className="grid grid-cols-[2fr_1.8fr_2.7fr_auto_1.4fr_1.4fr_1.4fr] gap-2">
                                {/* Bank Dropdown */}
                                <div className="relative min-w-0">
                                    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setActiveBankDropdown(activeBankDropdown === entry.id ? null : entry.id)}
                                            className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none cursor-pointer flex items-center justify-between min-w-0"
                                        >
                                            <span className={`${entry.bank.id === 0 ? "text-gray-400" : "text-gray-800"} truncate`}>
                                                {entry.bank.name}
                                            </span>
                                            <IoChevronDown size={16} className="flex-shrink-0" />
                                        </button>
                                    </div>
                                    {activeBankDropdown === entry.id && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="p-2 border-b border-gray-200">
                                                <input
                                                    type="text"
                                                    placeholder="Search banks..."
                                                    value={bankSearchTerm}
                                                    onChange={(e) => setBankSearchTerm(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            {isBanksLoading ? (
                                                <div className="py-10 flex justify-center">
                                                    <ClipLoader color="gray" size={28} />
                                                </div>
                                            ) : (
                                                filteredBanks.map(bank => (
                                                    <button
                                                        key={bank.id}
                                                        onClick={() => handleBankChange(entry.id, bank)}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {bank.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Account Number */}
                                <div className="bg-white rounded-lg border border-gray-300">
                                    <input
                                        type="text"
                                        value={entry.accountNumber}
                                        onChange={e => updateEntry(entry.id, "accountNumber", e.target.value)}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                        placeholder="Account Number"
                                    />
                                </div>

                                {/* Certificate Number */}
                                <div className="bg-white rounded-lg border border-gray-300">
                                    <input
                                        type="text"
                                        value={entry.certificateNumber}
                                        onChange={e => updateEntry(entry.id, "certificateNumber", e.target.value)}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                        placeholder="Certificate Number"
                                    />
                                </div>

                                {/* Joint */}
                                <div className="flex items-center justify-center w-12">
                                    <input
                                        type="checkbox"
                                        checked={entry.isJoint}
                                        onChange={e => updateEntry(entry.id, "isJoint", e.target.checked as unknown as string)}
                                        className="w-5 h-5 text-blue-600 bg-white border border-gray-300 rounded cursor-pointer"
                                    />
                                </div>

                                {/* Gross Interest */}
                                <div className="bg-white rounded-lg border border-gray-300">
                                    <input
                                        type="text"
                                        value={entry.grossInterest}
                                        onChange={e => updateEntry(entry.id, "grossInterest", e.target.value)}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Contribution */}
                                <div className="bg-gray-50 rounded-lg border border-gray-300 text-right px-3 py-2">
                                    {formatCurrency(contribution)}
                                </div>

                                {/* AIT */}
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-lg border border-gray-300 flex-1">
                                        <input
                                            type="number"
                                            value={entry.ait}
                                            className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            readOnly
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeEntry(entry.id)}
                                        className="text-gray-600 hover:text-gray-800 p-1"
                                        disabled={interestEntries.length === 1}
                                    >
                                        <IoClose size={16} color="red" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size="sm" className="px-6">Add</Button>
                </div>

                {/* Totals */}
                <div className="flex justify-end gap-4">
                    <div className="bg-white rounded-lg px-8 py-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total Gross Interest</div>
                            <div className="text-xl font-bold text-gray-800">{formatCurrency(totalGrossInterest)}</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg px-8 py-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total AIT</div>
                            <div className="text-xl font-bold text-gray-800">{formatCurrency(totalAIT)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Interest;
