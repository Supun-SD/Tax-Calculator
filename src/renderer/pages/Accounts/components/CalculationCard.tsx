import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { MdCalculate, MdDownload, MdEdit, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useCalculations } from '../../../hooks/useCalculations';
import { useToast } from '../../../hooks/useToast';
import { ClipLoader } from 'react-spinners';

interface CalculationCardProps {
  calculation: any;
}

const CalculationCard: React.FC<CalculationCardProps> = ({ calculation }) => {

  const navigate = useNavigate();
  const { downloadCalculationPdf, isDownloading } = useCalculations();
  const { showError } = useToast();

  const handleViewCalculation = (calculation: any) => {
    navigate(`/view-calculation/${calculation.id}`);
  };

  const handleEditCalculation = (calculation: any) => {
    navigate('/calculate', { state: { isEditing: true, calculationId: calculation.id } });
  };

  const handleDownloadCalculation = async (calculation: any) => {
    if (!calculation.id) {
      showError('Calculation not found');
      return;
    }
    await downloadCalculationPdf(calculation.id);
  };

  return (
    <div className="bg-white/10 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
      <Flex align="center" justify="between">
        <Flex align="center" gap="3">
          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <MdCalculate className="text-blue-300 text-lg" />
          </div>
          <div>
            <Text size="3" weight="medium" className="text-white">
              {calculation.year}
            </Text>
          </div>
        </Flex>

        <Flex gap="2" align="center">
          {calculation.status === 'draft' && (
            <div className="text-xs text-white bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 rounded-lg">
              Draft
            </div>
          )}
          {calculation.status === 'submitted' && (
            <div className="text-xs text-white bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-lg">
              Submitted
            </div>
          )}

          <div className="flex gap-1 items-center">
            {calculation.status === 'submitted' && (
              <button
                onClick={() => handleViewCalculation(calculation)}
                className="w-8 h-8 bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 hover:text-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-blue-400/30"
                title="View"
              >
                <MdVisibility className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => handleEditCalculation(calculation)}
              className="w-8 h-8 bg-green-400/20 hover:bg-green-400/30 text-green-300 hover:text-green-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-green-400/30"
              title="Edit"
            >
              <MdEdit className="h-4 w-4" />
            </button>

            {calculation.status === 'submitted' && (
              isDownloading ? <div className="px-1.5 flex items-center justify-center"><ClipLoader color="#4A90E2" size={20} /></div> : <button
                onClick={() => handleDownloadCalculation(calculation)}
                className="w-8 h-8 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 hover:text-purple-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-purple-400/30"
                title="Download"
              >
                <MdDownload className="h-4 w-4" />
              </button>
            )}
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default CalculationCard;
