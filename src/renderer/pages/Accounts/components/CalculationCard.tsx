import React from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import {
  RiCalculatorLine,
  RiDownloadLine,
  RiEditLine,
  RiEyeLine,
} from 'react-icons/ri';

interface CalculationCardProps {
  calculation: any;
}

const CalculationCard: React.FC<CalculationCardProps> = ({ calculation }) => {
  const handleViewCalculation = (calculation: any) => {
    console.log('View calculation:', calculation);
    // TODO: Implement view calculation logic
  };

  const handleEditCalculation = (calculation: any) => {
    console.log('Edit calculation:', calculation);
    // TODO: Implement edit calculation logic
  };

  const handleDownloadCalculation = (calculation: any) => {
    console.log('Download calculation:', calculation);
    // TODO: Implement download calculation logic
  };

  return (
    <Flex
      key={calculation.id}
      align="center"
      justify="between"
      p="3"
      px="5"
      style={{
        backgroundColor: 'var(--gray-1)',
        borderRadius: '8px',
        border: '1px solid var(--gray-3)',
      }}
    >
      <Flex align="center" gap="3">
        <RiCalculatorLine size={20} color="var(--gray-11)" />
        <Text size="3" weight="medium">
          {calculation.year}
        </Text>
      </Flex>

      <Flex gap="4" align="center">
        {calculation.status === 'draft' && <div className='text-xs text-white bg-primary px-2 py-1 rounded-md'>Draft</div>}
        {
          calculation.status === 'submitted' && (<Button
            variant="ghost"
            size="1"
            onClick={() => handleViewCalculation(calculation)}
            style={{ padding: '4px' }}
            className="cursor-pointer text-black"
          >
            <RiEyeLine size={16} />
          </Button>
          )}
        <Button
          variant="ghost"
          size="1"
          onClick={() => handleEditCalculation(calculation)}
          style={{ padding: '4px' }}
          className="cursor-pointer text-black"
        >
          <RiEditLine size={16} />
        </Button>
        {
          calculation.status === 'submitted' && (
            <Button
              variant="ghost"
              size="1"
              onClick={() => handleDownloadCalculation(calculation)}
              style={{ padding: '4px' }}
              className="cursor-pointer text-black"
            >
              <RiDownloadLine size={16} />
            </Button>
          )}
      </Flex>
    </Flex>
  );
};

export default CalculationCard;
