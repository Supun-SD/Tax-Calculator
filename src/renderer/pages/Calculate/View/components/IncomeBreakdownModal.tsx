import { Text, Table } from '@radix-ui/themes';
import { MdPerson, MdAttachMoney, MdReceipt, MdAccountBalance, MdBusiness, MdTrendingUp, MdAccountBalanceWallet, MdSecurity, MdCreditCard, MdCalculate } from 'react-icons/md';
import { Calculation, EmploymentIncome, EmploymentIncomeRecord, RentalIncome, RentalIncomeRecord, InterestIncome, FdIncomeRecord, ReposIncomeRecord, UnitTrustIncomeRecord, TreasuryBillIncomeRecord, TBondIncomeRecord, DebentureIncomeRecord, DividendIncome, DividendIncomeRecord, BusinessIncome, BusinessIncomeRecord, OtherIncome, OtherIncomeRecord } from '../../../../../types/calculation';
import { useState } from 'react';

interface IncomeBreakdownModalProps {
    incomeType: 'employment' | 'rental' | 'interest' | 'dividend' | 'business' | 'other';
    incomeData: any;
    calculation: Calculation;
}

const IncomeBreakdownModal = ({ incomeType, incomeData, calculation }: IncomeBreakdownModalProps) => {
    const formatCurrency = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return 'Rs. 0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `Rs. ${num.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const getIncomeTypeInfo = () => {
        switch (incomeType) {
            case 'employment':
                return {
                    title: 'Employment Income Breakdown',
                    icon: <MdPerson className="text-blue-400 text-2xl" />,
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/20'
                };
            case 'rental':
                return {
                    title: 'Rental Income Breakdown',
                    icon: <MdReceipt className="text-green-400 text-2xl" />,
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/20'
                };
            case 'interest':
                return {
                    title: 'Interest Income Breakdown',
                    icon: <MdAccountBalance className="text-purple-400 text-2xl" />,
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/20'
                };
            case 'dividend':
                return {
                    title: 'Dividend Income Breakdown',
                    icon: <MdAttachMoney className="text-yellow-400 text-2xl" />,
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/20'
                };
            case 'business':
                return {
                    title: 'Business Income Breakdown',
                    icon: <MdBusiness className="text-red-400 text-2xl" />,
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/20'
                };
            case 'other':
                return {
                    title: 'Other Income Breakdown',
                    icon: <MdTrendingUp className="text-indigo-400 text-2xl" />,
                    color: 'text-indigo-400',
                    bgColor: 'bg-indigo-500/20'
                };
        }
    };

    const renderEmploymentBreakdown = () => {
        const data = incomeData as EmploymentIncome;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Employment Income</Text>
                        <Text className="text-2xl font-bold text-blue-400">{formatCurrency(data.total)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Total APIT</Text>
                        <Text className="text-lg font-semibold text-blue-300">{formatCurrency(data.apitTotal)}</Text>
                    </div>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Income Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Value</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Multiplier</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Total</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">APIT</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.incomes.map((income: EmploymentIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white border-b border-white/10">{income.name}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.value)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{income.multiplier}</Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.total)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.apit)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        );
    };

    const renderRentalBreakdown = () => {
        const data = incomeData as RentalIncome;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Rental Income</Text>
                        <Text className="text-2xl font-bold text-green-400">{formatCurrency(data.total)}</Text>
                    </div>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Property Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Value</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Multiplier</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Total</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.incomes.map((income: RentalIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white border-b border-white/10">{income.name}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.value)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{income.multiplier}</Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.total)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        );
    };

    const renderInterestBreakdown = () => {
        const data = incomeData as InterestIncome;
        const [activeTab, setActiveTab] = useState<'fd' | 'repo' | 'unitTrust' | 'treasuryBill' | 'tBond' | 'debenture'>('fd');

        const getTabInfo = (tab: string) => {
            switch (tab) {
                case 'fd':
                    return {
                        title: 'Fixed Deposit',
                        icon: <MdAccountBalanceWallet className="text-lg" />,
                        color: 'text-orange-300',
                        bgColor: 'bg-orange-400/20',
                        borderColor: 'border-orange-400/30',
                        data: data.fdIncome
                    };
                case 'repo':
                    return {
                        title: 'Repo',
                        icon: <MdBusiness className="text-lg" />,
                        color: 'text-blue-300',
                        bgColor: 'bg-blue-400/20',
                        borderColor: 'border-blue-400/30',
                        data: data.repoIncome
                    };
                case 'unitTrust':
                    return {
                        title: 'Unit Trust',
                        icon: <MdTrendingUp className="text-lg" />,
                        color: 'text-green-300',
                        bgColor: 'bg-green-400/20',
                        borderColor: 'border-green-400/30',
                        data: data.unitTrustIncome
                    };
                case 'treasuryBill':
                    return {
                        title: 'Treasury Bill',
                        icon: <MdSecurity className="text-lg" />,
                        color: 'text-yellow-300',
                        bgColor: 'bg-yellow-400/20',
                        borderColor: 'border-yellow-400/30',
                        data: data.treasuryBillIncome
                    };
                case 'tBond':
                    return {
                        title: 'T-Bond',
                        icon: <MdCreditCard className="text-lg" />,
                        color: 'text-indigo-300',
                        bgColor: 'bg-indigo-400/20',
                        borderColor: 'border-indigo-400/30',
                        data: data.tBondIncome
                    };
                case 'debenture':
                    return {
                        title: 'Debenture',
                        icon: <MdReceipt className="text-lg" />,
                        color: 'text-red-300',
                        bgColor: 'bg-red-400/20',
                        borderColor: 'border-red-400/30',
                        data: data.debentureIncome
                    };
                default:
                    return null;
            }
        };

        const renderFdTable = () => {
            const fdData = data.fdIncome;
            if (!fdData || !fdData.incomes || fdData.incomes.length === 0) {
                return (
                    <div className="text-center py-8 text-gray-400">
                        <Text>No Fixed Deposit income data available</Text>
                    </div>
                );
            }

            return (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Bank</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Account/Certificate</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Joint</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Gross Interest</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Contribution</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">AIT</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {fdData.incomes.map((income: FdIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white border-b border-white/10">
                                    <div>
                                        <div className="font-semibold">{income.bank.name}</div>
                                        <div className="text-sm text-gray-400">TIN: {income.bank.tinNumber}</div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">
                                    {income.certificateNumber || income.accountNumber}
                                </Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">
                                    {income.isJoint ? 'Yes' : 'No'}
                                </Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.grossInterest)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.contribution)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.ait)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                    <Table.Body>
                        <Table.Row className="bg-white/10">
                            <Table.Cell colSpan={4} className="text-white font-bold border-t-2 border-white/20 rounded-bl-xl">
                                <div className="flex items-center space-x-2 py-2">
                                    <MdCalculate className="text-orange-300" />
                                    <span>Total</span>
                                </div>
                            </Table.Cell>
                            <Table.Cell className="text-orange-300 font-bold border-t-2 border-white/20 align-middle">
                                {formatCurrency(fdData.total)}
                            </Table.Cell>
                            <Table.Cell className="text-orange-300 font-bold border-t-2 border-white/20 align-middle rounded-br-xl">
                                {formatCurrency(fdData.ait)}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            );
        };

        const renderOtherTable = (type: 'repo' | 'unitTrust' | 'treasuryBill' | 'tBond' | 'debenture') => {
            const tabInfo = getTabInfo(type);
            const otherData = tabInfo?.data;

            if (!otherData || !otherData.incomes || otherData.incomes.length === 0) {
                return (
                    <div className="text-center py-8 text-gray-400">
                        <Text>No {tabInfo?.title} income data available</Text>
                    </div>
                );
            }

            return (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Company Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Certificate Number</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Value</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">AIT</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {otherData.incomes.map((income: any, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{income.companyName}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{income.certificateNumber}</Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.value)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.ait)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                    <Table.Body>
                        <Table.Row className="bg-white/10">
                            <Table.Cell colSpan={2} className="text-white font-bold border-t-2 border-white/20 rounded-bl-xl">
                                <div className="flex items-center space-x-2 py-2">
                                    <MdCalculate className={tabInfo?.color} />
                                    <span>Total</span>
                                </div>
                            </Table.Cell>
                            <Table.Cell className={`${tabInfo?.color} font-bold border-t-2 border-white/20 align-middle`}>
                                {formatCurrency(otherData.total)}
                            </Table.Cell>
                            <Table.Cell className={`${tabInfo?.color} font-bold border-t-2 border-white/20 align-middle rounded-br-xl`}>
                                {formatCurrency(otherData.ait)}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            );
        };

        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Gross Interest</Text>
                        <Text className="text-2xl font-bold text-purple-400">{formatCurrency(data.totalGrossInterest)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Total AIT ({calculation.calculationData.settings.reliefsAndAit.aitInterest}%)</Text>
                        <Text className="text-lg font-semibold text-purple-300">{formatCurrency(data.totalAit)}</Text>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="flex space-x-1 mb-4">
                        {['fd', 'repo', 'unitTrust', 'treasuryBill', 'tBond', 'debenture'].map((tab) => {
                            const tabInfo = getTabInfo(tab);
                            if (!tabInfo || !tabInfo.data) return null;

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab
                                        ? `${tabInfo.bgColor} ${tabInfo.color} border ${tabInfo.borderColor}`
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tabInfo.icon}
                                    <span>{tabInfo.title}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white/5 rounded-xl border border-white/10">
                        {activeTab === 'fd' && renderFdTable()}
                        {activeTab === 'repo' && renderOtherTable('repo')}
                        {activeTab === 'unitTrust' && renderOtherTable('unitTrust')}
                        {activeTab === 'treasuryBill' && renderOtherTable('treasuryBill')}
                        {activeTab === 'tBond' && renderOtherTable('tBond')}
                        {activeTab === 'debenture' && renderOtherTable('debenture')}
                    </div>
                </div>
            </div>
        );
    };

    const renderDividendBreakdown = () => {
        const data = incomeData as DividendIncome;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Gross Dividend</Text>
                        <Text className="text-2xl font-bold text-yellow-400">{formatCurrency(data.totalGrossDividend)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Total AIT</Text>
                        <Text className="text-lg font-semibold text-yellow-300">{formatCurrency(data.totalAit)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Total Exempted</Text>
                        <Text className="text-lg font-semibold text-yellow-300">{formatCurrency(data.totalExempted)}</Text>
                    </div>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Company</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Gross Dividend</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Rate (%)</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">AIT</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Exempted</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.incomes.map((income: DividendIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{income.companyName}</Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.grossDividend)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{income.rate}%</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.ait)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.exempted)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        );
    };

    const renderBusinessBreakdown = () => {
        const data = incomeData as BusinessIncome;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl p-4 border border-red-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Business Income</Text>
                        <Text className="text-2xl font-bold text-red-400">{formatCurrency(data.total)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Professional Practice</Text>
                        <Text className="text-lg font-semibold text-red-300">{formatCurrency(data.professionalPracticeTotal)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Assessable Amount</Text>
                        <Text className="text-lg font-semibold text-red-300">{formatCurrency(data.amountForAssessableIncome)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <Text className="text-gray-400">Assessable Percentage</Text>
                        <Text className="text-lg font-semibold text-red-300">{data.assessableIncomePercentage}%</Text>
                    </div>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Hospital Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Value</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Professional Practice</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.incomes.map((income: BusinessIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{income.hospitalName}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.value)}</Table.Cell>
                                <Table.Cell className="text-white border-b border-white/10">{formatCurrency(income.professionalPractice)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        );
    };

    const renderOtherBreakdown = () => {
        const data = incomeData as OtherIncome;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-xl p-4 border border-indigo-500/30">
                    <div className="flex justify-between items-center">
                        <Text className="text-white font-semibold">Total Other Income</Text>
                        <Text className="text-2xl font-bold text-indigo-400">{formatCurrency(data.total)}</Text>
                    </div>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Income Type</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-white border-b border-white/20">Value</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.incomes.map((income: OtherIncomeRecord, index: number) => (
                            <Table.Row key={index}>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{income.incomeType}</Table.Cell>
                                <Table.Cell className="text-white font-semibold border-b border-white/10">{formatCurrency(income.value)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        );
    };

    const renderBreakdown = () => {
        switch (incomeType) {
            case 'employment':
                return renderEmploymentBreakdown();
            case 'rental':
                return renderRentalBreakdown();
            case 'interest':
                return renderInterestBreakdown();
            case 'dividend':
                return renderDividendBreakdown();
            case 'business':
                return renderBusinessBreakdown();
            case 'other':
                return renderOtherBreakdown();
            default:
                return <Text className="text-white">No data available</Text>;
        }
    };

    const typeInfo = getIncomeTypeInfo();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${typeInfo.bgColor} rounded-lg flex items-center justify-center`}>
                    {typeInfo.icon}
                </div>
                <Text className="text-white text-xl font-bold">{typeInfo.title}</Text>
            </div>

            {renderBreakdown()}
        </div>
    );
};

export default IncomeBreakdownModal;
