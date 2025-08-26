import Modal from '../../../components/Modal';
import { Flex, Text } from '@radix-ui/themes';
import { MdAccountCircle, MdCalculate, MdVisibility } from 'react-icons/md';
import { Account } from '../../../../types/account';
import CalculationCard from './CalculationCard';

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
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-400/20 rounded-xl flex items-center justify-center">
            <MdAccountCircle className="text-blue-300 text-3xl" />
          </div>
          <div>
            <Text as="div" size="6" weight="bold" className="text-white">
              {account?.name}
            </Text>
            <Text as="div" size="3" className="text-gray-300 font-medium">
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
          <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
            <MdCalculate className="text-green-300 text-lg" />
          </div>
          <Text size="5" weight="bold" className="text-white">
            Calculations
          </Text>
        </div>


        {accountCalculations.length === 0 ? (
          <Flex justify="center" py="8">
            <div className="text-center">
              <MdVisibility className="text-gray-400 text-4xl mx-auto mb-3" />
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
