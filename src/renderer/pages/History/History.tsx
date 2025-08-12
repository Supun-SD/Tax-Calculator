import Navigation from '../../components/Navigation';
import { Calculation } from '../../../types/calculation';
import { DataTable, Column } from '../../components/DataTable';
import { calculations } from '../../../../mockdata/calculations';

const History = () => {
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

  return (
    <div className="p-8">
      <Navigation title="History" />

      <div className="mt-8">
        <DataTable
          data={calculations}
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
