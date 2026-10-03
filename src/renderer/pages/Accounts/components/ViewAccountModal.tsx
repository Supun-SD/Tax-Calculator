import Modal from "../../../components/Modal";
import { Flex, Text } from "@radix-ui/themes";
import { MdAccountCircle, MdCalculate, MdVisibility } from "react-icons/md";
import { Account } from "../../../../types/account";
import CalculationCard from "./CalculationCard";

interface ViewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: Account;
}

const ViewAccountModal: React.FC<ViewAccountModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  const accountCalculations = account?.calculations || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-400/20">
            <MdAccountCircle className="text-3xl text-blue-300" />
          </div>
          <div>
            <Text as="div" size="6" weight="bold" className="text-white">
              {account?.name}
            </Text>
            <Text as="div" size="3" className="font-medium text-gray-300">
              TIN: {account?.tinNumber}
            </Text>
          </div>
        </div>
      }
      maxWidth="600px"
      isDark={true}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400/20">
            <MdCalculate className="text-lg text-green-300" />
          </div>
          <Text size="5" weight="bold" className="text-white">
            Calculations
          </Text>
        </div>

        {accountCalculations.length === 0 ? (
          <Flex justify="center" py="8">
            <div className="text-center">
              <MdVisibility className="mx-auto mb-3 text-4xl text-gray-400" />
              <Text size="3" className="text-gray-400">
                No calculations found for this account
              </Text>
            </div>
          </Flex>
        ) : (
          <div className="space-y-3">
            {accountCalculations.map((calculation) => (
              <CalculationCard key={calculation.id} calculation={calculation} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewAccountModal;
