import { Text } from '@radix-ui/themes';
import { MdCalculate, MdRemoveCircle, MdInfo } from 'react-icons/md';
import { useCalculationContext } from '../../../../contexts/CalculationContext';
import { Tooltip } from '@radix-ui/themes';
import { BsFillInfoCircleFill } from 'react-icons/bs';

interface TaxComponent {
    name: string;
    percentage: number;
    amount: number;
}

const TotalPayableTax = () => {
    const { currentCalculation } = useCalculationContext();

    const rentalIncome = currentCalculation?.calculationData?.sourceOfIncome?.rentalIncome?.total ?? 0;
    const aitInterest = currentCalculation?.calculationData?.sourceOfIncome?.interestIncome?.totalAit ?? 0;
    const appitTotal = currentCalculation?.calculationData?.sourceOfIncome?.employmentIncome?.appitTotal ?? 0;
    const whtRentRate = currentCalculation?.calculationData?.settings?.reliefsAndAit?.whtRent ?? 0;
    const aitInterestRate = currentCalculation?.calculationData?.settings?.reliefsAndAit?.aitInterest ?? 0;
    const totalPayableTax = currentCalculation?.calculationData?.totalPayableTax ?? 0;

    const aitRent = (rentalIncome * whtRentRate) / 100;

    const interestIncome = currentCalculation?.calculationData?.sourceOfIncome?.interestIncome;
    const fdAit = interestIncome?.fdIncome?.ait ?? 0;
    const repoAit = interestIncome?.repoIncome?.ait ?? 0;
    const unitTrustAit = interestIncome?.unitTrustIncome?.ait ?? 0;
    const treasuryBillAit = interestIncome?.treasuryBillIncome?.ait ?? 0;
    const tBondAit = interestIncome?.tBondIncome?.ait ?? 0;
    const debentureAit = interestIncome?.debentureIncome?.ait ?? 0;

    const getInterestAitBreakdownContent = () => {
        if (aitInterest === 0) return null;

        const breakdownItems = [];
        if (fdAit > 0) breakdownItems.push({ name: 'Fixed Deposit', amount: fdAit });
        if (repoAit > 0) breakdownItems.push({ name: 'Repo', amount: repoAit });
        if (unitTrustAit > 0) breakdownItems.push({ name: 'Unit Trust', amount: unitTrustAit });
        if (treasuryBillAit > 0) breakdownItems.push({ name: 'Treasury Bill', amount: treasuryBillAit });
        if (tBondAit > 0) breakdownItems.push({ name: 'T-Bond', amount: tBondAit });
        if (debentureAit > 0) breakdownItems.push({ name: 'Debenture', amount: debentureAit });

        return (
            <div className="p-3 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl">
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="font-bold text-sm text-white">Interest AIT Breakdown</div>
                </div>
                <div className="space-y-2">
                    {breakdownItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-200 gap-4">
                            <span className="text-white text-sm">{item.name}</span>
                            <span className="text-red-300 font-bold text-sm">
                                ({formatCurrency(item.amount)})
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-600">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-sm">Total AIT</span>
                        <span className="text-red-300 font-bold text-lg">
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
            amount: -aitRent
        },
        {
            name: "AIT - Interest",
            percentage: aitInterestRate,
            amount: -aitInterest
        },
        {
            name: "APPIT Total",
            percentage: 0,
            amount: -appitTotal
        }
    ];

    const totalDeductions = taxComponents.reduce((sum, component) => sum + Math.abs(component.amount), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatPercentage = (percentage: number) => {
        return `${Math.round(percentage)}%`;
    };

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <MdCalculate className="text-blue-300 text-2xl" />
                <Text className="text-white text-2xl font-bold">Total Payable Tax</Text>
            </div>

            {/* Tax Deductions Section */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <MdRemoveCircle className="text-red-300 text-xl" />
                    <Text className="text-white text-xl font-semibold">Tax Deductions</Text>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-3 gap-0">
                        <div className="bg-white/10 p-3 px-6">
                            <Text className="text-white font-semibold text-sm">Tax Type</Text>
                        </div>
                        <div className="bg-white/10 p-3">
                            <Text className="text-white font-semibold text-sm">Rate</Text>
                        </div>
                        <div className="bg-white/10 p-3">
                            <Text className="text-white font-semibold text-sm">Amount</Text>
                        </div>
                    </div>

                    {taxComponents.map((component, index) => (
                        <div key={index} className={`grid grid-cols-3 gap-0 hover:bg-white/5 transition-all duration-200 ${index !== taxComponents.length - 1 ? 'border-b border-white/10' : ''}`}>
                            <div className="p-3">
                                {component.name === "AIT - Interest" && aitInterest > 0 ? (
                                    <Tooltip content={getInterestAitBreakdownContent()} className='bg-transparent'>
                                        <div className="flex items-center space-x-2 cursor-help">
                                            <Text className="text-white text-sm hover:text-blue-300 transition-colors duration-200">
                                                {component.name}
                                            </Text>
                                            <BsFillInfoCircleFill className="text-blue-300/80 text-xs" size={16} />
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <Text className="text-white text-sm">{component.name}</Text>
                                )}
                            </div>
                            <div className="p-3">
                                {component.percentage > 0 ? (
                                    <div className="inline-flex items-center px-2 py-1 bg-red-400/20 rounded text-red-300 font-bold text-xs">
                                        {formatPercentage(component.percentage)}
                                    </div>
                                ) : (
                                    <Text className="text-gray-400 text-sm">-</Text>
                                )}
                            </div>
                            <div className="p-3">
                                <Text className="text-red-300 font-bold text-sm">
                                    ({formatCurrency(Math.abs(component.amount))})
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-gray-600/20 rounded-xl p-6 border border-gray-500/20 mb-6">
                <Text className="text-white text-lg font-semibold">Tax Calculation Summary</Text>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white">Gross Income Tax</Text>
                        <Text className="text-white font-semibold">
                            {formatCurrency(currentCalculation?.calculationData?.grossIncomeTax?.total ?? 0)}
                        </Text>
                    </div>
                    {totalDeductions > 0 && (
                        <div className="flex justify-between items-center text-red-300">
                            <Text>Less: Total Deductions</Text>
                            <Text className="font-semibold">- {formatCurrency(totalDeductions)}</Text>
                        </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <Text className="text-white text-lg font-semibold">Total Payable Tax</Text>
                            <Text className="text-blue-300 text-2xl font-bold">
                                {formatCurrency(totalPayableTax)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Total Payable Tax */}
            <div className="bg-blue-400/10 rounded-xl p-6 border border-blue-400/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdCalculate className="text-blue-300 text-2xl" />
                        <Text className="text-white text-xl font-semibold">Final Total Payable Tax</Text>
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
