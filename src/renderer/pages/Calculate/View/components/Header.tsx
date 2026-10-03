import { Calculation } from "../../../../../types/calculation";
import { Separator, Text } from "@radix-ui/themes";
import Button from "../../../../components/Button";
import { ClipLoader } from "react-spinners";
import { MdPerson, MdCalendarToday, MdEdit, MdPrint } from "react-icons/md";
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
    navigate("/calculate", {
      state: {
        isEditing: true,
        calculationId: calculation.id,
      },
    });
  };

  const handlePrint = async () => {
    if (!calculation.id) {
      showError("Calculation not found");
      return;
    }
    await downloadCalculationPdf(calculation.id);
  };

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/60 to-purple-500/60">
              <MdPerson className="text-2xl text-white" />
            </div>
            <div className="flex flex-col">
              <Text className="text-2xl font-bold text-white">
                {account?.title} {account?.name}
              </Text>
              <Text className="text-lg text-gray-400">
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
            <Text className="text-xl font-medium text-white">{year}</Text>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={MdEdit} onClick={handleEdit}>
              Edit Calculation
            </Button>
            {!isDownloading ? (
              <Button variant="secondary" icon={MdPrint} onClick={handlePrint}>
                Download PDF
              </Button>
            ) : (
              <div className="flex items-center space-x-4 px-3">
                <ClipLoader color="#4A90E2" size={20} />
                <Text className="text-white">Downloading...</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
