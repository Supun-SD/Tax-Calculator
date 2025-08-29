import React, { useState, useEffect, useMemo } from 'react';
import Modal from "../../../../components/Modal";
import { IoAdd, IoChevronDown } from "react-icons/io5";
import { MdDelete, MdAccountBalance, MdAttachMoney, MdCalculate, MdReceipt, MdSearch, MdAccountBalanceWallet, MdBusiness, MdTrendingUp, MdSecurity, MdCreditCard } from "react-icons/md";
import { Text, Flex } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { ClipLoader } from 'react-spinners';
import { useBanks } from '../../../../hooks/useBanks';
import { Bank } from '../../../../../types/bank';
import { InterestIncome } from '../../../../../types/calculation';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { CalculationService } from '../../../../services/calculationService';

interface InterestProps {
    isOpen: boolean;
    onClose: () => void;
}

type InterestTabType = 'fd' | 'repo' | 'unitTrust' | 'treasuryBill' | 'tBond' | 'debenture';

interface FdEntry {
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

interface RepoEntry {
    id: number;
    companyName: string;
    certificateNumber: string;
    value: string;
    ait: number;
}

interface UnitTrustEntry {
    id: number;
    companyName: string;
    certificateNumber: string;
    value: string;
    ait: number;
}

interface TreasuryBillEntry {
    id: number;
    companyName: string;
    certificateNumber: string;
    value: string;
    ait: number;
}

interface TBondEntry {
    id: number;
    companyName: string;
    certificateNumber: string;
    value: string;
    ait: number;
}

interface DebentureEntry {
    id: number;
    companyName: string;
    certificateNumber: string;
    value: string;
    ait: number;
}

const Interest: React.FC<InterestProps> = ({ isOpen, onClose }) => {
    const { currentCalculation, updateInterestIncome } = useCalculationContext();

    const [activeTab, setActiveTab] = useState<InterestTabType>('fd');
    const [fdEntries, setFdEntries] = useState<FdEntry[]>([]);
    const [repoEntries, setRepoEntries] = useState<RepoEntry[]>([]);
    const [unitTrustEntries, setUnitTrustEntries] = useState<UnitTrustEntry[]>([]);
    const [treasuryBillEntries, setTreasuryBillEntries] = useState<TreasuryBillEntry[]>([]);
    const [tBondEntries, setTBondEntries] = useState<TBondEntry[]>([]);
    const [debentureEntries, setDebentureEntries] = useState<DebentureEntry[]>([]);
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

    const getCurrentEntries = () => {
        switch (activeTab) {
            case 'fd': return fdEntries;
            case 'repo': return repoEntries;
            case 'unitTrust': return unitTrustEntries;
            case 'treasuryBill': return treasuryBillEntries;
            case 'tBond': return tBondEntries;
            case 'debenture': return debentureEntries;
            default: return fdEntries;
        }
    };

    const setCurrentEntries = (entries: any[]) => {
        switch (activeTab) {
            case 'fd': setFdEntries(entries); break;
            case 'repo': setRepoEntries(entries); break;
            case 'unitTrust': setUnitTrustEntries(entries); break;
            case 'treasuryBill': setTreasuryBillEntries(entries); break;
            case 'tBond': setTBondEntries(entries); break;
            case 'debenture': setDebentureEntries(entries); break;
        }
    };

    const isDoneDisabled = useMemo(() => {
        if (activeTab === 'fd') {
            return fdEntries.some(entry =>
                entry.bank.name === "Select Bank" ||
                (!entry.accountNumber && !entry.certificateNumber) ||
                entry.grossInterest === ""
            );
        } else {
            const currentEntries = getCurrentEntries();
            return currentEntries.some((entry: any) =>
                !entry.companyName ||
                !entry.certificateNumber ||
                entry.value === ""
            );
        }
    }, [activeTab, fdEntries, repoEntries, unitTrustEntries, treasuryBillEntries, tBondEntries, debentureEntries]);

    useEffect(() => {
        if (isOpen && interestIncome) {
            if (interestIncome.fdIncome?.incomes) {
                const fdEntries = interestIncome.fdIncome.incomes.map((income, index) => ({
                    id: index + 1,
                    bank: income.bank,
                    accountNumber: income.accountNumber || "",
                    certificateNumber: income.certificateNumber || "",
                    isJoint: income.isJoint,
                    grossInterest: income.grossInterest.toString(),
                    ait: income.ait
                }));
                setFdEntries(fdEntries.length > 0 ? fdEntries : [getDefaultFdEntry()]);
            } else {
                setFdEntries([getDefaultFdEntry()]);
            }

            setRepoEntries(interestIncome.repoIncome?.incomes?.map((income, index) => ({
                id: index + 1,
                companyName: income.companyName,
                certificateNumber: income.certificateNumber,
                value: income.value.toString(),
                ait: income.ait
            })) || [getDefaultRepoEntry()]);

            setUnitTrustEntries(interestIncome.unitTrustIncome?.incomes?.map((income, index) => ({
                id: index + 1,
                companyName: income.companyName,
                certificateNumber: income.certificateNumber,
                value: income.value.toString(),
                ait: income.ait
            })) || [getDefaultUnitTrustEntry()]);

            setTreasuryBillEntries(interestIncome.treasuryBillIncome?.incomes?.map((income, index) => ({
                id: index + 1,
                companyName: income.companyName,
                certificateNumber: income.certificateNumber,
                value: income.value.toString(),
                ait: income.ait
            })) || [getDefaultTreasuryBillEntry()]);

            setTBondEntries(interestIncome.tBondIncome?.incomes?.map((income, index) => ({
                id: index + 1,
                companyName: income.companyName,
                certificateNumber: income.certificateNumber,
                value: income.value.toString(),
                ait: income.ait
            })) || [getDefaultTBondEntry()]);

            setDebentureEntries(interestIncome.debentureIncome?.incomes?.map((income, index) => ({
                id: index + 1,
                companyName: income.companyName,
                certificateNumber: income.certificateNumber,
                value: income.value.toString(),
                ait: income.ait
            })) || [getDefaultDebentureEntry()]);
        } else if (isOpen && !interestIncome) {
            setFdEntries([getDefaultFdEntry()]);
            setRepoEntries([getDefaultRepoEntry()]);
            setUnitTrustEntries([getDefaultUnitTrustEntry()]);
            setTreasuryBillEntries([getDefaultTreasuryBillEntry()]);
            setTBondEntries([getDefaultTBondEntry()]);
            setDebentureEntries([getDefaultDebentureEntry()]);
        }
    }, [isOpen, interestIncome]);

    const getDefaultFdEntry = (): FdEntry => ({
        id: 1,
        bank: { name: "Select Bank", tinNumber: "" },
        accountNumber: "",
        certificateNumber: "",
        isJoint: false,
        grossInterest: "",
        ait: 0
    });

    const getDefaultRepoEntry = (): RepoEntry => ({
        id: 1,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0
    });

    const getDefaultUnitTrustEntry = (): UnitTrustEntry => ({
        id: 1,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0
    });

    const getDefaultTreasuryBillEntry = (): TreasuryBillEntry => ({
        id: 1,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0
    });

    const getDefaultTBondEntry = (): TBondEntry => ({
        id: 1,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0
    });

    const getDefaultDebentureEntry = (): DebentureEntry => ({
        id: 1,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0
    });

    useEffect(() => {
        let grossTotal = 0;
        let aitTotal = 0;

        fdEntries.forEach(entry => {
            const gross = CalculationService.parseAndRound(entry.grossInterest);
            const contribution = entry.isJoint ? gross / 2 : gross;
            const aitAmount = CalculationService.parseAndRound((contribution * aitRate) / 100);
            entry.ait = aitAmount;
            grossTotal += contribution;
            aitTotal += aitAmount;
        });

        [repoEntries, unitTrustEntries, treasuryBillEntries, tBondEntries, debentureEntries].forEach(entries => {
            entries.forEach(entry => {
                const value = CalculationService.parseAndRound(entry.value);
                const aitAmount = CalculationService.parseAndRound((value * aitRate) / 100);
                entry.ait = aitAmount;
                grossTotal += value;
                aitTotal += aitAmount;
            });
        });

        setTotalGrossInterest(CalculationService.parseAndRound(grossTotal));
        setTotalAIT(CalculationService.parseAndRound(aitTotal));
    }, [fdEntries, repoEntries, unitTrustEntries, treasuryBillEntries, tBondEntries, debentureEntries, aitRate]);

    const formatCurrency = (amount: number) => CalculationService.formatCurrency(amount);

    const roundToTwoDecimals = (amount: number) => CalculationService.roundToTwoDecimals(amount);

    const updateEntry = (id: number, field: string, value: any) => {
        if (activeTab === 'fd') {
            if (field === "grossInterest") {
                if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
                const parts = value.split(".");
                if (parts[1] && parts[1].length > 2) return;
            }

            setFdEntries(prev =>
                prev.map(entry => (entry.id === id ? { ...entry, [field]: value } : entry))
            );
        } else {
            if (field === "value") {
                if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
                const parts = value.split(".");
                if (parts[1] && parts[1].length > 2) return;
            }

            setCurrentEntries(
                getCurrentEntries().map(entry => (entry.id === id ? { ...entry, [field]: value } : entry))
            );
        }
    };

    const handleBankChange = (id: number, bank: Bank) => {
        setFdEntries(prev =>
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
        if (activeTab === 'fd') {
            const newId = fdEntries.length
                ? Math.max(...fdEntries.map(e => e.id)) + 1
                : 1;

            const lastEntry = fdEntries[fdEntries.length - 1];
            const defaultBank = { name: "Select Bank", tinNumber: "" };
            const selectedBank =
                lastEntry?.bank.name !== "Select Bank" ? lastEntry.bank : defaultBank;

            setFdEntries(prev => [
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
        } else {
            const currentEntries = getCurrentEntries();
            const newId = currentEntries.length
                ? Math.max(...currentEntries.map(e => e.id)) + 1
                : 1;

            const newEntry = {
                id: newId,
                companyName: "",
                certificateNumber: "",
                value: "",
                ait: 0
            };

            setCurrentEntries([...currentEntries, newEntry]);
        }
    };

    const removeEntry = (id: number) => {
        if (activeTab === 'fd') {
            if (fdEntries.length > 1) {
                setFdEntries(prev => prev.filter(entry => entry.id !== id));
            }
        } else {
            const currentEntries = getCurrentEntries();
            if (currentEntries.length > 1) {
                setCurrentEntries(currentEntries.filter(entry => entry.id !== id));
            }
        }
    };

    const handleDone = () => {
        const fdTotal = fdEntries.reduce((sum, entry) => {
            const gross = CalculationService.parseAndRound(entry.grossInterest);
            const contribution = entry.isJoint ? gross / 2 : gross;
            return sum + contribution;
        }, 0);
        const repoTotal = repoEntries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0);
        const unitTrustTotal = unitTrustEntries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0);
        const treasuryBillTotal = treasuryBillEntries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0);
        const tBondTotal = tBondEntries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0);
        const debentureTotal = debentureEntries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0);

