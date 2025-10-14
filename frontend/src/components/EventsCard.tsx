import { Link } from 'react-router-dom';
import type { ViewEvent } from '../types/Event'
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
    event: ViewEvent
}


const EventsCard = ({ event }: EventCardProps) => {
    const {
        id,
        image,
        title,
        startDate,
        endDate,
        venue,
        status
    } = event;

    const getStatusColor = () => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const FALLBACK_IMG =
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678";

    return (


        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
            {/* Fixed-size image container */}
            <Link to={`/attendee/EventDetails/${id}`}>
                <div className="w-full h-48 overflow-hidden">
                    <img
                        className="w-full h-full object-cover rounded-lg"
                        src={image ? image : FALLBACK_IMG}
                        alt={title}
                    />
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 line-clamp-2">
                    {title}
                </h3>

                <div className="mb-3 space-y-1.5">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span className="text-sm text-gray-600">{`${startDate} - ${endDate}`}</span>
                    </div>

                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span className="text-sm text-gray-600 line-clamp-1">{venue.name}</span>
                    </div>
                </div>

                <div className="mt-auto pt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {status}
                    </span>

                    <Link to={`/attendee/EventDetails/${id}`}>
                        <button className="mt-3 w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition-colors">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EventsCard;
