import React, { useMemo, useState, useEffect } from "react";
import Modal from "../../../../components/Modal";
import { IoAdd } from "react-icons/io5";
import {
  MdDelete,
  MdBusiness,
  MdAttachMoney,
  MdCalculate,
  MdReceipt,
  MdTrendingUp,
} from "react-icons/md";
import { Text, Flex } from "@radix-ui/themes";
import Button from "../../../../components/Button";
import ClearConfirmation from "./ClearConfirmation";
import { DividendIncome } from "../../../../../types/calculation";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { CalculationService } from "../../../../services/calculationService";

interface DividendProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DividendEntry {
  id: number;
  company: string;
  grossDividend: string;
  rate: string;
  ait: number;
  exempted: string;
}

const Dividend: React.FC<DividendProps> = ({ isOpen, onClose }) => {
  const { currentCalculation, updateDividendIncome } = useCalculationContext();

  const [dividendEntries, setDividendEntries] = useState<DividendEntry[]>([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const dividendIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.dividendIncome;
  const aitRate: number =
    currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitDividend ??
    0;

  const totalGrossDividend = useMemo(
    () =>
      dividendEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.grossDividend),
        0
      ),
    [dividendEntries]
  );

  const totalAit = useMemo(
    () => dividendEntries.reduce((sum, e) => sum + e.ait, 0),
    [dividendEntries]
  );

  const totalExempted = useMemo(
    () =>
      dividendEntries.reduce(
        (sum, e) => sum + CalculationService.parseAndRound(e.exempted),
        0
      ),
    [dividendEntries]
  );

  const isDoneDisabled = useMemo(
    () =>
      dividendEntries.some(
        (entry) =>
          entry.company === "" ||
          entry.grossDividend === "" ||
          entry.rate === "" ||
          entry.rate === "0"
      ),
    [dividendEntries]
  );

  useEffect(() => {
    if (isOpen && dividendIncome) {
      const entries = dividendIncome.incomes.map(
        (income: any, index: number) => ({
          id: index + 1,
          company: income.companyName,
          grossDividend: income.grossDividend.toString(),
          rate: income.rate.toString(),
          ait: income.ait,
          exempted: income.exempted.toString(),
        })
      );

      setDividendEntries(
        entries.length > 0
          ? entries
          : [
              {
                id: 1,
                company: "",
                grossDividend: "",
                rate: Math.round(aitRate).toString(),
                ait: 0,
                exempted: "",
              },
            ]
      );
    } else if (isOpen && !dividendIncome) {
      setDividendEntries([
        {
          id: 1,
          company: "",
          grossDividend: "",
          rate: Math.round(aitRate).toString(),
          ait: 0,
          exempted: "",
        },
      ]);
    }
  }, [isOpen, dividendIncome, aitRate]);

  const formatCurrency = (amount: number) =>
    CalculationService.formatCurrency(amount);

  const updateEntry = (
    id: number,
    field: keyof DividendEntry,
    value: string
  ) => {
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setDividendEntries((prev) =>
        prev.map((entry) => {
          if (entry.id !== id) return entry;

          const updated = { ...entry, [field]: value };

          if (field === "grossDividend" || field === "rate") {
            const gross = CalculationService.parseAndRound(
              updated.grossDividend
            );
            const rate = CalculationService.parseAndRound(updated.rate);
            const aitAmount = CalculationService.parseAndRound(
              (gross * rate) / 100
            );
            updated.ait = aitAmount;
          }

          if (field === "exempted") {
            updated.exempted = value;
          }

          return updated;
        })
      );
    }
  };

  const handleCompanyChange = (id: number, value: string) => {
    setDividendEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, company: value } : entry
      )
    );
  };

  const addNewEntry = () => {
    const newId = dividendEntries.length
      ? Math.max(...dividendEntries.map((e) => e.id)) + 1
      : 1;

    setDividendEntries((prev) => [
      ...prev,
      {
        id: newId,
        company: "",
        grossDividend: "",
        rate: Math.round(aitRate).toString(),
        ait: 0,
        exempted: "",
      },
    ]);
  };

  const removeEntry = (id: number) => {
    if (dividendEntries.length > 1) {
      setDividendEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const clearAllEntries = () => {
    setDividendEntries([
      {
        id: 1,
        company: "",
        grossDividend: "",
        rate: Math.round(aitRate).toString(),
        ait: 0,
        exempted: "",
      },
    ]);
    updateDividendIncome(null);
  };

  const handleConfirmClear = () => {
    clearAllEntries();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  const handleDone = () => {
    const dividendIncome: DividendIncome = {
      totalGrossDividend: CalculationService.parseAndRound(totalGrossDividend),
      totalAit: CalculationService.parseAndRound(totalAit),
      totalExempted: CalculationService.parseAndRound(totalExempted),
      incomes: dividendEntries.map((entry) => {
        const grossDividend = CalculationService.parseAndRound(
          entry.grossDividend
        );
        const rate = CalculationService.parseAndRoundWhole(entry.rate);
        const exempted = CalculationService.parseAndRound(entry.exempted);

        return {
          companyName: entry.company,
          grossDividend,
          rate,
          ait: CalculationService.parseAndRound(entry.ait),
          exempted,
        };
      }),
    };

    updateDividendIncome(dividendIncome);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/20">
            <MdAttachMoney className="text-lg text-yellow-300" />
          </div>
          <Text className="text-xl font-semibold text-white">
            Dividend Income Details
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
                      <MdBusiness className="text-yellow-300" />
                      <span>Company</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdAttachMoney className="text-green-300" />
                      <span>Gross Dividend</span>
                    </div>
                  </th>
                  <th className="w-20 p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdCalculate className="text-purple-300" />
                      <span>Rate</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdReceipt className="text-red-300" />
                      <span>AIT</span>
                    </div>
                  </th>
                  <th className="p-2 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <MdTrendingUp className="text-blue-300" />
                      <span>Exempted</span>
                    </div>
                  </th>
                  <th className="w-8 p-2 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {dividendEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`transition-colors duration-150 hover:bg-white/5 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}
                  >
                    {/* Company */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={entry.company}
                          onChange={(e) =>
                            handleCompanyChange(entry.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Company Name"
                        />
                      </div>
                    </td>

                    {/* Gross Dividend */}
                    <td className="p-2 py-4 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.grossDividend}
                          onChange={(e) =>
                            updateEntry(
                              entry.id,
                              "grossDividend",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="p-2 py-4 text-center">
                      <div className="inline-block">
                        <div className="flex items-center rounded-lg border border-purple-400/30 bg-purple-400/20 px-3 py-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={entry.rate}
                            onChange={(e) =>
                              updateEntry(entry.id, "rate", e.target.value)
                            }
                            className="w-12 bg-transparent text-center text-purple-300 placeholder-purple-300/50 outline-none focus:outline-none"
                            placeholder={Math.round(aitRate).toString()}
                          />
                          <span className="pl-1 text-sm text-purple-300">
                            %
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* AIT */}
                    <td className="p-2 py-4 text-center">
                      <div className="inline-block w-full rounded-lg border border-red-400/30 bg-red-400/20 px-3 py-2">
                        <Text className="text-right text-sm font-semibold text-red-300">
                          {formatCurrency(entry.ait)}
                        </Text>
                      </div>
                    </td>

                    {/* Exempted */}
                    <td className="p-2 py-4 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.exempted}
                          onChange={(e) =>
                            updateEntry(entry.id, "exempted", e.target.value)
                          }
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-right text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    {/* Remove Button */}
                    <td className="px-4 py-4 text-center">
                      {dividendEntries.length > 1 && (
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

              <tfoot className="border-t-2 border-yellow-400/20 bg-yellow-400/10">
                <tr>
                  <td className="p-2 py-4 text-lg font-bold text-white">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <MdCalculate className="text-yellow-300" />
                      <span>Total</span>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-yellow-400/30 bg-yellow-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-yellow-300">
                        {formatCurrency(totalGrossDividend)}
                      </Text>
                    </div>
                  </td>
                  <td></td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-yellow-400/30 bg-yellow-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-yellow-300">
                        {formatCurrency(totalAit)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-2 text-end">
                    <div className="inline-block w-full rounded-lg border border-yellow-400/30 bg-yellow-400/20 px-4 py-2">
                      <Text className="text-lg font-bold text-yellow-300">
                        {formatCurrency(totalExempted)}
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
            className="border border-yellow-400/30 bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30"
          >
            Add New Entry
          </Button>
        </Flex>
      </div>
      <ClearConfirmation
        open={showClearConfirmation}
        title="Clear Dividend Income"
        description="Are you sure you want to clear all dividend income entries? This will remove all rows."
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
      />
    </Modal>
  );
};

export default Dividend;