        const interestIncome: InterestIncome = {
            totalGrossInterest: CalculationService.parseAndRound(totalGrossInterest),
            totalAit: CalculationService.parseAndRound(totalAIT),
            fdIncome: fdTotal > 0 ? {
                total: roundToTwoDecimals(fdTotal),
                ait: fdEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: fdEntries.map(e => {
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
            } : null,
            repoIncome: repoTotal > 0 ? {
                total: roundToTwoDecimals(repoTotal),
                ait: repoEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: repoEntries.map(e => ({
                    companyName: e.companyName,
                    certificateNumber: e.certificateNumber,
                    value: CalculationService.parseAndRound(e.value),
                    ait: CalculationService.parseAndRound(e.ait)
                }))
            } : null,
            unitTrustIncome: unitTrustTotal > 0 ? {
                total: roundToTwoDecimals(unitTrustTotal),
                ait: unitTrustEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: unitTrustEntries.map(e => ({
                    companyName: e.companyName,
                    certificateNumber: e.certificateNumber,
                    value: CalculationService.parseAndRound(e.value),
                    ait: CalculationService.parseAndRound(e.ait)
                }))
            } : null,
            treasuryBillIncome: treasuryBillTotal > 0 ? {
                total: roundToTwoDecimals(treasuryBillTotal),
                ait: treasuryBillEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: treasuryBillEntries.map(e => ({
                    companyName: e.companyName,
                    certificateNumber: e.certificateNumber,
                    value: CalculationService.parseAndRound(e.value),
                    ait: CalculationService.parseAndRound(e.ait)
                }))
            } : null,
            tBondIncome: tBondTotal > 0 ? {
                total: roundToTwoDecimals(tBondTotal),
                ait: tBondEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: tBondEntries.map(e => ({
                    companyName: e.companyName,
                    certificateNumber: e.certificateNumber,
                    value: CalculationService.parseAndRound(e.value),
                    ait: CalculationService.parseAndRound(e.ait)
                }))
            } : null,
            debentureIncome: debentureTotal > 0 ? {
                total: roundToTwoDecimals(debentureTotal),
                ait: debentureEntries.reduce((sum, entry) => sum + entry.ait, 0),
                incomes: debentureEntries.map(e => ({
                    companyName: e.companyName,
                    certificateNumber: e.certificateNumber,
                    value: CalculationService.parseAndRound(e.value),
                    ait: CalculationService.parseAndRound(e.ait)
                }))
            } : null
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
                {/* Tab Navigation */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="flex space-x-1 mb-4">
                        <button
                            onClick={() => setActiveTab('fd')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'fd'
                                ? 'bg-orange-400/20 text-orange-300 border border-orange-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdAccountBalanceWallet className="text-lg" />
                            <span>Fixed Deposit</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('repo')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'repo'
                                ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdBusiness className="text-lg" />
                            <span>Repo</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('unitTrust')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'unitTrust'
                                ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdTrendingUp className="text-lg" />
                            <span>Unit Trust</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('treasuryBill')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'treasuryBill'
                                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdSecurity className="text-lg" />
                            <span>Treasury Bill</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('tBond')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'tBond'
                                ? 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdCreditCard className="text-lg" />
                            <span>T-Bond</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('debenture')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'debenture'
                                ? 'bg-red-400/20 text-red-300 border border-red-400/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MdReceipt className="text-lg" />
                            <span>Debenture</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white/5 rounded-xl border border-white/10">
                        <div className="overflow-visible">
                            {activeTab === 'fd' && (
                                <FdTable
                                    entries={fdEntries}
                                    aitRate={aitRate}
                                    bankSearchTerm={bankSearchTerm}
                                    setBankSearchTerm={setBankSearchTerm}
                                    activeBankDropdown={activeBankDropdown}
                                    setActiveBankDropdown={setActiveBankDropdown}
                                    isBanksLoading={isBanksLoading}
                                    filteredBanks={filteredBanks}
                                    handleBankChange={handleBankChange}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                />
                            )}
                            {activeTab === 'repo' && (
                                <OtherTable
                                    entries={repoEntries}
                                    aitRate={aitRate}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                    type="repo"
                                />
                            )}
                            {activeTab === 'unitTrust' && (
                                <OtherTable
                                    entries={unitTrustEntries}
                                    aitRate={aitRate}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                    type="unitTrust"
                                />
                            )}
                            {activeTab === 'treasuryBill' && (
                                <OtherTable
                                    entries={treasuryBillEntries}
                                    aitRate={aitRate}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                    type="treasuryBill"
                                />
                            )}
                            {activeTab === 'tBond' && (
                                <OtherTable
                                    entries={tBondEntries}
                                    aitRate={aitRate}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                    type="tBond"
                                />
                            )}
                            {activeTab === 'debenture' && (
                                <OtherTable
                                    entries={debentureEntries}
                                    aitRate={aitRate}
                                    updateEntry={updateEntry}
                                    removeEntry={removeEntry}
                                    formatCurrency={formatCurrency}
                                    type="debenture"
                                />
                            )}
                        </div>
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

                {/* Total Summary */}
                <div className="bg-white/5 rounded-xl border border-white/20 p-4 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                <MdCalculate className="text-white text-sm" />
                            </div>
                            <Text className="text-white font-semibold text-sm">Interest Income Summary</Text>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-4 py-3 bg-purple-400/10 border border-purple-400/20 rounded-lg">
                                <MdAttachMoney className="text-purple-300 text-lg" />
                                <div className="text-right flex items-center gap-3">
                                    <Text className="text-purple-300 text-sm font-medium">Gross Interest</Text>
                                    <Text className="text-purple-200 font-bold text-xl">
                                        {formatCurrency(totalGrossInterest)}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 px-4 py-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                                <MdReceipt className="text-blue-300 text-lg" />
                                <div className="text-right flex items-center gap-3">
                                    <Text className="text-blue-300 text-sm font-medium">Total AIT</Text>
                                    <Text className="text-blue-200 font-bold text-xl">
                                        {formatCurrency(totalAIT)}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

interface FdTableProps {
    entries: FdEntry[];
    aitRate: number;
    bankSearchTerm: string;
    setBankSearchTerm: (term: string) => void;
    activeBankDropdown: number | null;
    setActiveBankDropdown: (id: number | null) => void;
    isBanksLoading: boolean;
    filteredBanks: Bank[];
    handleBankChange: (id: number, bank: Bank) => void;
    updateEntry: (id: number, field: string, value: any) => void;
    removeEntry: (id: number) => void;
    formatCurrency: (amount: number) => string;
}

const FdTable: React.FC<FdTableProps> = ({
    entries,
    aitRate,
    bankSearchTerm,
    setBankSearchTerm,
    activeBankDropdown,
    setActiveBankDropdown,
    isBanksLoading,
    filteredBanks,
    handleBankChange,
    updateEntry,
    removeEntry,
    formatCurrency
}) => {
    return (
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
                {entries.map((entry, index) => {
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
                                        onChange={e => updateEntry(entry.id, "isJoint", e.target.checked)}
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
                                        className="w-full min-w-36 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        readOnly
                                    />
                                </div>
                            </td>

                            {/* Remove Button */}
                            <td className="px-4 py-4 text-center">
                                {entries.length > 1 && (
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
            <tfoot className="bg-white/10 border-t-2 border-white/20">
                <tr>
                    <td className="p-2 font-bold text-white text-lg py-4" colSpan={5}>
                        <div className='px-3 py-2 flex items-center space-x-2'>
                            <MdCalculate className="text-orange-300" />
                            <span>Total</span>
                        </div>
                    </td>
                    <td className="p-2 text-center">
                        <div className='inline-block w-full px-4 py-2 bg-orange-400/20 border border-orange-400/30 rounded-lg'>
                            <Text className="text-orange-300 font-bold text-lg">
                                {formatCurrency(entries.reduce((sum, entry) => {
                                    const gross = CalculationService.parseAndRound(entry.grossInterest);
                                    const contribution = entry.isJoint ? gross / 2 : gross;
                                    return sum + contribution;
                                }, 0))}
                            </Text>
                        </div>
                    </td>
                    <td className="p-2 text-center">
                        <div className='inline-block w-full px-4 py-2 bg-orange-400/20 border border-orange-400/30 rounded-lg'>
                            <Text className="text-orange-300 font-bold text-lg">
                                {formatCurrency(entries.reduce((sum, entry) => sum + entry.ait, 0))}
                            </Text>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    );
};

interface OtherTableProps {
    entries: RepoEntry[] | UnitTrustEntry[] | TreasuryBillEntry[] | TBondEntry[] | DebentureEntry[];
    aitRate: number;
    updateEntry: (id: number, field: string, value: any) => void;
    removeEntry: (id: number) => void;
    formatCurrency: (amount: number) => string;
    type: 'repo' | 'unitTrust' | 'treasuryBill' | 'tBond' | 'debenture';
}

const OtherTable: React.FC<OtherTableProps> = ({
    entries,
    aitRate,
    updateEntry,
    removeEntry,
    formatCurrency,
    type
}) => {
    const getTotalColor = () => {
        if (type === 'repo') return 'bg-blue-400/20 text-blue-300 border border-blue-400/30';
        if (type === 'unitTrust') return 'bg-green-400/20 text-green-300 border border-green-400/30';
        if (type === 'treasuryBill') return 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30';
        if (type === 'tBond') return 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30';
        if (type === 'debenture') return 'bg-red-400/20 text-red-300 border border-red-400/30';
    }

    const getIconColor = () => {
        if (type === 'repo') return 'text-blue-300';
        if (type === 'unitTrust') return 'text-green-300';
        if (type === 'treasuryBill') return 'text-yellow-300';
        if (type === 'tBond') return 'text-indigo-300';
        if (type === 'debenture') return 'text-red-300';
    }

    return (
        <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
                <tr>
                    <th className="px-4 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                        <div className="flex items-center space-x-2">
                            <MdBusiness className="text-blue-300" />
                            <span>Company Name</span>
                        </div>
                    </th>
                    <th className="p-2 py-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wide">
                        <div className="flex items-center space-x-2">
                            <MdReceipt className="text-indigo-300" />
                            <span>Certificate Number</span>
                        </div>
                    </th>
                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                        <div className="flex items-center justify-center space-x-2">
                            <MdAttachMoney className="text-yellow-300" />
                            <span>Value</span>
                        </div>
                    </th>
                    <th className="p-2 py-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wide">
                        <div className="flex items-center justify-end space-x-2">
                            <MdReceipt className="text-red-300" />
                            <span>AIT({Math.round(aitRate)}%)</span>
                        </div>
                    </th>
                    <th className="p-2 py-4 w-8"></th>
                </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
                {entries.map((entry, index) => (
                    <tr key={entry.id} className={`hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                        {/* Company Name */}
                        <td className="px-4 py-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={entry.companyName}
                                    onChange={e => updateEntry(entry.id, "companyName", e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Company Name"
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

                        {/* Value */}
                        <td className="p-2 py-4 text-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={entry.value}
                                    onChange={e => updateEntry(entry.id, "value", e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
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
                            {entries.length > 1 && (
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
            <tfoot className="bg-white/10 border-t-2 border-white/20">
                <tr>
                    <td className="p-2 font-bold text-white text-lg py-4" colSpan={2}>
                        <div className='px-3 py-2 flex items-center space-x-2'>
                            <MdCalculate className={getIconColor()} />
                            <span>Total</span>
                        </div>
                    </td>
                    <td className="p-2 text-end">
                        <div className={`inline-block w-full px-6 py-2 ${getTotalColor()} rounded-lg`}>
                            <Text className="font-bold text-lg">
                                {formatCurrency(entries.reduce((sum, entry) => sum + CalculationService.parseAndRound(entry.value), 0))}
                            </Text>
                        </div>
                    </td>
                    <td className="p-2 text-end">
                        <div className={`inline-block w-full px-6 py-2 ${getTotalColor()} rounded-lg`}>
                            <Text className="font-bold text-lg">
                                {formatCurrency(entries.reduce((sum, entry) => sum + entry.ait, 0))}
                            </Text>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    );
};

export default Interest;
