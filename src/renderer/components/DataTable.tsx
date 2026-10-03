import React, { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdVisibility, MdEdit, MdDelete, MdSort } from "react-icons/md";

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
  searchKeys,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
  className = "",
  onEdit,
  onView,
  onDelete,
  showActions = false,
  actionsColumn = { edit: true, view: true, delete: true },
}: DataTableProps<T>) {
  const [internalSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const searchableKeys =
    searchKeys ||
    columns.filter((col) => col.searchable !== false).map((col) => col.key);

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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, searchValue, searchableKeys]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

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
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    return value?.toString() || "";
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) {
      return <MdSort className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <div className="text-blue-400">↑</div>
    ) : (
      <div className="text-blue-400">↓</div>
    );
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-surface backdrop-blur-sm ${className}`}
    >
      <table className="w-full">
        <thead className="border-b border-white/10 bg-white/5">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-300 ${
                  column.sortable !== false
                    ? "cursor-pointer transition-all duration-200 hover:bg-white/5 hover:text-white"
                    : ""
                } ${column.width || ""}`}
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
              <th className="w-32 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`transition-all duration-200 hover:bg-gray-700/20 ${
                  rowIndex % 2 === 0 ? "bg-transparent" : "bg-gray-700/10"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-white"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {actionsColumn.view && onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-400/20 text-blue-300 transition-all duration-200 hover:scale-110 hover:bg-blue-400/30 hover:text-blue-200"
                          title="View"
                        >
                          <MdVisibility className="h-4 w-4" />
                        </button>
                      )}
                      {actionsColumn.edit && onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-400/30 bg-green-400/20 text-green-300 transition-all duration-200 hover:scale-110 hover:bg-green-400/30 hover:text-green-200"
                          title="Edit"
                        >
                          <MdEdit className="h-4 w-4" />
                        </button>
                      )}
                      {actionsColumn.delete && onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/30 bg-red-400/20 text-red-300 transition-all duration-200 hover:scale-110 hover:bg-red-400/30 hover:text-red-200"
                          title="Delete"
                        >
                          <MdDelete className="h-4 w-4" />
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
                className="p-16 text-center text-lg text-gray-400"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {sortedData.length > 0 && (
        <div className="border-t border-white/10 bg-white/5 px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, sortedData.length)} of {sortedData.length}{" "}
                results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-surface-2"
                    >
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
                className="rounded-lg p-2 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
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
                      className={`rounded-lg px-3 py-1 text-sm transition-all duration-200 ${
                        currentPage === pageNum
                          ? "border border-blue-400/30 bg-blue-400/20 text-blue-300"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
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
                className="rounded-lg p-2 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
                title="Next page"
              >
                <IoChevronForward className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
