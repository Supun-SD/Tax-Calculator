import { useState } from 'react';
import Navigation from '../../components/Navigation';
import { Calculation } from '../../../types/calculation';
import { DataTable, Column } from '../../components/DataTable';
import { calculations } from '../../../../mockdata/calculations';

const History = () => {
  const [activeTab, setActiveTab] = useState<'submitted' | 'draft'>(
    'submitted'
  );

  const columns: Column<Calculation>[] = [
    {
      key: 'dateAndTime',
      header: 'Date',
      width: 'w-1/6',
      sortable: true,
      render: (value: Date) => {
        return value.toLocaleDateString();
      },
    },
    {
      key: 'dateAndTime',
      header: 'Time',
      width: 'w-1/6',
      sortable: true,
      render: (value: Date) => {
        return value.toLocaleTimeString([], {
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
        return value.name;
      },
    },
    {
      key: 'account',
      header: 'TIN Number',
      width: 'w-1/6',
      sortable: true,
      searchable: true,
      render: (value: any) => {
        return value.tinNumber;
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

  const handleEdit = (calculation: Calculation) => {
    // TODO: Implement edit functionality
    // Placeholder for edit functionality
  };

  const handleDelete = (calculation: Calculation) => {
    // TODO: Implement delete functionality
    // Placeholder for delete functionality
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
              className={`group relative rounded-xl border-b-2 px-3 py-5 text-sm font-medium transition-all duration-200 ease-out ${
                activeTab === 'submitted'
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
              className={`group relative rounded-xl border-b-2 px-3 py-5 text-sm font-medium transition-all duration-200 ease-out ${
                activeTab === 'draft'
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

        {/* Data Table */}
        <DataTable
          data={filteredCalculations}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
          actionsColumn={{ view: true, edit: true, delete: true }}
        />
      </div>
    </div>
  );
};

export default History;
