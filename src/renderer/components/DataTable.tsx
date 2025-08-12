import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchKeys?: (keyof T)[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  className?: string;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  showActions?: boolean;
  actionsColumn?: {
    edit?: boolean;
    view?: boolean;
    delete?: boolean;
  };
}

export function DataTable<T extends { id?: number | string }>({
  data,
  columns,
  searchValue: externalSearchValue,
  onSearchChange,
  searchKeys,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
  className = '',
  onEdit,
  onView,
  onDelete,
  showActions = false,
  actionsColumn = { edit: true, view: true, delete: true },
}: DataTableProps<T>) {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Use external search value if provided, otherwise use internal
  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Determine searchable keys
  const searchableKeys =
    searchKeys ||
    columns.filter((col) => col.searchable !== false).map((col) => col.key);

  // Filter data based on search using useEffect with debouncing for better performance
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = data.filter((item) =>
        searchableKeys.some((key) => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          return value
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        })
      );
      setFilteredData(filtered);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [data, searchValue, searchableKeys]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    return value?.toString() || '';
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`rounded-[30px] bg-surface p-3 ${className}`}>
      {/* Table */}
      <table className="w-full table-fixed">
        <thead className="rounded-t-[30px] bg-surface-2">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.key)}
                className={`px-8 py-4 text-left font-bold text-gray-300 ${
                  column.sortable !== false
                    ? 'cursor-pointer hover:text-white'
                    : ''
                } ${index === 0 ? 'rounded-tl-[20px]' : ''} ${
                  index === columns.length - 1 && !showActions
                    ? 'rounded-tr-[20px]'
                    : ''
                } ${column.width || ''}`}
                onClick={() =>
                  column.sortable !== false && handleSort(column.key)
                }
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable !== false && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            {showActions && (
              <th className="w-32 rounded-tr-[20px] px-8 py-4 text-right font-bold text-gray-300">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`border-b border-[#484848] transition-colors hover:bg-gray-800`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-8 py-4 text-sm text-white"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
                {showActions && (
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {actionsColumn.view && onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="rounded p-1 transition-colors hover:bg-gray-700"
                          title="View"
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      )}
                      {actionsColumn.edit && onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="rounded p-1 transition-colors hover:bg-gray-700"
                          title="Edit"
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                      {actionsColumn.delete && onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="rounded p-1 transition-colors hover:bg-gray-700"
                          title="Delete"
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="p-16 text-center text-lg text-ph"
              >
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {sortedData.length > 0 && (
        <div className="my-6 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, sortedData.length)} of {sortedData.length}{' '}
              results
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="rounded border border-gray-600 bg-surface-2 px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-gray-600"
              title="Previous page"
            >
              <IoChevronBack className="h-5 w-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded px-3 py-1 text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-gray-600"
              title="Next page"
            >
              <IoChevronForward className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
