import React, { useState, useMemo, useEffect } from "react";
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import {
  MdDelete,
  MdTrendingUp,
  MdAttachMoney,
  MdCalculate,
  MdDescription,
} from "react-icons/md";
import { Text, Flex } from "@radix-ui/themes";
import Button from "../../../../components/Button";
import ClearConfirmation from "./ClearConfirmation";
import { OtherIncome } from "../../../../../types/calculation";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { CalculationService } from "../../../../services/calculationService";

interface OtherProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OtherEntry {
  id: number;
  description: string;
  amount: string;
}

const Other: React.FC<OtherProps> = ({ isOpen, onClose }) => {
  const { currentCalculation, updateOtherIncome } = useCalculationContext();
  const [otherEntries, setOtherEntries] = useState<OtherEntry[]>([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const otherIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.otherIncome;

  useEffect(() => {
    if (isOpen && otherIncome) {
      const entries = otherIncome.incomes.map((income: any, index: number) => ({
        id: index + 1,
        description: income.incomeType,
        amount: income.value.toString(),
      }));
      setOtherEntries(
        entries.length > 0 ? entries : [{ id: 1, description: "", amount: "" }]
      );
    } else if (isOpen && !otherIncome) {
      setOtherEntries([{ id: 1, description: "", amount: "" }]);
    }
  }, [isOpen, otherIncome]);

  const formatCurrency = (amount: number) =>
    CalculationService.formatCurrency(amount);

  const updateEntry = (id: number, field: keyof OtherEntry, value: string) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setOtherEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        )
      );
    }
  };

  const handleDescriptionChange = (id: number, value: string) => {
    setOtherEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, description: value } : entry
      )
    );
  };

  const addNewEntry = () => {
    const newId = otherEntries.length
      ? Math.max(...otherEntries.map((e) => e.id)) + 1
      : 1;
    setOtherEntries((prev) => [
      ...prev,
      { id: newId, description: "", amount: "" },
    ]);
  };

  const removeEntry = (id: number) => {
    if (otherEntries.length > 1)
      setOtherEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const clearAllEntries = () => {
    setOtherEntries([{ id: 1, description: "", amount: "" }]);
    updateOtherIncome(null);
  };

  const handleConfirmClear = () => {
    clearAllEntries();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  const totalIncome = useMemo(
    () =>
      otherEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.amount),
        0
      ),
    [otherEntries]
  );

  const isDoneDisabled = useMemo(
    () => otherEntries.some((e) => e.description === "" || e.amount === ""),
    [otherEntries]
  );

  const handleDone = () => {
    const otherIncome: OtherIncome = {
      total: CalculationService.parseAndRound(totalIncome),
      incomes: otherEntries.map((entry) => ({
        incomeType: entry.description,
        value: CalculationService.parseAndRound(entry.amount),
      })),
    };
    updateOtherIncome(otherIncome);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/20">
            <MdTrendingUp className="text-lg text-indigo-300" />
          </div>
          <Text className="text-xl font-semibold text-white">
            Other Income Details
          </Text>
        </div>
      }
      maxWidth="600px"
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
                      <MdDescription className="text-indigo-300" />
                      <span>Description</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdAttachMoney className="text-green-300" />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="w-8 p-2 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {otherEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
                  >
                    {/* Description */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) =>
                            handleDescriptionChange(entry.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          placeholder="Income type"
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

                    {/* Remove Button */}
                    <td className="px-4 py-4 text-center">
                      {otherEntries.length > 1 && (
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

              <tfoot className="border-t-2 border-indigo-400/20 bg-indigo-400/10">
                <tr>
                  <td className="p-2 py-4 text-lg font-bold text-white">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <MdCalculate className="text-indigo-300" />
                      <span>Total</span>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-indigo-400/30 bg-indigo-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-indigo-300">
                        {formatCurrency(totalIncome)}
                      </Text>
                    </div>
                  </td>
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
            className="border border-indigo-400/30 bg-indigo-400/20 text-indigo-300 hover:bg-indigo-400/30"
          >
            Add New Entry
          </Button>
        </Flex>
      </div>
      <ClearConfirmation
        open={showClearConfirmation}
        title="Clear Other Income"
        description="Are you sure you want to clear all other income entries? This will remove all rows."
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
      />
    </Modal>
  );
};

export default Other;
