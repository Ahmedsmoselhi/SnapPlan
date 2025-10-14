import DraftGrid from "../../components/DraftGrid"
import Sidebar from "../../components/Sidebar"
import StatusCard from "../../components/StatusCard"

const DraftEvents = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 md:ml-48 transition-all duration-300">
                <div className="p-5 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <StatusCard title="Total Drafts" info="12" />
                        <StatusCard title="Last Updates" info="3 days ago" />
                    </div>

                    <DraftGrid />

                </div>
            </div>
        </div>
    )
}

export default DraftEvents