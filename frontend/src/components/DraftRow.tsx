import type { DraftEvent } from "../types/Event"


type DraftRowProps = {
    draftEvent: DraftEvent
}

const DraftRow = ({ draftEvent }: DraftRowProps) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="p-3 border-b border-gray-200 text-gray-800">{draftEvent.title}</td>
            <td className="p-3 border-b border-gray-200 text-gray-600">{draftEvent.startDate}</td>
            <td className="p-3 border-b border-gray-200 text-gray-600">{draftEvent.endDate}</td>
            <td className="p-3 border-b border-gray-200 text-gray-600">{draftEvent.venue}</td>
            <td className="p-3 border-b border-gray-200">
                <button className="px-3 py-1.5 text-white rounded-md text-sm bg-orange-600 hover:bg-orange-800 transition-colors">
                    View Details
                </button>
            </td>
        </tr>
    )
}

export default DraftRow
