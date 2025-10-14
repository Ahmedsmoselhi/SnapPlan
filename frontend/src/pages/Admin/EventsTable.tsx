import React from "react";
import { Eye } from "lucide-react";
import type { Conference } from "../../types/Conference";

interface ConferencesTableProps {
  conferences: Conference[];
  title?: string;
  showFullPageButton?: boolean;
  onFullPageClick?: () => void;
  maxHeight?: string;
  limit?: number;
  enableEditing?: boolean;
  enableActions?: boolean;
  onEdit?: (id: string, field: keyof Conference, value: string) => void;
  onDelete?: (id: string) => void;
  editingCell?: { rowId: string; field: keyof Conference } | null;
  editValue?: string;
  onStartEdit?: (
    rowId: string,
    field: keyof Conference,
    currentValue: string
  ) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onEditValueChange?: (value: string) => void;
  showDeleteConfirm?: string | null;
  onShowDeleteConfirm?: (id: string | null) => void;
}

const ConferencesTable: React.FC<ConferencesTableProps> = ({
  conferences,
  title = "Conferences",
  showFullPageButton = false,
  onFullPageClick,
  maxHeight,
  limit,
}) => {
  const getStatusColor = (status: Conference["status"]): string => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Conference["status"]): string => {
    switch (status) {
      case "upcoming":
        return "UPCOMING";
      case "ongoing":
        return "ONGOING";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return "UNKNOWN";
    }
  };

  // Apply limit if specified
  const displayedConferences = limit
    ? conferences.slice(0, limit)
    : conferences;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        {showFullPageButton && onFullPageClick && (
          <button
            onClick={onFullPageClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center space-x-2 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Full Page</span>
          </button>
        )}
      </div>

      {/* Table Container with optional max height and scroll */}
      <div
        className="overflow-x-auto overflow-y-auto min-w-0"
        style={maxHeight ? { maxHeight } : {}}
      >
        <table className="w-full table-auto">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Conference #
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Event Name
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Company Name
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Organizer Name
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                State
              </th>
              <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedConferences.map((conference) => (
              <tr
                key={conference.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 text-sm md:text-base text-gray-600 truncate max-w-xs">
                  {conference.id}
                </td>
                <td className="py-4 px-6 text-sm md:text-base text-gray-900 font-medium truncate max-w-xs">
                  {conference.name}
                </td>
                <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                  {conference.companyName}
                </td>
                <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                  {conference.organizerName}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(
                      conference.status
                    )}`}
                  >
                    {getStatusText(conference.status)}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                  {conference.state === "Accepted"
                    ? "✅"
                    : conference.state === "Rejected"
                    ? "❌"
                    : "🔎"}
                </td>
                <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                  {conference.createdDate}
                </td>
              </tr>
            ))}
            {displayedConferences.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No conferences found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* footer showing count info */}
      {limit && conferences.length > limit && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Showing {limit} of {conferences.length} conferences
          </p>
        </div>
      )}
    </div>
  );
};

export default ConferencesTable;
