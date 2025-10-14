import { useState } from "react";
import {
  Edit,
  Trash2,
  Ban,
  Calendar,
  Check,
  X,
  Eye,
  Sidebar,
} from "lucide-react";
import SideBarComponent from "../Admin/SideBar";

const initialOrganizers = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@techcairo.com",
    joinedDate: "2024-01-15",
    status: "active",
    eventsCount: 12,
    location: "Cairo",
    phone: "+20 100 123 4567",
  },
  {
    id: 2,
    name: "Fatima El-Sharif",
    email: "fatima.elsharif@eventshub.eg",
    joinedDate: "2024-02-20",
    status: "active",
    eventsCount: 8,
    location: "Alexandria",
    phone: "+20 101 234 5678",
  },
  {
    id: 3,
    name: "Omar Mahmoud",
    email: "omar.mahmoud@confmanager.com",
    joinedDate: "2024-03-10",
    status: "banned",
    eventsCount: 5,
    location: "Giza",
    phone: "+20 102 345 6789",
  },
  {
    id: 4,
    name: "Yasmin Abdel Rahman",
    email: "yasmin.abdelrahman@eventspro.eg",
    joinedDate: "2024-04-05",
    status: "active",
    eventsCount: 15,
    location: "Sharm El Sheikh",
    phone: "+20 103 456 7890",
  },
  {
    id: 5,
    name: "Khaled Farouk",
    email: "khaled.farouk@meetingpoint.com",
    joinedDate: "2024-05-12",
    status: "active",
    eventsCount: 3,
    location: "Hurghada",
    phone: "+20 104 567 8901",
  },
];

const initialPendingOrganizers = [
  {
    id: 101,
    name: "Mariam Nasser",
    email: "mariam.nasser@gmail.com",
    appliedDate: "2024-08-10",
    location: "Cairo",
    phone: "+20 105 678 9012",
    experience: "3 years event management",
  },
  {
    id: 102,
    name: "Mohamed Ali",
    email: "mohamed.ali@yahoo.com",
    appliedDate: "2024-08-11",
    location: "Alexandria",
    phone: "+20 106 789 0123",
    experience: "5 years conference organizing",
  },
  {
    id: 103,
    name: "Nour El-Din",
    email: "nour.eldin@hotmail.com",
    appliedDate: "2024-08-12",
    location: "Luxor",
    phone: "+20 107 890 1234",
    experience: "2 years tech events",
  },
];

function Organizers() {
  const [organizers, setOrganizers] = useState(initialOrganizers);
  const [pendingOrganizers, setPendingOrganizers] = useState(
    initialPendingOrganizers
  );
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPending, setShowPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle edit
  const startEdit = (organizer) => {
    setEditingId(organizer.id);
    setEditForm(organizer);
  };

  const saveEdit = () => {
    setOrganizers(
      organizers.map((org) => (org.id === editingId ? editForm : org))
    );
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle delete
  const deleteOrganizer = (id) => {
    if (window.confirm("Are you sure you want to delete this organizer?")) {
      setOrganizers(organizers.filter((org) => org.id !== id));
    }
  };

  // Handle ban/unban
  const toggleBan = (id) => {
    setOrganizers(
      organizers.map((org) =>
        org.id === id
          ? { ...org, status: org.status === "banned" ? "active" : "banned" }
          : org
      )
    );
  };

  // Handle pending organizer approval
  const approveOrganizer = (pendingOrg) => {
    const newOrganizer = {
      id: Date.now(),
      name: pendingOrg.name,
      email: pendingOrg.email,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "active",
      eventsCount: 0,
      location: pendingOrg.location,
      phone: pendingOrg.phone,
    };

    setOrganizers([...organizers, newOrganizer]);
    setPendingOrganizers(
      pendingOrganizers.filter((org) => org.id !== pendingOrg.id)
    );
  };

  const rejectOrganizer = (id) => {
    setPendingOrganizers(pendingOrganizers.filter((org) => org.id !== id));
  };

  // Filter organizers based on search
  const filteredOrganizers = organizers.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SideBarComponent />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Sna<span className="text-red-700 text-extrabold">Plan</span>{" "}
          Organizers Dashboard
        </h1>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search organizers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowPending(!showPending)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPending
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending Accounts ({pendingOrganizers.length})
          </button>
        </div>
      </div>

      {/* Pending Organizers Section */}
      {showPending && (
        <div className="mb-8 bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">
            Pending Accounts
          </h2>
          {pendingOrganizers.length === 0 ? (
            <p className="text-orange-600">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {pendingOrganizers.map((org) => (
                <div
                  key={org.id}
                  className="bg-white rounded-lg p-4 border border-orange-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="font-medium text-gray-900">{org.name}</p>
                        <p className="text-sm text-gray-500">{org.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Applied: {org.appliedDate}
                        </p>
                        <p className="text-sm text-gray-600">{org.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{org.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          {org.experience}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveOrganizer(org)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectOrganizer(org.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {organizers.filter((o) => o.status === "active").length}
          </div>
          <div className="text-sm text-blue-600">Active Organizers</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {organizers.filter((o) => o.status === "banned").length}
          </div>
          <div className="text-sm text-red-600">Banned Organizers</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {pendingOrganizers.length}
          </div>
          <div className="text-sm text-orange-600">Pending Applications</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {organizers.reduce((sum, org) => sum + org.eventsCount, 0)}
          </div>
          <div className="text-sm text-green-600">Total Events</div>
        </div>
      </div>

      {/* Active Organizers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Organizers ({filteredOrganizers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizers.map((organizer) => (
                <tr key={organizer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === organizer.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          value={editForm.location || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              location: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Phone No."
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-xl font-medium text-gray-900">
                          {organizer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {organizer.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {organizer.location}
                        </div>
                        <div className="text-sm text-gray-500">
                          {organizer.phone}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(organizer.joinedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {organizer.eventsCount} events
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        organizer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {organizer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === organizer.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(organizer)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => toggleBan(organizer.id)}
                          className={`transition-colors ${
                            organizer.status === "banned"
                              ? "text-green-600 hover:text-green-900"
                              : "text-yellow-600 hover:text-yellow-900"
                          }`}
                          title={
                            organizer.status === "banned" ? "Unban" : "Ban"
                          }
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => deleteOrganizer(organizer.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="View Events"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrganizers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No organizers found matching your search.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Organizers;
