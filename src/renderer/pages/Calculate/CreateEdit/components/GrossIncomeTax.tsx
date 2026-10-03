import { useState, useEffect } from "react";
import { Text } from "@radix-ui/themes";
import { MdCalculate, MdPublic, MdTrendingUp } from "react-icons/md";
import { CalculationService } from "../../../../services/calculationService";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { GrossIncomeTaxSlab } from "../../../../../types/calculation";

const GrossIncomeTax = () => {
  const { currentCalculation, updateForeignIncome } = useCalculationContext();

  const [foreignIncomeInput, setForeignIncomeInput] = useState<string>("");

  const totalTaxableIncome: number =
    currentCalculation?.calculationData?.totalTaxableIncome ?? 0;
  const foreignIncome: number =
    currentCalculation?.calculationData?.grossIncomeTax?.foreignIncome.total ??
    0;
  const foreignIncomeTax: number =
    currentCalculation?.calculationData?.grossIncomeTax?.foreignIncome.tax ?? 0;
  const totalGrossIncomeTax: number =
    currentCalculation?.calculationData?.grossIncomeTax?.total ?? 0;
  const slabs: Array<GrossIncomeTaxSlab> =
    currentCalculation?.calculationData?.grossIncomeTax?.slabs ?? [];

  useEffect(() => {
    setForeignIncomeInput(foreignIncome.toString());
  }, [foreignIncome]);

  const formatCurrency = (amount: number) => {
    return CalculationService.formatCurrency(amount);
  };

  const handleForeignIncomeChange = (value: string) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setForeignIncomeInput(value);
      const numericValue = parseFloat(value) || 0;
      updateForeignIncome(numericValue);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center space-x-3">
        <MdCalculate className="text-2xl text-purple-300" />
        <Text className="text-2xl font-bold text-white">
          Gross Income Tax Calculation
        </Text>
      </div>

      {/* Tax Slabs Section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-3">
          <MdTrendingUp className="text-xl text-green-300" />
          <Text className="text-xl font-semibold text-white">
            Tax Slabs Breakdown
          </Text>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
          {totalTaxableIncome > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-0">
                <div className="bg-white/10 p-3 px-6">
                  <Text className="text-sm font-semibold text-white">Slab</Text>
                </div>
                <div className="bg-white/10 p-3">
                  <Text className="text-sm font-semibold text-white">Rate</Text>
                </div>
                <div className="bg-white/10 p-3">
                  <Text className="text-sm font-semibold text-white">
                    Amount
                  </Text>
                </div>
                <div className="bg-white/10 p-3">
                  <Text className="text-sm font-semibold text-white">Tax</Text>
                </div>
              </div>
              {slabs.map((slab, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-0 transition-all duration-200 hover:bg-white/5 ${index !== slabs.length - 1 ? "border-b border-white/10" : ""}`}
                >
                  <div className="p-3">
                    <Text className="px-3 text-sm font-medium text-white">
                      {slab.slab}
                    </Text>
                  </div>
                  <div className="p-3">
                    <div className="inline-flex items-center rounded bg-green-400/20 px-2 py-1 text-xs font-bold text-green-300">
                      {slab.rate}%
                    </div>
                  </div>
                  <div className="p-3">
                    <Text className="text-sm text-white">
                      {formatCurrency(slab.value)}
                    </Text>
                  </div>
                  <div className="p-3">
                    <Text className="text-sm font-bold text-green-300">
                      {formatCurrency(slab.tax)}
                    </Text>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-6">
              <div className="overflow-hidden rounded-lg border border-primary bg-blue-400/20 p-5">
                <Text className="text-md mb-2 text-gray-300">
                  Please add source of incomes to calculate gross income tax
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Foreign Income Tax Section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-3">
          <MdPublic className="text-xl text-orange-300" />
          <Text className="text-xl font-semibold text-white">
            Foreign Income Tax
          </Text>
        </div>

        <div className="rounded-xl border border-white/20 bg-white/10 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Text className="font-semibold text-white">Foreign Income</Text>
              <div className="mt-2">
                <input
                  type="text"
                  value={foreignIncomeInput}
                  onChange={(e) => handleForeignIncomeChange(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  inputMode="decimal"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <div>
                <Text className="font-semibold text-white">
                  Foreign Income Tax
                </Text>
                <Text className="ml-4 text-sm text-gray-400">
                  Rate:{" "}
                  {
                    currentCalculation?.calculationData?.settings?.reliefsAndAit
                      ?.foreignIncomeTaxRate
                  }
                  %
                </Text>
              </div>
              <div className="mt-2 rounded-lg bg-white/10 p-2">
                <Text className="p-2 text-xl font-bold text-gray-300">
                  {formatCurrency(foreignIncomeTax)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="mb-6 rounded-xl border border-gray-500/20 bg-gray-600/20 p-6">
        <Text className="text-lg font-semibold text-white">
          Tax Calculation Summary
        </Text>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Text className="text-white">Domestic Income Tax</Text>
            <Text className="font-semibold text-white">
              {formatCurrency(slabs.reduce((sum, slab) => sum + slab.tax, 0))}
            </Text>
          </div>
          {foreignIncome > 0 && (
            <div className="flex items-center justify-between">
              <Text className="text-white">Foreign Income Tax</Text>
              <Text className="font-semibold text-white">
                {formatCurrency(foreignIncomeTax)}
              </Text>
            </div>
          )}
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Total Gross Income Tax
              </Text>
              <Text className="text-2xl font-bold text-purple-300">
                {formatCurrency(totalGrossIncomeTax)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Final Gross Income Tax */}
      <div className="rounded-xl border border-purple-400/20 bg-purple-400/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdCalculate className="text-2xl text-purple-300" />
            <Text className="text-xl font-semibold text-white">
              Total Gross Income Tax
            </Text>
          </div>
          <Text className="text-3xl font-bold text-purple-300">
            {formatCurrency(totalGrossIncomeTax)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default GrossIncomeTax;
