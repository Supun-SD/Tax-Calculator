import { Calculation } from "../../../../../types/calculation";
import { Text } from "@radix-ui/themes";
import { MdCalculate, MdPublic, MdTrendingUp } from "react-icons/md";

interface GrossIncomeTaxProps {
  calculation: Calculation;
}

const GrossIncomeTax = ({ calculation }: GrossIncomeTaxProps) => {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { grossIncomeTax } = calculation.calculationData;
  const { total, foreignIncome, slabs } = grossIncomeTax;

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
          <div className="grid grid-cols-4 gap-0">
            <div className="bg-white/10 p-3 px-6">
              <Text className="text-sm font-semibold text-white">Slab</Text>
            </div>
            <div className="bg-white/10 p-3">
              <Text className="text-sm font-semibold text-white">Rate</Text>
            </div>
            <div className="bg-white/10 p-3">
              <Text className="text-sm font-semibold text-white">Amount</Text>
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
        </div>
      </div>

      {/* Foreign Income Tax Section */}
      {foreignIncome.total > 0 && (
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
                <Text className="ml-4 text-xl font-bold text-gray-300">
                  {formatCurrency(foreignIncome.total)}
                </Text>
              </div>
              <div>
                <Text className="font-semibold text-white">
                  Foreign Income Tax
                </Text>
                <Text className="ml-4 text-xl font-bold text-gray-300">
                  {formatCurrency(foreignIncome.tax)}
                </Text>
                <Text className="ml-4 text-sm text-gray-400">
                  Rate:{" "}
                  {
                    calculation.calculationData.settings.reliefsAndAit
                      .foreignIncomeTaxRate
                  }
                  %
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {foreignIncome.total > 0 && (
            <div className="flex items-center justify-between">
              <Text className="text-white">Foreign Income Tax</Text>
              <Text className="font-semibold text-white">
                {formatCurrency(foreignIncome.tax)}
              </Text>
            </div>
          )}
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Total Gross Income Tax
              </Text>
              <Text className="text-2xl font-bold text-purple-300">
                {formatCurrency(total)}
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
            {formatCurrency(total)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default GrossIncomeTax;
