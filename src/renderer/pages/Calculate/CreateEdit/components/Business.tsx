import React, { useMemo, useState, useEffect } from "react";
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import {
  MdDelete,
  MdBusiness,
  MdAttachMoney,
  MdCalculate,
  MdReceipt,
  MdLocalHospital,
} from "react-icons/md";
import { Text, Flex } from "@radix-ui/themes";
import Button from "../../../../components/Button";
import ClearConfirmation from "./ClearConfirmation";
import { BusinessIncome } from "../../../../../types/calculation";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { CalculationService } from "../../../../services/calculationService";

interface BusinessProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BusinessEntry {
  id: number;
  hospital: string;
  amount: string;
  wht: string;
  hasWht: boolean;
}

const Business: React.FC<BusinessProps> = ({ isOpen, onClose }) => {
  const { currentCalculation, updateBusinessIncome } = useCalculationContext();
  const [businessEntries, setBusinessEntries] = useState<BusinessEntry[]>([]);
  const [taxablePercentage, setTaxablePercentage] = useState<string>("");
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const businessIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.businessIncome;

  useEffect(() => {
    if (isOpen && businessIncome) {
      const entries = businessIncome.incomes.map(
        (income: any, index: number) => ({
          id: index + 1,
          hospital: income.hospitalName,
          amount: income.value.toString(),
          wht: income.wht.toString(),
          hasWht: income.wht > 0,
        })
      );
      setBusinessEntries(
        entries.length > 0
          ? entries
          : [{ id: 1, hospital: "", amount: "", wht: "0", hasWht: false }]
      );
      setTaxablePercentage(
        (100 - businessIncome.assessableIncomePercentage).toString()
      );
    } else if (isOpen && !businessIncome) {
      setBusinessEntries([
        { id: 1, hospital: "", amount: "", wht: "0", hasWht: false },
      ]);
      setTaxablePercentage("");
    }
  }, [isOpen, businessIncome]);

  const formatCurrency = (amount: number) =>
    CalculationService.formatCurrency(amount);

  const updateEntry = (
    id: number,
    field: keyof BusinessEntry,
    value: string
  ) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setBusinessEntries((prev) =>
        prev.map((entry) => {
          if (entry.id === id) {
            const updatedEntry = { ...entry, [field]: value };
            // If amount is being updated and WHT is enabled, recalculate WHT
            if (field === "amount" && entry.hasWht && value) {
              const grossAmount = CalculationService.parseAndRound(value);
              const whtAmount = CalculationService.parseAndRound(
                (grossAmount * 5) / 100
              );
              updatedEntry.wht = whtAmount.toString();
            }
            return updatedEntry;
          }
          return entry;
        })
      );
    }
  };

  const handleWhtToggle = (id: number, hasWht: boolean) => {
    setBusinessEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const newEntry = { ...entry, hasWht };
          if (hasWht && entry.amount) {
            // Calculate 5% of the gross amount
            const grossAmount = CalculationService.parseAndRound(entry.amount);
            const whtAmount = CalculationService.parseAndRound(
              (grossAmount * 5) / 100
            );
            newEntry.wht = whtAmount.toString();
          } else if (!hasWht) {
            newEntry.wht = "0";
          }
          return newEntry;
        }
        return entry;
      })
    );
  };

  const handleHospitalChange = (id: number, value: string) => {
    setBusinessEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, hospital: value } : entry
      )
    );
  };

  const handleTaxablePercentageChange = (value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setTaxablePercentage(value);
    }
  };

  const addNewEntry = () => {
    const newId = businessEntries.length
      ? Math.max(...businessEntries.map((e) => e.id)) + 1
      : 1;
    setBusinessEntries((prev) => [
      ...prev,
      { id: newId, hospital: "", amount: "", wht: "0", hasWht: false },
    ]);
  };

  const removeEntry = (id: number) => {
    if (businessEntries.length > 1)
      setBusinessEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const clearAllEntries = () => {
    setBusinessEntries([
      { id: 1, hospital: "", amount: "", wht: "0", hasWht: false },
    ]);
    setTaxablePercentage("");
    updateBusinessIncome(null);
  };

  const handleConfirmClear = () => {
    clearAllEntries();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  const totalAmount = useMemo(
    () =>
      businessEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.amount),
        0
      ),
    [businessEntries]
  );

  const totalWHT = useMemo(
    () =>
      businessEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.wht),
        0
      ),
    [businessEntries]
  );

  const isDoneDisabled = useMemo(
    () =>
      businessEntries.some((e) => e.hospital === "" || e.amount === "") ||
      taxablePercentage === "",
    [businessEntries, taxablePercentage]
  );

  const handleDone = () => {
    const assessableIncomePercentage =
      100 - CalculationService.parseAndRoundWhole(taxablePercentage);
    const amountForAssessableIncome = CalculationService.parseAndRound(
      (totalAmount * assessableIncomePercentage) / 100
    );

    const businessIncome: BusinessIncome = {
      total: CalculationService.parseAndRound(totalAmount),
      whtTotal: CalculationService.parseAndRound(totalWHT),
      incomes: businessEntries.map((entry) => ({
        hospitalName: entry.hospital,
        value: CalculationService.parseAndRound(entry.amount),
        wht: CalculationService.parseAndRound(entry.wht),
      })),
      amountForAssessableIncome,
      assessableIncomePercentage,
    };

    updateBusinessIncome(businessIncome);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-400/20">
            <MdBusiness className="text-lg text-red-300" />
          </div>
          <Text className="text-xl font-semibold text-white">
            Business Income Details
          </Text>
        </div>
      }
      maxWidth="1000px"
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
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MdLocalHospital className="text-red-300" />
                      <span>Hospital</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdAttachMoney className="text-green-300" />
                      <span>Gross Amount</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Apply WHT (5%)</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdReceipt className="text-blue-300" />
                      <span>WHT on Professional Fee</span>
                    </div>
                  </th>
                  <th className="w-8 p-2 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {businessEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
                  >
                    {/* Hospital */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={entry.hospital}
                          onChange={(e) =>
                            handleHospitalChange(entry.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
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
                          onChange={(e) =>
                            updateEntry(entry.id, "amount", e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    {/* Apply WHT Checkbox */}
                    <td className="p-2 py-4 text-center">
                      <div className="flex justify-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={entry.hasWht}
                            onChange={(e) =>
                              handleWhtToggle(entry.id, e.target.checked)
                            }
                            className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </td>

                    {/* WHT on Professional Fee */}
                    <td className="p-2 py-4 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.wht}
                          onChange={(e) =>
                            updateEntry(entry.id, "wht", e.target.value)
                          }
                          disabled={!entry.hasWht}
                          className={`w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${!entry.hasWht ? "cursor-not-allowed opacity-50" : ""}`}
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    {/* Remove Button */}
                    <td className="px-4 py-4 text-center">
                      {businessEntries.length > 1 && (
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

              <tfoot className="border-t-2 border-red-400/20 bg-red-400/10">
                <tr>
                  <td className="p-2 py-4 text-lg font-bold text-white">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <MdCalculate className="text-red-300" />
                      <span>Total</span>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-red-400/30 bg-red-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-red-300">
                        {formatCurrency(totalAmount)}
                      </Text>
                    </div>
                  </td>
                  <td></td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-red-400/30 bg-red-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-red-300">
                        {formatCurrency(totalWHT)}
                      </Text>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Add/Clear Buttons */}
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
            className="border border-red-400/30 bg-red-400/20 text-red-300 hover:bg-red-400/30"
          >
            Add New Entry
          </Button>
        </Flex>

        {/* Expenses & Assessable Income */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center space-x-2">
              <MdCalculate className="text-red-300" />
              <Text className="text-sm font-medium text-white">
                Percentage for expenses
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-red-400">
                <div className="flex items-center justify-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={taxablePercentage}
                    onChange={(e) =>
                      handleTaxablePercentageChange(e.target.value)
                    }
                    className="w-16 bg-transparent text-center text-sm text-white placeholder-gray-400 outline-none"
                    placeholder="0"
                  />
                  <span className="ml-1 text-sm text-gray-300">%</span>
                </div>
              </div>
              <div className="flex-1 rounded-lg border border-red-400/30 bg-red-400/20 px-3 py-2.5 text-center">
                <Text className="text-sm font-semibold text-red-300">
                  {formatCurrency(
                    (totalAmount *
                      CalculationService.parseAndRound(taxablePercentage)) /
                      100
                  )}
                </Text>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center space-x-2">
              <MdAttachMoney className="text-red-300" />
              <Text className="text-sm font-medium text-white">
                Amount for Assessable Income
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-white/5 px-3 py-2.5 text-center">
                <Text className="text-sm font-semibold text-gray-300">
                  {100 -
                    CalculationService.parseAndRoundWhole(taxablePercentage)}
                  %
                </Text>
              </div>
              <div className="flex-1 rounded-lg border border-red-400/30 bg-red-400/20 px-3 py-2.5 text-center">
                <Text className="font-bold text-red-300">
                  {formatCurrency(
                    (totalAmount *
                      (100 -
                        CalculationService.parseAndRound(taxablePercentage))) /
                      100
                  )}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClearConfirmation
        open={showClearConfirmation}
        title="Clear Business Income"
        description="Are you sure you want to clear all business income entries? This will remove all rows and reset the taxable percentage."
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
      />
    </Modal>
  );
};

export default Business;
