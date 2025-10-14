import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  Trash2,
} from "lucide-react";
import SearchAndFilter from "./SearchAndFilter";
import SideBar from "../Admin/SideBar";

function Events() {
  interface Conference {
    id: string;
    name: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    state: "Accepted" | "Rejected" | "Not Assigned";
    companyName: string;
    organizerName: string;
    createdDate: string;
    lastUpdated: string;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Conference["status"]
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    field: keyof Conference;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const entriesPerPage = 15;

  const [conferences, setConferences] = useState<Conference[]>([
    {
      id: "CONF-001",
      name: "Tech Summit 2024",
      status: "upcoming",
      state: "Rejected",
      companyName: "Tech Innovators",
      organizerName: "Ahmed Hassan",
      createdDate: "Apr 18, 2024",
      lastUpdated: "Today",
    },
    {
      id: "CONF-002",
      name: "Guc Dr Hany Ai Lecture",
      status: "ongoing",
      state: "Accepted",
      companyName: "GUC AI Research",
      organizerName: "Fatima El-Sayed",
      createdDate: "Mar 29, 2024",
      lastUpdated: "Yesterday",
    },
    {
      id: "CONF-003",
      name: "Verto Wave Meeting",
      status: "completed",
      state: "Not Assigned",
      companyName: "VertoWave Ltd.",
      organizerName: "Omar Mahmoud",
      createdDate: "Feb 10, 2024",
      lastUpdated: "Feb 21, 2024",
    },
    {
      id: "CONF-004",
      name: "Cairo International Book Fair",
      status: "completed",
      state: "Accepted",
      companyName: "CIBF Organizers",
      organizerName: "Mona Abdel-Rahman",
      createdDate: "Jan 25, 2024",
      lastUpdated: "Feb 5, 2024",
    },
    {
      id: "CONF-005",
      name: "Egypt Economic Forum",
      status: "upcoming",
      state: "Accepted",
      companyName: "Egypt Economic Board",
      organizerName: "Khaled Ibrahim",
      createdDate: "Aug 2, 2024",
      lastUpdated: "Aug 10, 2024",
    },
    {
      id: "CONF-006",
      name: "Alexandria Film Festival",
      status: "ongoing",
      state: "Rejected",
      companyName: "AlexFilm Productions",
      organizerName: "Nadia Farouk",
      createdDate: "Aug 9, 2024",
      lastUpdated: "Today",
    },
    {
      id: "CONF-007",
      name: "Aswan Cultural Week",
      status: "cancelled",
      state: "Not Assigned",
      companyName: "Aswan Cultural Council",
      organizerName: "Youssef Ali",
      createdDate: "Jun 14, 2024",
      lastUpdated: "Jun 20, 2024",
    },
    {
      id: "CONF-008",
      name: "Going to the Pyramids",
      status: "upcoming",
      state: "Accepted",
      companyName: "Pyramids Tours",
      organizerName: "Sarah Mohamed",
      createdDate: "Sep 15, 2024",
      lastUpdated: "Sep 16, 2024",
    },
    {
      id: "CONF-009",
      name: "El Gouna Startup Summit",
      status: "completed",
      state: "Accepted",
      companyName: "El Gouna Ventures",
      organizerName: "Hassan Mostafa",
      createdDate: "May 3, 2024",
      lastUpdated: "May 12, 2024",
    },
    {
      id: "CONF-010",
      name: "me4 3arf",
      status: "ongoing",
      state: "Accepted",
      companyName: "Me4 3arf Co.",
      organizerName: "Layla Nasser",
      createdDate: "Aug 5, 2024",
      lastUpdated: "Yesterday",
    },
    {
      id: "CONF-011",
      name: "Cairo Tech Expo",
      status: "upcoming",
      state: "Accepted",
      companyName: "Cairo Expo Center",
      organizerName: "Mohamed Gamal",
      createdDate: "Oct 1, 2024",
      lastUpdated: "Oct 2, 2024",
    },
    {
      id: "CONF-012",
      name: "Nile Innovation Forum",
      status: "ongoing",
      state: "Accepted",
      companyName: "Nile Ventures",
      organizerName: "Amira Shawky",
      createdDate: "Sep 20, 2024",
      lastUpdated: "Today",
    },
    {
      id: "CONF-013",
      name: "Egyptian Developers Meetup",
      status: "completed",
      state: "Accepted",
      companyName: "DevEgypt",
      organizerName: "Tarek Zidan",
      createdDate: "Jul 10, 2024",
      lastUpdated: "Jul 15, 2024",
    },
    {
      id: "CONF-014",
      name: "Smart Cities Conference",
      status: "upcoming",
      state: "Not Assigned",
      companyName: "Smart Egypt",
      organizerName: "Rana Helmy",
      createdDate: "Nov 5, 2024",
      lastUpdated: "Nov 6, 2024",
    },
    {
      id: "CONF-015",
      name: "Suez Canal Business Summit",
      status: "ongoing",
      state: "Accepted",
      companyName: "Suez Biz Group",
      organizerName: "Mahmoud Saeed",
      createdDate: "Aug 28, 2024",
      lastUpdated: "Yesterday",
    },
    {
      id: "CONF-016",
      name: "Red Sea Tourism Conference",
      status: "upcoming",
      state: "Accepted",
      companyName: "Red Sea Tourism",
      organizerName: "Hala Kamal",
      createdDate: "Dec 1, 2024",
      lastUpdated: "Dec 2, 2024",
    },
    {
      id: "CONF-017",
      name: "Digital Marketing Summit",
      status: "completed",
      state: "Accepted",
      companyName: "Digital Egypt",
      organizerName: "Ramy Fouad",
      createdDate: "Jun 5, 2024",
      lastUpdated: "Jun 10, 2024",
    },
    {
      id: "CONF-018",
      name: "Fintech Cairo",
      status: "ongoing",
      state: "Not Assigned",
      companyName: "FinTech Hub",
      organizerName: "Dina Mansour",
      createdDate: "Nov 15, 2024",
      lastUpdated: "Today",
    },
    {
      id: "CONF-019",
      name: "Healthcare Innovation Forum",
      status: "upcoming",
      state: "Accepted",
      companyName: "MedTech Egypt",
      organizerName: "Ayman Salah",
      createdDate: "Jan 10, 2025",
      lastUpdated: "Jan 11, 2025",
    },
    {
      id: "CONF-020",
      name: "Renewable Energy Expo",
      status: "cancelled",
      state: "Rejected",
      companyName: "Green Energy Co.",
      organizerName: "Yasmin Othman",
      createdDate: "Mar 15, 2024",
      lastUpdated: "Mar 20, 2024",
    },
  ]);

  const getStatusColor = (status: Conference["status"]): string => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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

  // Handle editing
  const startEditing = (
    rowId: string,
    field: keyof Conference,
    currentValue: string
  ) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    setConferences((prev) =>
      prev.map((conf) => {
        if (conf.id === editingCell.rowId) {
          const updated = { ...conf, [editingCell.field]: editValue };
          // Update lastUpdated when any field is changed
          updated.lastUpdated = "Just now";
          return updated;
        }
        return conf;
      })
    );

    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Handle delete
  const deleteConference = (id: string) => {
    setConferences((prev) => prev.filter((conf) => conf.id !== id));
    setShowDeleteConfirm(null);
    // If current page becomes empty, go to previous page
    const remainingCount = conferences.length - 1;
    const newTotalPages = Math.ceil(remainingCount / entriesPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Filter conferences
  const filteredConferences = conferences.filter((conf) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      conf.name.toLowerCase().includes(q) ||
      conf.id.toLowerCase().includes(q) ||
      conf.companyName.toLowerCase().includes(q) ||
      conf.organizerName.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || conf.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredConferences.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentConferences = filteredConferences.slice(startIndex, endIndex);

  // Reset to first page when search/filter changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: "all" | Conference["status"]) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render editable cell
  const renderEditableCell = (
    conference: Conference,
    field: keyof Conference,
    value: string,
    isDropdown = false
  ) => {
    const isEditing =
      editingCell?.rowId === conference.id && editingCell?.field === field;

    if (isEditing) {
      if (isDropdown) {
        if (field === "status") {
          return (
            <div className="flex items-center gap-2">
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-white text-gray-900 px-2 py-1 rounded text-sm outline-none border border-blue-400"
                autoFocus
              >
                <option value="upcoming">upcoming</option>
                <option value="ongoing">ongoing</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
              <button
                onClick={saveEdit}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        } else if (field === "state") {
          return (
            <div className="flex items-center gap-2">
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-white text-gray-900 px-2 py-1 rounded text-sm outline-none border border-blue-400"
                autoFocus
              >
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Not Assigned">Not Assigned</option>
              </select>
              <button
                onClick={saveEdit}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }
      }

      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-white text-gray-900 px-2 py-1 rounded text-sm outline-none border border-blue-400 min-w-0 flex-1"
            autoFocus
          />
          <button
            onClick={saveEdit}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={cancelEdit}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer group"
        onClick={() => startEditing(conference.id, field, value)}
      >
        <span className="flex-1">{value}</span>
        <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SideBar */}
      <SideBar />
      <div className="flex-1 p-4 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {" "}
            Sna<span className="text-red-600 font-thin">Plan</span> Events
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm text-center">
            Click on any field to edit. Press Enter to save, Escape to cancel.
          </p>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Results Summary */}
        <div className="mb-4 text-gray-600 text-sm">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredConferences.length)} of{" "}
          {filteredConferences.length} results
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                  Company Name
                </th>
                <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                  Event Name
                </th>
                <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                  Organizer
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
                <th className="text-left py-3 px-6 text-sm md:text-base text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentConferences.map((conference, index) => (
                <tr
                  key={`${conference.id}-${index}`}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 text-sm md:text-base text-gray-900">
                    {renderEditableCell(
                      conference,
                      "companyName",
                      conference.companyName
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm md:text-base text-gray-900 font-medium">
                    {renderEditableCell(conference, "name", conference.name)}
                  </td>
                  <td className="py-4 px-6 text-sm md:text-base text-gray-900">
                    {renderEditableCell(
                      conference,
                      "organizerName",
                      conference.organizerName
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingCell?.rowId === conference.id &&
                    editingCell?.field === "status" ? (
                      renderEditableCell(
                        conference,
                        "status",
                        conference.status,
                        true
                      )
                    ) : (
                      <div
                        className="hover:bg-gray-100 p-1 rounded cursor-pointer group"
                        onClick={() =>
                          startEditing(
                            conference.id,
                            "status",
                            conference.status
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(
                              conference.status
                            )}`}
                          >
                            {getStatusText(conference.status)}
                          </span>
                          <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm md:text-base text-gray-700">
                    {editingCell?.rowId === conference.id &&
                    editingCell?.field === "state" ? (
                      renderEditableCell(
                        conference,
                        "state",
                        conference.state,
                        true
                      )
                    ) : (
                      <div
                        className="hover:bg-gray-100 p-1 rounded cursor-pointer group"
                        onClick={() =>
                          startEditing(conference.id, "state", conference.state)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span>
                            {conference.state === "Accepted"
                              ? "✅"
                              : conference.state === "Rejected"
                              ? "❌"
                              : "🔎"}
                          </span>
                          <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm md:text-base text-gray-700">
                    {renderEditableCell(
                      conference,
                      "createdDate",
                      conference.createdDate
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(conference.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentConferences.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No conferences found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-gray-900 text-lg font-semibold mb-4">
                Delete Event
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConference(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
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
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
