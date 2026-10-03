import { Text, Tooltip } from "@radix-ui/themes";
import { MdCalculate, MdRemoveCircle } from "react-icons/md";
import { useCalculationContext } from "../../../../contexts/CalculationContext";
import { BsFillInfoCircleFill } from "react-icons/bs";

interface TaxComponent {
  name: string;
  percentage: number;
  amount: number;
}

const TotalPayableTax = () => {
  const { currentCalculation } = useCalculationContext();

  const aitRent =
    currentCalculation?.calculationData?.sourceOfIncome?.rentalIncome
      ?.totalAit ?? 0;
  const aitInterest =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome
      ?.totalAit ?? 0;
  const apitTotal =
    currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome
      ?.apitTotal ?? 0;
  const whtRentRate =
    currentCalculation?.calculationData?.settings?.reliefsAndAit?.whtRent ?? 0;
  const aitInterestRate =
    currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitInterest ??
    0;
  const whtProfessionalFee =
    currentCalculation?.calculationData?.sourceOfIncome?.businessIncome
      ?.whtTotal ?? 0;
  const totalPayableTax =
    currentCalculation?.calculationData?.totalPayableTax ?? 0;

  const interestIncome =
    currentCalculation?.calculationData?.sourceOfIncome?.interestIncome;
  const fdAit = interestIncome?.fdIncome?.ait ?? 0;
  const repoAit = interestIncome?.repoIncome?.ait ?? 0;
  const unitTrustAit = interestIncome?.unitTrustIncome?.ait ?? 0;
  const treasuryBillAit = interestIncome?.treasuryBillIncome?.ait ?? 0;
  const tBondAit = interestIncome?.tBondIncome?.ait ?? 0;
  const debentureAit = interestIncome?.debentureIncome?.ait ?? 0;

  const getInterestAitBreakdownContent = () => {
    if (aitInterest === 0) return null;

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
              <span className="text-sm text-white">{item.name}</span>
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
              ({formatCurrency(aitInterest)})
            </span>
          </div>
        </div>
      </div>
    );
  };

  const taxComponents: TaxComponent[] = [
    {
      name: "AIT - Rent",
      percentage: whtRentRate,
      amount: -aitRent,
    },
    {
      name: "AIT - Interest",
      percentage: aitInterestRate,
      amount: -aitInterest,
    },
    {
      name: "APIT Total",
      percentage: 0,
      amount: -apitTotal,
    },
    {
      name: "WHT on Professional Fee",
      percentage: 0,
      amount: -whtProfessionalFee,
    },
  ];

  const totalDeductions = taxComponents.reduce(
    (sum, component) => sum + Math.abs(component.amount),
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${Math.round(percentage)}%`;
  };

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
          <div className="grid grid-cols-3 gap-0">
            <div className="bg-white/10 p-3 px-6">
              <Text className="text-sm font-semibold text-white">Tax Type</Text>
            </div>
            <div className="bg-white/10 p-3">
              <Text className="text-sm font-semibold text-white">Rate</Text>
            </div>
            <div className="bg-white/10 p-3">
              <Text className="text-sm font-semibold text-white">Amount</Text>
            </div>
          </div>

          {taxComponents.map((component, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-0 transition-all duration-200 hover:bg-white/5 ${index !== taxComponents.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <div className="p-3">
                {component.name === "AIT - Interest" && aitInterest > 0 ? (
                  <Tooltip
                    content={getInterestAitBreakdownContent()}
                    className="bg-transparent"
                  >
                    <div className="flex cursor-help items-center space-x-2">
                      <Text className="text-sm text-white transition-colors duration-200 hover:text-blue-300">
                        {component.name}
                      </Text>
                      <BsFillInfoCircleFill
                        className="text-xs text-blue-300/80"
                        size={16}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <Text className="text-sm text-white">{component.name}</Text>
                )}
              </div>
              <div className="p-3">
                {component.percentage > 0 ? (
                  <div className="inline-flex items-center rounded bg-red-400/20 px-2 py-1 text-xs font-bold text-red-300">
                    {formatPercentage(component.percentage)}
                  </div>
                ) : (
                  <Text className="text-sm text-gray-400">-</Text>
                )}
              </div>
              <div className="p-3">
                <Text className="text-sm font-bold text-red-300">
                  ({formatCurrency(Math.abs(component.amount))})
                </Text>
              </div>
            </div>
          ))}
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
              {formatCurrency(
                currentCalculation?.calculationData?.grossIncomeTax?.total ?? 0
              )}
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
