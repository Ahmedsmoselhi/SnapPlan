import { useState } from "react";
import { Calendar, Building, Building2, Frown } from "lucide-react";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import SearchAndFilter from "./SearchAndFilter";
import Table from "./EventsTable";

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

const AdminHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Conference["status"]
  >("all");

  const [conferences] = useState<Conference[]>([
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

  const navigate = useNavigate();

  const goToEventManager = () => {
    navigate("/admin/events");
  };

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

  return (
    <div className="min-h-screen flex md:flex-row ">
      {/* Sidebar */}
      <SideBar />
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-8 min-w-0 overflow-auto">
        {/* Search + Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative bg-green-300 rounded-lg p-6 overflow-hidden">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Upcoming Events</h3>
              <p className="text-2xl md:text-3xl font-bold">
                {
                  filteredConferences.filter(
                    (conf) => conf.status === "upcoming"
                  ).length
                }
              </p>
              <p className="text-sm opacity-90">Events</p>
            </div>
            <Calendar className="w-12 h-12 opacity-30 absolute top-6 right-6" />
          </div>

          <div className="relative bg-orange-300 rounded-lg p-6 overflow-hidden">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Events</h3>
              <p className="text-2xl md:text-3xl font-bold">
                {filteredConferences.length}
              </p>
              <p className="text-sm opacity-90">Events</p>
            </div>
            <Building2 className="w-12 h-12 opacity-30 absolute top-6 right-6" />
          </div>

          <div className="relative bg-purple-300  rounded-lg p-6 overflow-hidden">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Events Pending</h3>
              <p className="text-2xl md:text-3xl font-bold">
                {
                  filteredConferences.filter(
                    (conf) => conf.state === "Not Assigned"
                  ).length
                }
              </p>
              <p className="text-sm opacity-90">Events</p>
            </div>
            <Frown className="w-12 h-12 opacity-30 absolute top-6 right-6" />
          </div>

          <div className="relative bg-blue-300  rounded-lg p-6 overflow-hidden">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Active Events</h3>
              <p className="text-2xl md:text-3xl font-bold">
                {
                  filteredConferences.filter(
                    (conf) => conf.status === "ongoing"
                  ).length
                }
              </p>
              <p className="text-sm opacity-90">Running</p>
            </div>
            <Building className="w-12 h-12 opacity-30 absolute top-6 right-6" />
          </div>
        </div>

        {/* Pending Events Table */}
        <Table
          conferences={filteredConferences}
          title="Pending Events"
          showFullPageButton={true}
          onFullPageClick={goToEventManager}
          limit={6}
        />
      </main>
    </div>
  );
};

export default AdminHome;
