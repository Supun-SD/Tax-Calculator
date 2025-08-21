import React, { useState, useEffect } from 'react';
import Modal from "../../../components/Modal";
import { settings } from '../../../../../mockdata/settings';
import { IoAdd, IoClose, IoChevronDown } from "react-icons/io5";
import Button from '../../../components/Button';
import { Bank } from 'src/types/bank';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

interface InterestProps {
    isOpen: boolean;
    onClose: () => void;
}

interface InterestEntry {
    id: number;
    bankId: number;
    accountNumber: string;
    certificateNumber: string;
    isJoint: boolean;
    grossInterest: number;
    ait: number;
}

const Interest: React.FC<InterestProps> = ({ isOpen, onClose }) => {
    const [interestEntries, setInterestEntries] = useState<InterestEntry[]>([
        {
            id: 1,
            bankId: 0,
            accountNumber: "",
            certificateNumber: "",
            isJoint: false,
            grossInterest: 0,
            ait: 0
        }
    ]);

    const [banks, setBanks] = useState<Bank[]>([]);
    const [isBanksLoading, setIsBanksLoading] = useState<boolean>(false);
    const [totalGrossInterest, setTotalGrossInterest] = useState<number>(0);
    const [totalAIT, setTotalAIT] = useState<number>(0);
    const [bankSearchTerm, setBankSearchTerm] = useState<string>("");
    const [activeBankDropdown, setActiveBankDropdown] = useState<number | null>(null);

    useEffect(() => {

        const fetchBanks = async () => {
            setIsBanksLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/bank');
                setBanks(response.data.data);
            } catch (error) {
                console.error('Error fetching banks:', error);
            } finally {
                setIsBanksLoading(false);
            }
        };
        fetchBanks();

        const totalGross = interestEntries.reduce((sum, entry) => {
            // If joint account, add only half of the gross interest
            const contribution = entry.isJoint ? entry.grossInterest / 2 : entry.grossInterest;
            return sum + contribution;
        }, 0);

        const totalAITAmount = interestEntries.reduce((sum, entry) => {
            // If joint account, add only half of the AIT
            const contribution = entry.isJoint ? entry.ait / 2 : entry.ait;
            return sum + contribution;
        }, 0);

        setTotalGrossInterest(totalGross);
        setTotalAIT(totalAITAmount);
    }, [interestEntries]);

    const handleBankChange = (id: number, bankId: number) => {
        setInterestEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, bankId } : entry
        ));
        setActiveBankDropdown(null);
        setBankSearchTerm("");
    };

    const handleAccountNumberChange = (id: number, value: string) => {
        setInterestEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, accountNumber: value } : entry
        ));
    };

    const handleCertificateNumberChange = (id: number, value: string) => {
        setInterestEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, certificateNumber: value } : entry
        ));
    };

    const handleJointChange = (id: number, isJoint: boolean) => {
        setInterestEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, isJoint } : entry
        ));
    };

    const handleGrossInterestChange = (id: number, value: string) => {
        // Allow empty string
        if (value === '') {
            setInterestEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, grossInterest: 0, ait: 0 } : entry
            ));
            return;
        }

        // Only allow numbers and decimal point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanValue.split('.');
        if (parts.length > 2) return;

        // Limit decimal places to 2
        if (parts[1] && parts[1].length > 2) return;

        // If ends with '.' → keep as is (don't parse yet)
        if (cleanValue.endsWith('.')) {
            setInterestEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, grossInterest: cleanValue as unknown as number, ait: 0 } : entry
            ));
            return;
        }

        // Parse when it's a complete number
        const numValue = parseFloat(cleanValue);
        if (isNaN(numValue)) return;

        const roundedValue = Math.round(numValue * 100) / 100;
        const aitAmount = Math.round((roundedValue * settings.reliefsAndAit.aitInterest) / 100 * 100) / 100;

        setInterestEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, grossInterest: roundedValue, ait: aitAmount } : entry
        ));
    };


    const addNewEntry = () => {
        const newId = Math.max(...interestEntries.map(entry => entry.id)) + 1;
        // Get the bank from the last entry if it exists and has a bank selected
        const lastEntry = interestEntries[interestEntries.length - 1];
        const defaultBankId = lastEntry && lastEntry.bankId > 0 ? lastEntry.bankId : 0;

        const newEntry: InterestEntry = {
            id: newId,
            bankId: defaultBankId,
            accountNumber: "",
            certificateNumber: "",
            isJoint: false,
            grossInterest: 0,
            ait: 0
        };
        setInterestEntries(prev => [...prev, newEntry]);
    };

    const removeEntry = (id: number) => {
        if (interestEntries.length > 1) {
            setInterestEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const getBankName = (bankId: number) => {
        const bank = banks.find(b => b.id === bankId);
        return bank ? bank.name : "";
    };

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );

    const handleDone = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Interest Income"
            maxWidth="90vw"
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
                },
            ]}
        >
            <div className="space-y-6">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1.8fr_2.7fr_auto_1.4fr_1.4fr] gap-2 text-sm font-medium text-gray-700">
                    <div>Bank</div>
                    <div>Account Number</div>
                    <div>Certificate Number</div>
                    <div className="text-center w-12">Joint</div>
                    <div className='text-end'>Gross Interest</div>
                    <div className='text-end pr-8'>AIT</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-2">
                    {interestEntries.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-[2fr_1.8fr_2.7fr_auto_1.4fr_1.4fr] gap-2">
                            {/* Bank Dropdown */}
                            <div className="relative min-w-0"> {/* min-w-0 is important */}
                                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveBankDropdown(activeBankDropdown === entry.id ? null : entry.id);
                                            setBankSearchTerm("");
                                        }}
                                        className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none cursor-pointer flex items-center justify-between min-w-0"
                                    >
                                        <span
                                            className={`${entry.bankId === 0 ? "text-gray-400" : "text-gray-800"} truncate`}
                                        >
                                            {entry.bankId === 0 ? "Select Bank" : getBankName(entry.bankId)}
                                        </span>
                                        <IoChevronDown size={16} className="flex-shrink-0" />
                                    </button>
                                </div>

                                {/* Dropdown */}
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
                                        {isBanksLoading ? <div className="py-10 justify-center flex">
                                            <ClipLoader color="gray" size={28} />
                                        </div> : (

                                            <div className="max-h-50 overflow-y-auto">
                                                {filteredBanks.map((bank) => (
                                                    <button
                                                        key={bank.id}
                                                        onClick={() => handleBankChange(entry.id, bank.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {bank.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Account Number */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="text"
                                    value={entry.accountNumber}
                                    onChange={(e) => handleAccountNumberChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                    placeholder="Account Number"
                                />
                            </div>

                            {/* Certificate Number */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="text"
                                    value={entry.certificateNumber}
                                    onChange={(e) => handleCertificateNumberChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none"
                                    placeholder="Certificate Number"
                                />
                            </div>

                            {/* Joint Checkbox */}
                            <div className="flex items-center justify-center w-12">
                                <input
                                    type="checkbox"
                                    checked={entry.isJoint}
                                    onChange={(e) => handleJointChange(entry.id, e.target.checked)}
                                    className="w-5 h-5 text-blue-600 bg-white border border-gray-300 rounded cursor-pointer"
                                />
                            </div>

                            {/* Gross Interest */}
                            <div className="bg-white rounded-lg border border-gray-300">
                                <input
                                    type="text"
                                    value={entry.grossInterest === 0 ? "" : entry.grossInterest.toString()}
                                    onChange={(e) => handleGrossInterestChange(entry.id, e.target.value)}
                                    className="w-full bg-transparent text-gray-800 px-3 py-2 outline-none text-right"
                                    placeholder="0.00"
                                />
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
                                    <IoClose size={16} color='red' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                    <Button onClick={addNewEntry} icon={IoAdd} size='sm' className='px-6'>
                        Add
                    </Button>
                </div>

                {/* Totals Display */}
                <div className="flex justify-end gap-4">
                    <div className="bg-white rounded-lg px-8 py-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total Gross Interest</div>
                            <div className="text-xl font-bold text-gray-800">
                                {formatCurrency(totalGrossInterest)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg px-8 py-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total AIT</div>
                            <div className="text-xl font-bold text-gray-800">
                                {formatCurrency(totalAIT)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Interest;
