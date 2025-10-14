import { Calendar, MapPin, Ticket } from "lucide-react";
import SessionCard from "../components/SessionCard";

import { eventsDummy } from "../data/events";
import { useParams } from "react-router-dom";

const EventDetailsCard = () => {
  const { id } = useParams();
  const event = eventsDummy.find((e) => id === e.id?.toString());

  const getStatusColor = () => {
    switch (event?.status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678";

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-5xl my-10 mx-5 px-4 pb-8 pt-4 border border-gray-200 rounded-lg shadow-sm md:w-[700px] lg:w-[900px]">
          {/* Image Banner */}

          <div className="w-full h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={event?.image ? event?.image : FALLBACK_IMG}
              alt={event?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{event?.title}</h1>

            {/* Status   */}

            <span
              className={`px-2 py-1 text-sm rounded-full mt-4 ${getStatusColor()}`}
            >
              {event?.status}
            </span>
          </div>

          {/* Date & Venue */}

          <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{`${event?.startDate} - ${event?.endDate}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{event?.venue.name}</span>
            </div>
          </div>

          {/* Tickets Categories */}

          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-orange-600 mb-6">
              <Ticket size={18} />
              <span>{event?.ticket?.map((t) => t.type).join(" - ")}</span>
            </div>
          </div>

          {/* Description */}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-gray-600">{event?.description}</p>
          </div>

          {/* Sessions */}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sessions
            </h2>

            {event?.sessions?.map((session) => (
              <div className="mb-4">
                <SessionCard session={session} />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500">
              Edit Event
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              View Registrations
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailsCard;
