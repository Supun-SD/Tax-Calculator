import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { DataTable, Column } from '../../components/DataTable';
import { useCalculations } from '../../hooks/useCalculations';
import { CalculationOverview } from '../../../types/calculation';
import { AlertDialog, Flex, Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import Button from '../../components/Button';
import { MdReceipt, MdDrafts } from 'react-icons/md';

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'submitted' | 'draft'>(
    'submitted'
  );
  const [deletingCalculation, setDeletingCalculation] = useState<CalculationOverview | undefined>(undefined);

  const {
    calculations,
    loading,
    error,
    isDeleting,
    fetchCalculations,
    deleteCalculation,
  } = useCalculations();

  useEffect(() => {
    fetchCalculations();
  }, []);

  const columns: Column<CalculationOverview>[] = [
    {
      key: 'createdAt',
      header: 'Date',
      width: 'w-1/6',
      sortable: true,
      render: (value: string) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      key: 'updatedAt',
      header: 'Time',
      width: 'w-1/6',
      sortable: true,
      render: (value: any, row: CalculationOverview) => {
        return new Date(row.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'account',
      header: 'Account Name',
      width: 'w-1/5',
      sortable: true,
      searchable: true,
      render: (value: any) => {
        return value?.name || 'N/A';
      },
    },
    {
      key: 'accountId',
      header: 'TIN Number',
      width: 'w-1/6',
      sortable: true,
      searchable: true,
      render: (value: any, row: CalculationOverview) => {
        return row.account?.tinNumber || 'N/A';
      },
    },
    {
      key: 'year',
      header: 'Year',
      width: 'w-1/6',
      sortable: true,
      searchable: true,
    },
  ];

  const handleEdit = async (calculation: CalculationOverview) => {
    navigate('/calculate', { state: { calculationId: calculation.id, isEditing: true } });
  };

  const handleDelete = (calculation: CalculationOverview) => {
    setDeletingCalculation(calculation);
  };

  const handleConfirmDelete = async () => {
    if (deletingCalculation) {
      const success = await deleteCalculation(deletingCalculation.id);
      if (success) {
        await fetchCalculations();
        setDeletingCalculation(undefined);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletingCalculation(undefined);
  };

  const handleView = async (calculation: CalculationOverview) => {
    navigate(`/view-calculation/${calculation.id}`);
  };

  const filteredCalculations = calculations.filter(
    (calculation) => calculation.status === activeTab
  );

  return (
    <div className="p-8">
      <Navigation title="History" />

      {/* Tabs Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('submitted')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'submitted'
              ? 'bg-green-400/20 text-green-300 border border-green-400/30'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <MdReceipt className="text-lg" />
            <span>Submitted</span>
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${activeTab === 'submitted'
              ? 'bg-green-400/30 text-green-200'
              : 'bg-gray-600 text-gray-300'
              }`}>
              {calculations.filter((c) => c.status === 'submitted').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'draft'
              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <MdDrafts className="text-lg" />
            <span>Drafts</span>
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${activeTab === 'draft'
              ? 'bg-yellow-400/30 text-yellow-200'
              : 'bg-gray-600 text-gray-300'
              }`}>
              {calculations.filter((c) => c.status === 'draft').length}
            </span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="flex justify-center items-center">
            <ClipLoader color="#3B82F6" size={32} />
            <span className="ml-3 text-gray-300">Loading calculations...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-300">Error loading calculations</h3>
              <div className="mt-2 text-sm text-red-200">
                <div>{error}</div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={fetchCalculations}
                  variant="danger"
                  size="sm"
                >
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <DataTable
            data={filteredCalculations}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
            actionsColumn={{ view: activeTab === 'submitted', edit: true, delete: true }}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingCalculation}>
        <AlertDialog.Content className="bg-surface-2 border border-white/20 rounded-xl">
          <AlertDialog.Title className="text-white">Delete Calculation</AlertDialog.Title>
          <AlertDialog.Description size="3" className="text-gray-300">
            Are you sure you want to delete this calculation for "{deletingCalculation?.account?.name}" ({deletingCalculation?.year})?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button
                variant="secondary"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                size="sm"
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {isDeleting ? (
              <div className="flex items-center justify-center px-4 py-2">
                <ClipLoader color="#EF4444" size={20} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="danger"
                  onClick={handleConfirmDelete}
                  size="sm"
                >
                  Delete Calculation
                </Button>
              </AlertDialog.Action>
            )}
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default History;
