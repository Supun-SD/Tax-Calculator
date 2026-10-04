import { Calculation } from "../../../../../types/calculation";
import { Text, Tooltip } from "@radix-ui/themes";
import { MdCalculate, MdRemoveCircle } from "react-icons/md";
import { BsFillInfoCircleFill } from "react-icons/bs";

interface TotalPayableTaxProps {
  calculation: Calculation;
}

const TotalPayableTax = ({ calculation }: TotalPayableTaxProps) => {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "Rs. 0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { totalPayableTax, grossIncomeTax, sourceOfIncome } =
    calculation.calculationData;
  const { total: grossIncomeTaxTotal } = grossIncomeTax;
  const { rentalIncome, interestIncome, employmentIncome, businessIncome } =
    sourceOfIncome;
  const { whtRent, aitInterest } =
    calculation.calculationData.settings.reliefsAndAit;

  const aitRent = rentalIncome?.totalAit;
  const aitInterestTotal = interestIncome?.totalAit;
  const apitTotal = employmentIncome?.apitTotal;
  const whtProfessionalFee = businessIncome?.whtTotal;

  const fdAit = interestIncome?.fdIncome?.ait ?? 0;
  const repoAit = interestIncome?.repoIncome?.ait ?? 0;
  const unitTrustAit = interestIncome?.unitTrustIncome?.ait ?? 0;
  const treasuryBillAit = interestIncome?.treasuryBillIncome?.ait ?? 0;
  const tBondAit = interestIncome?.tBondIncome?.ait ?? 0;
  const debentureAit = interestIncome?.debentureIncome?.ait ?? 0;

  const getInterestAitBreakdownContent = () => {
    if (aitInterestTotal === 0) return null;

    const breakdownItems = [];
    if (fdAit > 0)
      breakdownItems.push({ name: "Fixed Deposit", amount: fdAit });
    if (repoAit > 0) breakdownItems.push({ name: "Repo", amount: repoAit });
    if (unitTrustAit > 0)
      breakdownItems.push({ name: "Unit Trust", amount: unitTrustAit });
    if (treasuryBillAit > 0)
      breakdownItems.push({ name: "Treasury Bill", amount: treasuryBillAit });
    if (tBondAit > 0) breakdownItems.push({ name: "T-Bond", amount: tBondAit });
    if (debentureAit > 0)
      breakdownItems.push({ name: "Debenture", amount: debentureAit });

    return (
      <div className="rounded-xl border border-gray-600 bg-gray-800 p-3 shadow-2xl">
        <div className="mb-3 flex items-center space-x-2 border-b border-gray-600 pb-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <div className="text-sm font-bold text-white">
            Interest AIT Breakdown
          </div>
        </div>
        <div className="space-y-2">
          {breakdownItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-600 bg-gray-700 p-2 transition-all duration-200 hover:bg-gray-600"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-red-300">
                ({formatCurrency(item.amount)})
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-gray-600 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Total AIT</span>
            <span className="text-lg font-bold text-red-300">
              ({formatCurrency(aitInterestTotal)})
            </span>
          </div>
        </div>
      </div>
    );
  };

  const totalDeductions =
    (aitRent ?? 0) + (aitInterestTotal ?? 0) + (apitTotal ?? 0);

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center space-x-3">
        <MdCalculate className="text-2xl text-blue-300" />
        <Text className="text-2xl font-bold text-white">Total Payable Tax</Text>
      </div>

      {/* Tax Deductions Section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-3">
          <MdRemoveCircle className="text-xl text-red-300" />
          <Text className="text-xl font-semibold text-white">
            Tax Deductions
          </Text>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-0">
            <div className="bg-white/10 p-3 px-6">
              <Text className="text-sm font-semibold text-white">Tax Type</Text>
            </div>
            <div className="bg-white/10 p-3">
              <Text className="text-sm font-semibold text-white">Amount</Text>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 border-b border-white/10">
            <div className="p-3">
              <Text className="text-sm text-white">
                AIT - Rent ({whtRent}%)
              </Text>
            </div>
            <div className="p-3">
              <Text className="text-sm font-bold text-red-300">
                ({formatCurrency(aitRent)})
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 border-b border-white/10">
            <div className="p-3">
              {(aitInterestTotal ?? 0) > 0 ? (
                <Tooltip
                  content={getInterestAitBreakdownContent()}
                  className="bg-transparent"
                >
                  <div className="flex cursor-help items-center space-x-2">
                    <Text className="text-sm text-white transition-colors duration-200 hover:text-blue-300">
                      AIT - Interest ({aitInterest}%)
                    </Text>
                    <BsFillInfoCircleFill
                      className="text-xs text-blue-300/80"
                      size={16}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Text className="text-sm text-white">
                  AIT - Interest ({aitInterest}%)
                </Text>
              )}
            </div>
            <div className="p-3">
              <Text className="text-sm font-bold text-red-300">
                ({formatCurrency(aitInterestTotal)})
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0">
            <div className="p-3">
              <Text className="text-sm text-white">APIT Total</Text>
            </div>
            <div className="p-3">
              <Text className="text-sm font-bold text-red-300">
                ({formatCurrency(apitTotal)})
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0">
            <div className="p-3">
              <Text className="text-sm text-white">
                WHT on Professional Fee
              </Text>
            </div>
            <div className="p-3">
              <Text className="text-sm font-bold text-red-300">
                ({formatCurrency(whtProfessionalFee)})
              </Text>
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
            <Text className="text-white">Gross Income Tax</Text>
            <Text className="font-semibold text-white">
              {formatCurrency(grossIncomeTaxTotal)}
            </Text>
          </div>
          {totalDeductions > 0 && (
            <div className="flex items-center justify-between text-red-300">
              <Text>Less: Total Deductions</Text>
              <Text className="font-semibold">
                - {formatCurrency(totalDeductions)}
              </Text>
            </div>
          )}
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Total Payable Tax
              </Text>
              <Text className="text-2xl font-bold text-blue-300">
                {formatCurrency(totalPayableTax)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Final Total Payable Tax */}
      <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdCalculate className="text-2xl text-blue-300" />
            <Text className="text-xl font-semibold text-white">
              Final Total Payable Tax
            </Text>
          </div>
          <Text className="text-3xl font-bold text-blue-300">
            {formatCurrency(totalPayableTax)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TotalPayableTax;
