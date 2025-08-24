import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { DataTable, Column } from '../../components/DataTable';
import { useCalculations } from '../../hooks/useCalculations';
import { CalculationOverview } from '../../../types/calculation';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import Button from '../../components/Button';

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
        // Refresh the calculations list
        await fetchCalculations();
        setDeletingCalculation(undefined);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletingCalculation(undefined);
  };

  const handleView = async (calculation: CalculationOverview) => {
    // TODO: Implement edit functionality
    // Placeholder for edit functionality
  };

  // Filter calculations based on active tab
  const filteredCalculations = calculations.filter(
    (calculation) => calculation.status === activeTab
  );

  return (
    <div className="p-8">
      <Navigation title="History" />

      <div className="mt-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-surface-2 pb-3">
          <nav className="-mb-px flex space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('submitted')}
              className={`group relative rounded-xl border-b-2 px-3 py-5 text-sm font-medium transition-all duration-200 ease-out ${activeTab === 'submitted'
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-transparent text-gray-400 hover:border-gray-300 hover:bg-surface hover:text-white'
                }`}
            >
              Submitted Calculations
              <span
                className={`ml-2 rounded-full px-2 py-1 text-xs transition-transform duration-200 ${activeTab === 'submitted' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'} group-hover:-translate-y-0.5`}
              >
                {calculations.filter((c) => c.status === 'submitted').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`group relative rounded-xl border-b-2 px-3 py-5 text-sm font-medium transition-all duration-200 ease-out ${activeTab === 'draft'
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-transparent text-gray-400 hover:border-gray-300 hover:bg-surface hover:text-white'
                }`}
            >
              Draft Calculations
              <span
                className={`ml-2 rounded-full px-2 py-1 text-xs transition-transform duration-200 ${activeTab === 'draft' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'} group-hover:-translate-y-0.5`}
              >
                {calculations.filter((c) => c.status === 'draft').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading calculations...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading calculations</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchCalculations}
                    className="bg-red-50 px-2 py-1 text-sm font-medium text-red-800 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <DataTable
            data={filteredCalculations}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
            actionsColumn={{ view: true, edit: true, delete: true }}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={!!deletingCalculation}>
        <AlertDialog.Content className="bg-popup-bg">
          <AlertDialog.Title>Delete Calculation</AlertDialog.Title>
          <AlertDialog.Description size="3">
            Are you sure you want to delete this calculation for "{deletingCalculation?.account?.name}" ({deletingCalculation?.year})?
          </AlertDialog.Description>

          <Flex gap="3" mt="6" justify="end" align="center">
            <AlertDialog.Cancel>
              <Button variant="secondary" onClick={handleCancelDelete} disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {isDeleting ? (
              <div className="flex items-center justify-center px-14 mx-3">
                <ClipLoader color="gray" size={28} />
              </div>
            ) : (
              <AlertDialog.Action>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-white"
                  onClick={handleConfirmDelete}
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
