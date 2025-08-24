import Modal from '../../../components/Modal';
import { Flex, Separator, Text, Button } from '@radix-ui/themes';
import { Account } from '../../../../types/account';
import { RiAccountCircleFill } from 'react-icons/ri';
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
  // Use calculations that are already included in the account data
  const accountCalculations = account?.calculations || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Flex align="center" gap="2" mt="4">
          <RiAccountCircleFill size={72} color="gray" />
          <div>
            <Text as="div" size="7" weight="bold">
              {account?.name}
            </Text>
            <Text as="div" size="3" mb="1" weight="medium" color="gray">
              {account?.tinNumber}
            </Text>
          </div>
        </Flex>
      }
    >
      <div>
        <Text size="5" weight="bold">
          Calculations
        </Text>
        <Separator my="2" size="4" />

        {accountCalculations.length === 0 ? (
          <Flex justify="center" py="4">
            <Text size="3" color="gray">
              No calculations found for this account
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" gap="3" mt="5">
            {accountCalculations.map((calculation) => (
              <CalculationCard key={calculation.id} calculation={calculation} />
            ))}
          </Flex>
        )}
      </div>
    </Modal>
  );
};

export default ViewAccountModal;
