import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import { MdCalculate, MdDownload, MdEdit, MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCalculations } from "../../../hooks/useCalculations";
import { useToast } from "../../../hooks/useToast";
import { ClipLoader } from "react-spinners";

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
    navigate("/calculate", {
      state: { isEditing: true, calculationId: calculation.id },
    });
  };

  const handleDownloadCalculation = async (calculation: any) => {
    if (!calculation.id) {
      showError("Calculation not found");
      return;
    }
    await downloadCalculationPdf(calculation.id);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4 transition-all duration-200 hover:bg-white/10">
      <Flex align="center" justify="between">
        <Flex align="center" gap="3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20">
            <MdCalculate className="text-lg text-blue-300" />
          </div>
          <div>
            <Text size="3" weight="medium" className="text-white">
              {calculation.year}
            </Text>
          </div>
        </Flex>

        <Flex gap="2" align="center">
          {calculation.status === "draft" && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs text-white">
              Draft
            </div>
          )}
          {calculation.status === "submitted" && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/20 px-3 py-1 text-xs text-white">
              Submitted
            </div>
          )}

          <div className="flex items-center gap-1">
            {calculation.status === "submitted" && (
              <button
                onClick={() => handleViewCalculation(calculation)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-400/20 text-blue-300 transition-all duration-200 hover:scale-110 hover:bg-blue-400/30 hover:text-blue-200"
                title="View"
              >
                <MdVisibility className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => handleEditCalculation(calculation)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-400/30 bg-green-400/20 text-green-300 transition-all duration-200 hover:scale-110 hover:bg-green-400/30 hover:text-green-200"
              title="Edit"
            >
              <MdEdit className="h-4 w-4" />
            </button>

            {calculation.status === "submitted" &&
              (isDownloading ? (
                <div className="flex items-center justify-center px-1.5">
                  <ClipLoader color="#4A90E2" size={20} />
                </div>
              ) : (
                <button
                  onClick={() => handleDownloadCalculation(calculation)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-400/20 text-purple-300 transition-all duration-200 hover:scale-110 hover:bg-purple-400/30 hover:text-purple-200"
                  title="Download"
                >
                  <MdDownload className="h-4 w-4" />
                </button>
              ))}
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default CalculationCard;
