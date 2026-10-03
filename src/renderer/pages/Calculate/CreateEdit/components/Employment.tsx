import React, { useMemo, useState, useEffect } from "react";
import { Text, Flex } from "@radix-ui/themes";
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import {
  MdDelete,
  MdPerson,
  MdAttachMoney,
  MdCalculate,
  MdReceipt,
} from "react-icons/md";
import Button from "../../../../components/Button";
import ClearConfirmation from "./ClearConfirmation";
import {
  EmploymentIncome,
  EmploymentIncomeRecord,
} from "../../../../../types/calculation";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { CalculationService } from "../../../../services/calculationService";

interface EmploymentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IncomeEntry {
  id: number;
  name: string;
  amount: string;
  multiplier: string;
  apit: string;
  product: number;
}

const Employment: React.FC<EmploymentProps> = ({ isOpen, onClose }) => {
  const { currentCalculation, updateEmploymentIncome } =
    useCalculationContext();
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const employmentIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome;

  const isDoneDisabled = useMemo(
    () =>
      incomeEntries.some(
        (entry) =>
          entry.name === "" ||
          entry.amount === "" ||
          entry.multiplier === "" ||
          entry.multiplier === "0" ||
          entry.apit === ""
      ),
    [incomeEntries]
  );

  const totalIncome = useMemo(
    () => incomeEntries.reduce((sum, e) => sum + e.product, 0),
    [incomeEntries]
  );

  const totalApit = useMemo(
    () =>
      incomeEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.apit),
        0
      ),
    [incomeEntries]
  );

  useEffect(() => {
    if (isOpen && employmentIncome) {
      const entries = employmentIncome.incomes.map(
        (income: EmploymentIncomeRecord, index: number) => ({
          id: index + 1,
          name: income.name,
          amount: income.value.toString(),
          multiplier: income.multiplier.toString(),
          apit: income.apit.toString(),
          product: income.value * income.multiplier,
        })
      );

      setIncomeEntries(
        entries.length > 0
          ? entries
          : [
              {
                id: 1,
                name: "",
                amount: "",
                multiplier: "1",
                apit: "",
                product: 0,
              },
            ]
      );
    } else if (isOpen && !employmentIncome) {
      setIncomeEntries([
        { id: 1, name: "", amount: "", multiplier: "1", apit: "", product: 0 },
      ]);
    }
  }, [isOpen, employmentIncome]);

  const formatCurrency = (amount: number) =>
    CalculationService.formatCurrency(amount);

  const updateEntry = (id: number, field: keyof IncomeEntry, value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setIncomeEntries((prev) =>
        prev.map((entry) => {
          if (entry.id !== id) return entry;

          const updated = { ...entry, [field]: value };
          const amount = CalculationService.parseAndRound(updated.amount);
          const multiplier = CalculationService.parseAndRound(
            updated.multiplier
          );
          updated.product = amount * multiplier;

          return updated;
        })
      );
    }
  };

  const handleNameChange = (id: number, value: string) => {
    setIncomeEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, name: value } : entry))
    );
  };

  const addNewEntry = () => {
    const newId = incomeEntries.length
      ? Math.max(...incomeEntries.map((e) => e.id)) + 1
      : 1;

    setIncomeEntries((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        amount: "",
        multiplier: "1",
        apit: "",
        product: 0,
      },
    ]);
  };

  const removeEntry = (id: number) => {
    if (incomeEntries.length > 1) {
      setIncomeEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const clearAllEntries = () => {
    setIncomeEntries([
      { id: 1, name: "", amount: "", multiplier: "1", apit: "", product: 0 },
    ]);
    updateEmploymentIncome(null);
  };

  const handleConfirmClear = () => {
    clearAllEntries();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  const handleDone = () => {
    const employmentIncome: EmploymentIncome = {
      total: CalculationService.parseAndRound(totalIncome),
      apitTotal: CalculationService.parseAndRound(totalApit),
      incomes: incomeEntries.map((entry) => {
        const amount = CalculationService.parseAndRound(entry.amount);
        const multiplier = CalculationService.parseAndRound(entry.multiplier);
        const apit = CalculationService.parseAndRound(entry.apit);
        const product = amount * multiplier;

        return {
          name: entry.name,
          value: CalculationService.parseAndRound(amount),
          multiplier: CalculationService.parseAndRoundWhole(multiplier),
          apit: CalculationService.parseAndRound(apit),
          total: CalculationService.parseAndRound(product),
        };
      }),
    };

    updateEmploymentIncome(employmentIncome);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20">
            <MdPerson className="text-lg text-blue-300" />
          </div>
          <Text className="text-xl font-semibold text-white">
            Employment Income Details
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
                      <MdPerson className="text-blue-300" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MdAttachMoney className="text-green-300" />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdCalculate className="text-purple-300" />
                      <span>X</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdCalculate className="text-yellow-300" />
                      <span>Product</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-end space-x-2">
                      <MdReceipt className="text-orange-300" />
                      <span>APIT</span>
                    </div>
                  </th>
                  <th className="w-8 p-2"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {incomeEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
                  >
                    <td className="px-4 py-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={entry.name}
                          onChange={(e) =>
                            handleNameChange(entry.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter name"
                        />
                      </div>
                    </td>

                    <td className="p-2 py-4">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.amount}
                          onChange={(e) =>
                            updateEntry(entry.id, "amount", e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 [appearance:textfield] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    <td className="p-2 py-4 text-center">
                      <div className="inline-block">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.multiplier}
                          onChange={(e) =>
                            updateEntry(entry.id, "multiplier", e.target.value)
                          }
                          className="w-12 rounded-lg border border-purple-400/30 bg-purple-400/20 px-2 py-2 text-center text-purple-300 placeholder-purple-300/50 transition-all duration-200 [appearance:textfield] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          placeholder="1"
                        />
                      </div>
                    </td>

                    <td className="p-2 py-4 text-end">
                      <div className="inline-block w-full rounded-lg border border-yellow-400/30 bg-yellow-400/20 px-3 py-2">
                        <Text className="text-sm font-semibold text-yellow-300">
                          {formatCurrency(entry.product)}
                        </Text>
                      </div>
                    </td>

                    <td className="p-2 py-4 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.apit}
                          onChange={(e) =>
                            updateEntry(entry.id, "apit", e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 [appearance:textfield] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      {incomeEntries.length > 1 && (
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

              <tfoot className="border-t-2 border-blue-400/20 bg-blue-400/10">
                <tr>
                  <td
                    className="p-2 py-4 text-lg font-bold text-white"
                    colSpan={3}
                  >
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <MdCalculate className="text-blue-300" />
                      <span>Total</span>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-blue-400/30 bg-blue-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-blue-300">
                        {formatCurrency(totalIncome)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-blue-400/30 bg-blue-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-blue-300">
                        {formatCurrency(totalApit)}
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
            className="border border-blue-400/30 bg-blue-400/20 text-blue-300 hover:bg-blue-400/30"
          >
            Add New Entry
          </Button>
        </Flex>
      </div>
      <ClearConfirmation
        open={showClearConfirmation}
        title="Clear Employment Income"
        description="Are you sure you want to clear all employment income entries? This will remove all rows."
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
      />
    </Modal>
  );
};

export default Employment;
