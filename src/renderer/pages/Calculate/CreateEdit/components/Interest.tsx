import React, { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "../../../../components/Modal";
import { IoAdd, IoChevronDown } from "react-icons/io5";
import {
  MdDelete,
  MdAccountBalance,
  MdAttachMoney,
  MdCalculate,
  MdReceipt,
  MdSearch,
  MdAccountBalanceWallet,
  MdBusiness,
  MdTrendingUp,
  MdSecurity,
  MdCreditCard,
} from "react-icons/md";
import { Text, Flex } from "@radix-ui/themes";
import Button from "../../../../components/Button";
import ClearConfirmation from "./ClearConfirmation";
import { ClipLoader } from "react-spinners";
import { useBanks } from "../../../../hooks/useBanks";
import { Bank } from "../../../../../types/bank";
import { InterestIncome } from "../../../../../types/calculation";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { CalculationService } from "../../../../services/calculationService";

interface InterestProps {
  isOpen: boolean;
  onClose: () => void;
}

type InterestTabType =
  | "fd"
  | "repo"
  | "unitTrust"
  | "treasuryBill"
  | "tBond"
  | "debenture";

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
  ait: string;
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

  const [activeTab, setActiveTab] = useState<InterestTabType>("fd");
  const [fdEntries, setFdEntries] = useState<FdEntry[]>([]);
  const [repoEntries, setRepoEntries] = useState<RepoEntry[]>([]);
  const [unitTrustEntries, setUnitTrustEntries] = useState<UnitTrustEntry[]>(
    []
  );
  const [treasuryBillEntries, setTreasuryBillEntries] = useState<
    TreasuryBillEntry[]
  >([]);
  const [tBondEntries, setTBondEntries] = useState<TBondEntry[]>([]);
  const [debentureEntries, setDebentureEntries] = useState<DebentureEntry[]>(
    []
  );
  const [totalGrossInterest, setTotalGrossInterest] = useState<number>(0);
  const [totalAIT, setTotalAIT] = useState<number>(0);
  const [applyManagementFee, setApplyManagementFee] = useState(false);
  const [managementFee, setManagementFee] = useState<string>("");
  const [bankSearchTerm, setBankSearchTerm] = useState<string>("");
  const [activeBankDropdown, setActiveBankDropdown] = useState<number | null>(
    null
  );
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const { banks, loading: isBanksLoading } = useBanks();

  const interestIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome;
  const aitRate: number | undefined =
    currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitInterest;

  const filteredBanks = useMemo(
    () =>
      banks.filter((bank) =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
      ),
    [banks, bankSearchTerm]
  );

  const getCurrentEntries = useCallback(() => {
    switch (activeTab) {
      case "fd":
        return fdEntries;
      case "repo":
        return repoEntries;
      case "unitTrust":
        return unitTrustEntries;
      case "treasuryBill":
        return treasuryBillEntries;
      case "tBond":
        return tBondEntries;
      case "debenture":
        return debentureEntries;
      default:
        return fdEntries;
    }
  }, [
    activeTab,
    fdEntries,
    repoEntries,
    unitTrustEntries,
    treasuryBillEntries,
    tBondEntries,
    debentureEntries,
  ]);

  const setCurrentEntries = useCallback(
    (entries: any[]) => {
      switch (activeTab) {
        case "fd":
          setFdEntries(entries);
          break;
        case "repo":
          setRepoEntries(entries);
          break;
        case "unitTrust":
          setUnitTrustEntries(entries);
          break;
        case "treasuryBill":
          setTreasuryBillEntries(entries);
          break;
        case "tBond":
          setTBondEntries(entries);
          break;
        case "debenture":
          setDebentureEntries(entries);
          break;
      }
    },
    [activeTab]
  );

  const isDoneDisabled = useMemo(() => {
    if (activeTab === "fd") {
      if (fdEntries.length === 1) {
        return false;
      }
      return fdEntries.some(
        (entry) =>
          entry.bank.name === "Select Bank" ||
          (!entry.accountNumber && !entry.certificateNumber) ||
          entry.grossInterest === ""
      );
    } else {
      const currentEntries = getCurrentEntries();
      if (currentEntries.length === 1) {
        return false;
      }
      return currentEntries.some(
        (entry: any) =>
          !entry.companyName || !entry.certificateNumber || entry.value === ""
      );
    }
  }, [activeTab, fdEntries, getCurrentEntries]);

  const getDefaultFdEntry = useCallback(
    (): FdEntry => ({
      id: 1,
      bank: { name: "Select Bank", tinNumber: "" },
      accountNumber: "",
      certificateNumber: "",
      isJoint: false,
      grossInterest: "",
      ait: "",
    }),
    []
  );

  const getDefaultRepoEntry = useCallback(
    (): RepoEntry => ({
      id: 1,
      companyName: "",
      certificateNumber: "",
      value: "",
      ait: 0,
    }),
    []
  );

  const getDefaultUnitTrustEntry = useCallback(
    (): UnitTrustEntry => ({
      id: 1,
      companyName: "",
      certificateNumber: "",
      value: "",
      ait: 0,
    }),
    []
  );

  const getDefaultTreasuryBillEntry = useCallback(
    (): TreasuryBillEntry => ({
      id: 1,
      companyName: "",
      certificateNumber: "",
      value: "",
      ait: 0,
    }),
    []
  );

  const getDefaultTBondEntry = useCallback(
    (): TBondEntry => ({
      id: 1,
      companyName: "",
      certificateNumber: "",
      value: "",
      ait: 0,
    }),
    []
  );

  const getDefaultDebentureEntry = useCallback(
    (): DebentureEntry => ({
      id: 1,
      companyName: "",
      certificateNumber: "",
      value: "",
      ait: 0,
    }),
    []
  );

  const clearAllEntries = useCallback(() => {
    switch (activeTab) {
      case "fd":
        setFdEntries([getDefaultFdEntry()]);
        break;
      case "repo":
        setRepoEntries([getDefaultRepoEntry()]);
        break;
      case "unitTrust":
        setUnitTrustEntries([getDefaultUnitTrustEntry()]);
        break;
      case "treasuryBill":
        setTreasuryBillEntries([getDefaultTreasuryBillEntry()]);
        break;
      case "tBond":
        setTBondEntries([getDefaultTBondEntry()]);
        break;
      case "debenture":
        setDebentureEntries([getDefaultDebentureEntry()]);
        break;
    }
  }, [
    activeTab,
    getDefaultFdEntry,
    getDefaultRepoEntry,
    getDefaultUnitTrustEntry,
    getDefaultTreasuryBillEntry,
    getDefaultTBondEntry,
    getDefaultDebentureEntry,
  ]);

  const handleConfirmClear = useCallback(() => {
    clearAllEntries();
    setShowClearConfirmation(false);
  }, [clearAllEntries]);

  const handleCancelClear = useCallback(() => {
    setShowClearConfirmation(false);
  }, []);

  const calculateTotals = useCallback(() => {
    let grossTotal = 0;
    let aitTotal = 0;

    fdEntries.forEach((entry) => {
      const gross = CalculationService.parseAndRound(entry.grossInterest);
      const contribution = entry.isJoint ? gross / 2 : gross;
      grossTotal += contribution;
      aitTotal += CalculationService.parseAndRound(entry.ait);
    });

    [
      repoEntries,
      unitTrustEntries,
      treasuryBillEntries,
      tBondEntries,
      debentureEntries,
    ].forEach((entries) => {
      entries.forEach((entry) => {
        const value = CalculationService.parseAndRound(entry.value);
        const aitAmount = CalculationService.parseAndRound(
          (value * aitRate) / 100
        );
        entry.ait = aitAmount;
        grossTotal += value;
        aitTotal += aitAmount;
      });
    });

    const fee = applyManagementFee
      ? CalculationService.parseAndRound(managementFee)
      : 0;

    return {
      grossTotal: CalculationService.parseAndRound(
        Math.max(0, grossTotal - fee)
      ),
      aitTotal: CalculationService.parseAndRound(aitTotal),
    };
  }, [
    fdEntries,
    repoEntries,
    unitTrustEntries,
    treasuryBillEntries,
    tBondEntries,
    debentureEntries,
    aitRate,
    applyManagementFee,
    managementFee,
  ]);

  useEffect(() => {
    const { grossTotal, aitTotal } = calculateTotals();
    setTotalGrossInterest(grossTotal);
    setTotalAIT(aitTotal);
  }, [calculateTotals]);

  const formatCurrency = useCallback(
    (amount: number) => CalculationService.formatCurrency(amount),
    []
  );
  const roundToTwoDecimals = useCallback(
    (amount: number) => CalculationService.roundToTwoDecimals(amount),
    []
  );

  const updateEntry = useCallback(
    (id: number, field: string, value: any) => {
      if (activeTab === "fd") {
        if (field === "grossInterest" || field === "ait") {
          if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
          const parts = value.split(".");
          if (parts[1] && parts[1].length > 2) return;
        }

        setFdEntries((prev) => {
          const updatedEntries = prev.map((entry) => {
            if (entry.id === id) {
              const updatedEntry = { ...entry, [field]: value };

              if (field === "grossInterest" || field === "isJoint") {
                const gross = CalculationService.parseAndRound(
                  updatedEntry.grossInterest
                );
                const contribution = updatedEntry.isJoint ? gross / 2 : gross;
                const aitAmount = CalculationService.parseAndRound(
                  (contribution * aitRate) / 100
                );
                updatedEntry.ait = aitAmount.toString();
              }

              return updatedEntry;
            }
            return entry;
          });
          return updatedEntries;
        });
      } else {
        if (field === "value") {
          if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
          const parts = value.split(".");
          if (parts[1] && parts[1].length > 2) return;
        }

        const currentEntries = getCurrentEntries();
        const updatedEntries = currentEntries.map((entry) => {
          if (entry.id === id) {
            const updatedEntry = { ...entry, [field]: value };

            if (field === "value" && "value" in updatedEntry) {
              const valueAmount = CalculationService.parseAndRound(
                updatedEntry.value
              );
              const aitAmount = CalculationService.parseAndRound(
                (valueAmount * aitRate) / 100
              );
              updatedEntry.ait = aitAmount;
            }

            return updatedEntry;
          }
          return entry;
        });
        setCurrentEntries(updatedEntries);
      }
    },
    [activeTab, setCurrentEntries, getCurrentEntries, aitRate]
  );

  const handleBankChange = useCallback((id: number, bank: Bank) => {
    setFdEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, bank: { name: bank.name, tinNumber: bank.tinNumber } }
          : entry
      )
    );
    setActiveBankDropdown(null);
    setBankSearchTerm("");
  }, []);

  const addNewEntry = useCallback(() => {
    if (activeTab === "fd") {
      const newId = fdEntries.length
        ? Math.max(...fdEntries.map((e) => e.id)) + 1
        : 1;

      const lastEntry = fdEntries[fdEntries.length - 1];
      const defaultBank = { name: "Select Bank", tinNumber: "" };
      const selectedBank =
        lastEntry?.bank.name !== "Select Bank" ? lastEntry.bank : defaultBank;

      setFdEntries((prev) => [
        ...prev,
        {
          id: newId,
          bank: selectedBank,
          accountNumber: "",
          certificateNumber: "",
          isJoint: false,
          grossInterest: "",
          ait: "",
        },
      ]);
    } else {
      const currentEntries = getCurrentEntries();
      const newId = currentEntries.length
        ? Math.max(...currentEntries.map((e) => e.id)) + 1
        : 1;

      const newEntry = {
        id: newId,
        companyName: "",
        certificateNumber: "",
        value: "",
        ait: 0,
      };

      setCurrentEntries([...currentEntries, newEntry]);
    }
  }, [activeTab, fdEntries, getCurrentEntries, setCurrentEntries]);

  const removeEntry = useCallback(
    (id: number) => {
      if (activeTab === "fd") {
        if (fdEntries.length > 1) {
          setFdEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
      } else {
        const currentEntries = getCurrentEntries();
        if (currentEntries.length > 1) {
          setCurrentEntries(currentEntries.filter((entry) => entry.id !== id));
        }
      }
    },
    [activeTab, fdEntries, getCurrentEntries, setCurrentEntries]
  );

  const handleDone = useCallback(() => {
    const totalGrossInterestValue =
      CalculationService.parseAndRound(totalGrossInterest);
    const totalAitValue = CalculationService.parseAndRound(totalAIT);
    const managementFeeValue = applyManagementFee
      ? CalculationService.parseAndRound(managementFee)
      : 0;

    if (totalGrossInterest === 0 && managementFeeValue === 0) {
      updateInterestIncome(null);
      onClose();
      return;
    }

    const fdTotal = fdEntries.reduce((sum, entry) => {
      const gross = CalculationService.parseAndRound(entry.grossInterest);
      const contribution = entry.isJoint ? gross / 2 : gross;
      return sum + contribution;
    }, 0);
    const repoTotal = repoEntries.reduce(
      (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
      0
    );
    const unitTrustTotal = unitTrustEntries.reduce(
      (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
      0
    );
    const treasuryBillTotal = treasuryBillEntries.reduce(
      (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
      0
    );
    const tBondTotal = tBondEntries.reduce(
      (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
      0
    );
    const debentureTotal = debentureEntries.reduce(
      (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
      0
    );

    if (
      fdTotal +
        repoTotal +
        unitTrustTotal +
        treasuryBillTotal +
        tBondTotal +
        debentureTotal ===
      0
    ) {
      updateInterestIncome(null);
      onClose();
      return;
    }

    const interestIncome: InterestIncome = {
      totalGrossInterest: totalGrossInterestValue,
      totalAit: totalAitValue,
      applyManagementFee,
      managementFee: managementFeeValue,
      fdIncome:
        fdTotal > 0
          ? {
              total: roundToTwoDecimals(fdTotal),
              ait: fdEntries.reduce(
                (sum, entry) =>
                  sum + CalculationService.parseAndRound(entry.ait),
                0
              ),
              incomes: fdEntries.map((e) => {
                const gross = CalculationService.parseAndRound(e.grossInterest);
                const contribution = e.isJoint ? gross / 2 : gross;
                return {
                  bank: e.bank,
                  accountNumber: e.accountNumber,
                  certificateNumber: e.certificateNumber,
                  isJoint: e.isJoint,
                  grossInterest: CalculationService.parseAndRound(gross),
                  contribution: CalculationService.parseAndRound(contribution),
                  ait: CalculationService.parseAndRound(e.ait),
                };
              }),
            }
          : null,
      repoIncome:
        repoTotal > 0
          ? {
              total: roundToTwoDecimals(repoTotal),
              ait: repoEntries.reduce((sum, entry) => sum + entry.ait, 0),
              incomes: repoEntries.map((e) => ({
                companyName: e.companyName,
                certificateNumber: e.certificateNumber,
                value: CalculationService.parseAndRound(e.value),
                ait: CalculationService.parseAndRound(e.ait),
              })),
            }
          : null,
      unitTrustIncome:
        unitTrustTotal > 0
          ? {
              total: roundToTwoDecimals(unitTrustTotal),
              ait: unitTrustEntries.reduce((sum, entry) => sum + entry.ait, 0),
              incomes: unitTrustEntries.map((e) => ({
                companyName: e.companyName,
                certificateNumber: e.certificateNumber,
                value: CalculationService.parseAndRound(e.value),
                ait: CalculationService.parseAndRound(e.ait),
              })),
            }
          : null,
      treasuryBillIncome:
        treasuryBillTotal > 0
          ? {
              total: roundToTwoDecimals(treasuryBillTotal),
              ait: treasuryBillEntries.reduce(
                (sum, entry) => sum + entry.ait,
                0
              ),
              incomes: treasuryBillEntries.map((e) => ({
                companyName: e.companyName,
                certificateNumber: e.certificateNumber,
                value: CalculationService.parseAndRound(e.value),
                ait: CalculationService.parseAndRound(e.ait),
              })),
            }
          : null,
      tBondIncome:
        tBondTotal > 0
          ? {
              total: roundToTwoDecimals(tBondTotal),
              ait: tBondEntries.reduce((sum, entry) => sum + entry.ait, 0),
              incomes: tBondEntries.map((e) => ({
                companyName: e.companyName,
                certificateNumber: e.certificateNumber,
                value: CalculationService.parseAndRound(e.value),
                ait: CalculationService.parseAndRound(e.ait),
              })),
            }
          : null,
      debentureIncome:
        debentureTotal > 0
          ? {
              total: roundToTwoDecimals(debentureTotal),
              ait: debentureEntries.reduce((sum, entry) => sum + entry.ait, 0),
              incomes: debentureEntries.map((e) => ({
                companyName: e.companyName,
                certificateNumber: e.certificateNumber,
                value: CalculationService.parseAndRound(e.value),
                ait: CalculationService.parseAndRound(e.ait),
              })),
            }
          : null,
    };
    updateInterestIncome(interestIncome);
    onClose();
  }, [
    fdEntries,
    repoEntries,
    unitTrustEntries,
    treasuryBillEntries,
    tBondEntries,
    debentureEntries,
    totalGrossInterest,
    totalAIT,
    applyManagementFee,
    managementFee,
    roundToTwoDecimals,
    updateInterestIncome,
    onClose,
  ]);

  useEffect(() => {
    if (isOpen && interestIncome) {
      if (interestIncome.fdIncome?.incomes) {
        const fdEntries = interestIncome.fdIncome.incomes.map(
          (income, index) => ({
            id: index + 1,
            bank: income.bank,
            accountNumber: income.accountNumber || "",
            certificateNumber: income.certificateNumber || "",
            isJoint: income.isJoint,
            grossInterest: income.grossInterest.toString(),
            ait: income.ait.toString(),
          })
        );
        setFdEntries(fdEntries.length > 0 ? fdEntries : [getDefaultFdEntry()]);
      } else {
        setFdEntries([getDefaultFdEntry()]);
      }

      setRepoEntries(
        interestIncome.repoIncome?.incomes?.map((income, index) => ({
          id: index + 1,
          companyName: income.companyName,
          certificateNumber: income.certificateNumber,
          value: income.value.toString(),
          ait: income.ait,
        })) || [getDefaultRepoEntry()]
      );

      setUnitTrustEntries(
        interestIncome.unitTrustIncome?.incomes?.map((income, index) => ({
          id: index + 1,
          companyName: income.companyName,
          certificateNumber: income.certificateNumber,
          value: income.value.toString(),
          ait: income.ait,
        })) || [getDefaultUnitTrustEntry()]
      );

      setTreasuryBillEntries(
        interestIncome.treasuryBillIncome?.incomes?.map((income, index) => ({
          id: index + 1,
          companyName: income.companyName,
          certificateNumber: income.certificateNumber,
          value: income.value.toString(),
          ait: income.ait,
        })) || [getDefaultTreasuryBillEntry()]
      );

      setTBondEntries(
        interestIncome.tBondIncome?.incomes?.map((income, index) => ({
          id: index + 1,
          companyName: income.companyName,
          certificateNumber: income.certificateNumber,
          value: income.value.toString(),
          ait: income.ait,
        })) || [getDefaultTBondEntry()]
      );

      setDebentureEntries(
        interestIncome.debentureIncome?.incomes?.map((income, index) => ({
          id: index + 1,
          companyName: income.companyName,
          certificateNumber: income.certificateNumber,
          value: income.value.toString(),
          ait: income.ait,
        })) || [getDefaultDebentureEntry()]
      );

      setApplyManagementFee(interestIncome.applyManagementFee ?? false);
      setManagementFee(
        interestIncome.managementFee
          ? interestIncome.managementFee.toString()
          : ""
      );
    } else if (isOpen && !interestIncome) {
      setFdEntries([getDefaultFdEntry()]);
      setRepoEntries([getDefaultRepoEntry()]);
      setUnitTrustEntries([getDefaultUnitTrustEntry()]);
      setTreasuryBillEntries([getDefaultTreasuryBillEntry()]);
      setTBondEntries([getDefaultTBondEntry()]);
      setDebentureEntries([getDefaultDebentureEntry()]);
      setApplyManagementFee(false);
      setManagementFee("");
    }
  }, [
    isOpen,
    interestIncome,
    getDefaultFdEntry,
    getDefaultRepoEntry,
    getDefaultUnitTrustEntry,
    getDefaultTreasuryBillEntry,
    getDefaultTBondEntry,
    getDefaultDebentureEntry,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/20">
            <MdAccountBalance className="text-lg text-purple-300" />
          </div>
          <Text className="text-xl font-semibold text-white">
            Interest Income Details
          </Text>
        </div>
      }
      maxWidth="95vw"
      isDark={true}
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "secondary",
          className: "bg-gray-600 hover:bg-gray-700 text-white",
        },
        {
          label: "Done",
          onClick: handleDone,
          variant: "primary",
          disabled: isDoneDisabled,
          className: isDoneDisabled ? "opacity-50 cursor-not-allowed" : "",
        },
      ]}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex space-x-1">
            <button
              onClick={() => setActiveTab("fd")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "fd"
                  ? "border border-orange-400/30 bg-orange-400/20 text-orange-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdAccountBalanceWallet className="text-lg" />
              <span>Fixed Deposit</span>
            </button>
            <button
              onClick={() => setActiveTab("repo")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "repo"
                  ? "border border-blue-400/30 bg-blue-400/20 text-blue-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdBusiness className="text-lg" />
              <span>Repo</span>
            </button>
            <button
              onClick={() => setActiveTab("unitTrust")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "unitTrust"
                  ? "border border-green-400/30 bg-green-400/20 text-green-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdTrendingUp className="text-lg" />
              <span>Unit Trust</span>
            </button>
            <button
              onClick={() => setActiveTab("treasuryBill")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "treasuryBill"
                  ? "border border-yellow-400/30 bg-yellow-400/20 text-yellow-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdSecurity className="text-lg" />
              <span>Treasury Bill</span>
            </button>
            <button
              onClick={() => setActiveTab("tBond")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "tBond"
                  ? "border border-indigo-400/30 bg-indigo-400/20 text-indigo-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdCreditCard className="text-lg" />
              <span>T-Bond</span>
            </button>
            <button
              onClick={() => setActiveTab("debenture")}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                activeTab === "debenture"
                  ? "border border-red-400/30 bg-red-400/20 text-red-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MdReceipt className="text-lg" />
              <span>Debenture</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="rounded-xl border border-white/10 bg-white/5">
            <div className="overflow-visible">
              {activeTab === "fd" && (
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
              {activeTab === "repo" && (
                <OtherTable
                  entries={repoEntries}
                  aitRate={aitRate}
                  updateEntry={updateEntry}
                  removeEntry={removeEntry}
                  formatCurrency={formatCurrency}
                  type="repo"
                />
              )}
              {activeTab === "unitTrust" && (
                <OtherTable
                  entries={unitTrustEntries}
                  aitRate={aitRate}
                  updateEntry={updateEntry}
                  removeEntry={removeEntry}
                  formatCurrency={formatCurrency}
                  type="unitTrust"
                />
              )}
              {activeTab === "treasuryBill" && (
                <OtherTable
                  entries={treasuryBillEntries}
                  aitRate={aitRate}
                  updateEntry={updateEntry}
                  removeEntry={removeEntry}
                  formatCurrency={formatCurrency}
                  type="treasuryBill"
                />
              )}
              {activeTab === "tBond" && (
                <OtherTable
                  entries={tBondEntries}
                  aitRate={aitRate}
                  updateEntry={updateEntry}
                  removeEntry={removeEntry}
                  formatCurrency={formatCurrency}
                  type="tBond"
                />
              )}
              {activeTab === "debenture" && (
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
            onClick={() => setShowClearConfirmation(true)}
            icon={MdDelete}
            size="sm"
            variant="secondary"
            className="mr-2 border border-red-400/30 bg-red-400/20 text-red-300 hover:bg-red-400/30"
          >
            Clear All
          </Button>
          <Button
            onClick={addNewEntry}
            icon={IoAdd}
            size="sm"
            variant="secondary"
            className="border border-purple-400/30 bg-purple-400/20 text-purple-300 hover:bg-purple-400/30"
          >
            Add New Entry
          </Button>
        </Flex>

        {/* Management Fee */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-400/15">
                <MdAccountBalanceWallet className="text-lg text-purple-300" />
              </div>

              <div>
                <Text className="mr-4 text-sm font-semibold text-white">
                  Management Fee
                </Text>
                <Text className="mt-0.5 text-xs text-gray-400">
                  Deduct the management fee from the gross interest income
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label
                htmlFor="applyManagementFee"
                className="flex cursor-pointer select-none items-center gap-2.5"
              >
                <input
                  type="checkbox"
                  id="applyManagementFee"
                  checked={applyManagementFee}
                  onChange={(e) => setApplyManagementFee(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-purple-400"
                />
                <span className="text-sm text-gray-300">Apply Fee</span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {CalculationService.formatCurrency(0).replace(
                    /[0-9.,\s]/g,
                    ""
                  )}
                </span>

                <input
                  type="text"
                  value={managementFee}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^\d*\.?\d{0,2}$/)) {
                      setManagementFee(value);
                    }
                  }}
                  disabled={!applyManagementFee}
                  className="w-44 rounded-lg border border-white/20 bg-white/10 py-2.5 pl-8 pr-3 text-right text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/40 disabled:cursor-not-allowed disabled:opacity-40"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="rounded-xl border border-white/20 bg-white/5 p-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <MdCalculate className="text-sm text-white" />
              </div>
              <Text className="text-sm font-semibold text-white">
                Interest Income Summary
              </Text>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-lg border border-purple-400/20 bg-purple-400/10 px-4 py-3">
                <MdAttachMoney className="text-lg text-purple-300" />
                <div className="flex items-center gap-3 text-right">
                  <Text className="text-sm font-medium text-purple-300">
                    Gross Interest
                  </Text>
                  <Text className="text-xl font-bold text-purple-200">
                    {formatCurrency(totalGrossInterest)}
                  </Text>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border border-blue-400/20 bg-blue-400/10 px-4 py-3">
                <MdReceipt className="text-lg text-blue-300" />
                <div className="flex items-center gap-3 text-right">
                  <Text className="text-sm font-medium text-blue-300">
                    Total AIT
                  </Text>
                  <Text className="text-xl font-bold text-blue-200">
                    {formatCurrency(totalAIT)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClearConfirmation
        open={showClearConfirmation}
        title="Clear Interest Income"
        description={`Are you sure you want to clear all ${
          activeTab === "fd"
            ? "Fixed Deposit"
            : activeTab === "repo"
              ? "Repo"
              : activeTab === "unitTrust"
                ? "Unit Trust"
                : activeTab === "treasuryBill"
                  ? "Treasury Bill"
                  : activeTab === "tBond"
                    ? "T-Bond"
                    : "Debenture"
        } entries? This will remove all rows in this tab.`}
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
      />
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

const FdTable: React.FC<FdTableProps> = React.memo(
  ({
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
    formatCurrency,
  }) => {
    const totals = useMemo(() => {
      const contributionTotal = entries.reduce((sum, entry) => {
        const gross = CalculationService.parseAndRound(entry.grossInterest);
        const contribution = entry.isJoint ? gross / 2 : gross;
        return sum + contribution;
      }, 0);

      const aitTotal = entries.reduce(
        (sum, entry) => sum + CalculationService.parseAndRound(entry.ait),
        0
      );

      return { contributionTotal, aitTotal };
    }, [entries]);

    return (
      <table className="w-full">
        <thead className="border-b border-white/10 bg-white/10">
          <tr>
            <th className="w-64 px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center space-x-2">
                <MdAccountBalance className="text-purple-300" />
                <span>Bank</span>
              </div>
            </th>
            <th className="p-2 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center space-x-2">
                <MdReceipt className="text-blue-300" />
                <span>Account Number</span>
              </div>
            </th>
            <th className="p-2 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center space-x-2">
                <MdReceipt className="text-indigo-300" />
                <span>Certificate Number</span>
              </div>
            </th>
            <th className="w-16 p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <MdCalculate className="text-green-300" />
                <span>Joint</span>
              </div>
            </th>
            <th className="w-40 p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <MdAttachMoney className="text-yellow-300" />
                <span>Gross Interest</span>
              </div>
            </th>
            <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <MdCalculate className="text-orange-300" />
                <span>Contribution</span>
              </div>
            </th>
            <th className="w-24 p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-end space-x-2">
                <MdReceipt className="text-red-300" />
                <span>AIT({aitRate}%)</span>
              </div>
            </th>
            <th className="w-8 p-2 py-4"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {entries.map((entry, index) => {
            const gross = CalculationService.parseAndRound(entry.grossInterest);
            const contribution = entry.isJoint ? gross / 2 : gross;

            return (
              <tr
                key={entry.id}
                className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
              >
                {/* Bank Dropdown */}
                <td className="px-4 py-4">
                  <div className="relative min-w-0 max-w-64">
                    <div className="overflow-hidden rounded-lg border border-white/20 bg-white/10">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveBankDropdown(
                            activeBankDropdown === entry.id ? null : entry.id
                          )
                        }
                        className="flex w-full min-w-0 cursor-pointer items-center justify-between bg-transparent px-3 py-2 text-white outline-none transition-colors duration-200 hover:bg-white/5"
                      >
                        <span
                          className={`${entry.bank.name === "Select Bank" ? "text-gray-400" : "text-white"} truncate`}
                        >
                          {entry.bank.name}
                        </span>
                        <IoChevronDown
                          size={16}
                          className="flex-shrink-0 text-gray-300"
                        />
                      </button>
                    </div>
                    {activeBankDropdown === entry.id && (
                      <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-600 bg-surface-2 shadow-xl">
                        <div className="border-b border-gray-600 p-2">
                          <div className="relative">
                            <MdSearch
                              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                              size={16}
                            />
                            <input
                              type="text"
                              placeholder="Search banks..."
                              value={bankSearchTerm}
                              onChange={(e) =>
                                setBankSearchTerm(e.target.value)
                              }
                              className="w-full rounded-md border border-gray-600 bg-gray-700 py-2 pl-10 pr-3 text-white placeholder-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400"
                              autoFocus
                            />
                          </div>
                        </div>
                        {isBanksLoading ? (
                          <div className="flex justify-center py-10">
                            <ClipLoader color="#A78BFA" size={28} />
                          </div>
                        ) : (
                          filteredBanks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => handleBankChange(entry.id, bank)}
                              className="w-full cursor-pointer border-b border-gray-700 px-3 py-2 text-left text-white transition-colors duration-200 last:border-b-0 hover:bg-gray-700"
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
                      onChange={(e) =>
                        updateEntry(entry.id, "accountNumber", e.target.value)
                      }
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      onChange={(e) =>
                        updateEntry(
                          entry.id,
                          "certificateNumber",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                      onChange={(e) =>
                        updateEntry(entry.id, "isJoint", e.target.checked)
                      }
                      className="h-5 w-5 cursor-pointer rounded border border-white/20 bg-white/10 text-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-0"
                    />
                  </div>
                </td>

                {/* Gross Interest */}
                <td className="p-2 py-4 text-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={entry.grossInterest}
                      onChange={(e) =>
                        updateEntry(entry.id, "grossInterest", e.target.value)
                      }
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="0.00"
                    />
                  </div>
                </td>

                {/* Contribution */}
                <td className="p-2 py-4 text-center">
                  <div className="inline-block w-full rounded-lg border border-orange-400/30 bg-orange-400/20 px-3 py-2">
                    <Text className="text-right text-sm font-semibold text-orange-300">
                      {formatCurrency(contribution)}
                    </Text>
                  </div>
                </td>

                {/* AIT */}
                <td className="p-2 py-4 text-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={entry.ait}
                      onChange={(e) =>
                        updateEntry(entry.id, "ait", e.target.value)
                      }
                      className="w-full min-w-36 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="0.00"
                    />
                  </div>
                </td>

                {/* Remove Button */}
                <td className="px-4 py-4 text-center">
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-red-400/30 bg-red-400/20 text-red-300 transition-all duration-200 hover:scale-110 hover:bg-red-400/30 hover:text-red-200"
                    >
                      <MdDelete size={14} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-white/20 bg-white/10">
          <tr>
            <td className="p-2 py-4 text-lg font-bold text-white" colSpan={5}>
              <div className="flex items-center space-x-2 px-3 py-2">
                <MdCalculate className="text-orange-300" />
                <span>Total</span>
              </div>
            </td>
            <td className="p-2 text-center">
              <div className="inline-block w-full rounded-lg border border-orange-400/30 bg-orange-400/20 px-4 py-2">
                <Text className="text-lg font-bold text-orange-300">
                  {formatCurrency(totals.contributionTotal)}
                </Text>
              </div>
            </td>
            <td className="p-2 text-center">
              <div className="inline-block w-full rounded-lg border border-orange-400/30 bg-orange-400/20 px-4 py-2">
                <Text className="text-lg font-bold text-orange-300">
                  {formatCurrency(totals.aitTotal)}
                </Text>
              </div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    );
  }
);

interface OtherTableProps {
  entries:
    | RepoEntry[]
    | UnitTrustEntry[]
    | TreasuryBillEntry[]
    | TBondEntry[]
    | DebentureEntry[];
  aitRate: number;
  updateEntry: (id: number, field: string, value: any) => void;
  removeEntry: (id: number) => void;
  formatCurrency: (amount: number) => string;
  type: "repo" | "unitTrust" | "treasuryBill" | "tBond" | "debenture";
}

const OtherTable: React.FC<OtherTableProps> = React.memo(
  ({ entries, aitRate, updateEntry, removeEntry, formatCurrency, type }) => {
    const getTotalColor = useCallback(() => {
      if (type === "repo")
        return "bg-blue-400/20 text-blue-300 border border-blue-400/30";
      if (type === "unitTrust")
        return "bg-green-400/20 text-green-300 border border-green-400/30";
      if (type === "treasuryBill")
        return "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30";
      if (type === "tBond")
        return "bg-indigo-400/20 text-indigo-300 border border-indigo-400/30";
      if (type === "debenture")
        return "bg-red-400/20 text-red-300 border border-red-400/30";
    }, [type]);

    const getIconColor = useCallback(() => {
      if (type === "repo") return "text-blue-300";
      if (type === "unitTrust") return "text-green-300";
      if (type === "treasuryBill") return "text-yellow-300";
      if (type === "tBond") return "text-indigo-300";
      if (type === "debenture") return "text-red-300";
    }, [type]);

    const totals = useMemo(() => {
      const valueTotal = entries.reduce(
        (sum, entry) => sum + CalculationService.parseAndRound(entry.value),
        0
      );
      const aitTotal = entries.reduce((sum, entry) => sum + entry.ait, 0);
      return { valueTotal, aitTotal };
    }, [entries]);

    return (
      <table className="w-full">
        <thead className="border-b border-white/10 bg-white/10">
          <tr>
            <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center space-x-2">
                <MdBusiness className="text-blue-300" />
                <span>Company Name</span>
              </div>
            </th>
            <th className="p-2 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center space-x-2">
                <MdReceipt className="text-indigo-300" />
                <span>Certificate Number</span>
              </div>
            </th>
            <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <MdAttachMoney className="text-yellow-300" />
                <span>Value</span>
              </div>
            </th>
            <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
              <div className="flex items-center justify-end space-x-2">
                <MdReceipt className="text-red-300" />
                <span>AIT({aitRate}%)</span>
              </div>
            </th>
            <th className="w-8 p-2 py-4"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
            >
              {/* Company Name */}
              <td className="px-4 py-4">
                <div className="relative">
                  <input
                    type="text"
                    value={entry.companyName}
                    onChange={(e) =>
                      updateEntry(entry.id, "companyName", e.target.value)
                    }
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    onChange={(e) =>
                      updateEntry(entry.id, "certificateNumber", e.target.value)
                    }
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    onChange={(e) =>
                      updateEntry(entry.id, "value", e.target.value)
                    }
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    className="w-full min-w-36 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
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
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-red-400/30 bg-red-400/20 text-red-300 transition-all duration-200 hover:scale-110 hover:bg-red-400/30 hover:text-red-200"
                  >
                    <MdDelete size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-white/20 bg-white/10">
          <tr>
            <td className="p-2 py-4 text-lg font-bold text-white" colSpan={2}>
              <div className="flex items-center space-x-2 px-3 py-2">
                <MdCalculate className={getIconColor()} />
                <span>Total</span>
              </div>
            </td>
            <td className="p-2 text-end">
              <div
                className={`inline-block w-full px-6 py-2 ${getTotalColor()} rounded-lg`}
              >
                <Text className="text-lg font-bold">
                  {formatCurrency(totals.valueTotal)}
                </Text>
              </div>
            </td>
            <td className="p-2 text-end">
              <div
                className={`inline-block w-full px-6 py-2 ${getTotalColor()} rounded-lg`}
              >
                <Text className="text-lg font-bold">
                  {formatCurrency(totals.aitTotal)}
                </Text>
              </div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    );
  }
);

export default Interest;
