import { Text, Separator } from '@radix-ui/themes';
import { useCalculationContext } from '../../../../contexts/CalculationContext';

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
        <div className="h-full flex flex-col">
            <Text className='text-white pl-3' size="4" weight="bold">Total payable tax</Text>
            <Separator className="w-full mt-3 bg-surface-2" />
            <div className='text-white bg-surface mt-4 p-8 rounded-2xl flex-1 flex flex-col'>
                {/* Tax Components Table */}
                <div className="flex-1">
                    <div className="space-y-3">
                        {taxComponents.map((component, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center py-2"
                            >
                                <Text className="text-white flex-1">{component.name}</Text>
                                {component.percentage > 0 ? (
                                    <Text className="text-white text-center flex-1">{formatPercentage(component.percentage)}</Text>
                                ) : (
                                    <div className="flex-1"></div>
                                )}
                                <Text className={`text-white text-right flex-1 ${component.amount < 0 ? 'text-red-400' : ''}`}>
                                    {component.amount < 0 ? `(${formatCurrency(Math.abs(component.amount))})` : formatCurrency(component.amount)}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Total Deductions */}
                    {totalDeductions > 0 && (
                        <div className="mt-4 flex justify-end">
                            <div className="text-white text-right gap-8 flex bg-gray-600/30 rounded-lg p-4">
                                <Text className="text-white text-right">Total Deductions:</Text>
                                <Text className="text-white text-right">({formatCurrency(totalDeductions)})</Text>
                            </div>
                        </div>
                    )}
                </div>

                {/* Balance Payable Tax */}
                <div className="mt-6 bg-gray-600/30 border-2 border-green-500 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total payable tax</Text>
                        <Text className="text-white font-bold text-lg">
                            {formatCurrency(totalPayableTax)}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalPayableTax;
