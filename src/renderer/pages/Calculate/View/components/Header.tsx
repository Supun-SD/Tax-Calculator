import { Account } from "../../../../../types/account";
import { Calculation } from "../../../../../types/calculation";
import { Grid, Separator, Text } from '@radix-ui/themes';
import Button from '../../../../components/Button';
import { ClipLoader } from 'react-spinners';
import { MdPerson, MdCalendarToday, MdEdit, MdPrint } from 'react-icons/md';
import { useCalculations } from "../../../../hooks/useCalculations";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";

interface HeaderProps {
    calculation: Calculation;
}

const Header = ({ calculation }: HeaderProps) => {
    const { downloadCalculationPdf, isDownloading } = useCalculations();
    const { account, year } = calculation;

    const navigate = useNavigate();
    const { showError } = useToast();

    const handleEdit = () => {
        navigate('/calculate', {
            state: {
                isEditing: true,
                calculationId: calculation.id
            }
        });
    };

    const handlePrint = async () => {
        if (!calculation.id) {
            showError('Calculation not found');
            return;
        }
        await downloadCalculationPdf(calculation.id);
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <MdPerson className="text-white text-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-white text-2xl font-bold">
                                {account?.title} {account?.name}
                            </Text>
                            <Text className="text-gray-400 text-lg">
                                TIN: {account?.tinNumber}
                            </Text>
                        </div>
                    </div>
                    <Separator
                        orientation="vertical"
                        className="mx-6 h-12 bg-popup-title-bg"
                    />
                    <div className="flex items-center space-x-4 text-gray-400">
                        <MdCalendarToday className="text-2xl" />
                        <Text className="text-white text-xl font-medium">
                            {year}
                        </Text>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex gap-3 items-center">
                        <Button
                            variant="secondary"
                            icon={MdEdit}
                            onClick={handleEdit}
                        >
                            Edit Calculation
                        </Button>
                        {
                            !isDownloading ? (
                                <Button
                                    variant="secondary"
                                    icon={MdPrint}
                                    onClick={handlePrint}
                                >
                                    Download PDF
                                </Button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <ClipLoader color="#4A90E2" size={20} />
                                    <Text className="text-white">Downloading...</Text>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;