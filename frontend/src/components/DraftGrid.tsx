import { useEffect, useState } from "react";
import DraftRow from "./DraftRow";
import type { DraftEvent } from "../types/Event";
import { getDraftEventsMock } from "../services/EventService";
import { LoaderCircle } from "lucide-react";

const DraftsGrid = () => {
  const [draftEvents, setDraftEvents] = useState<DraftEvent[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDraftEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const draftEvents: DraftEvent[] = await getDraftEventsMock();
        setDraftEvents(draftEvents);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchDraftEvents();
  }, []);

  return (
    <>
      {/* Events Table Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden mt-5">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Draft Events List
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Event Title
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Start Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                  End Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Venue
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {error && <div className="error-message">{error}</div>}

              {loading ? (
                <LoaderCircle
                  className="animate-spin"
                  color={loading ? "#9CA3AF" : "#fff"}
                />
              ) : (
                draftEvents.map((event, index) => (
                  <DraftRow draftEvent={event} key={index} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing 3 of 12 draft events</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DraftsGrid;
