import type { Session } from '../types/Session'

interface SessionCardProps {
    session: Session
}


const SessionCard = ({ session }: SessionCardProps) => {
    return (
        <>
            <div className="flex items-center gap-4 border rounded-lg p-4 bg-white shadow-sm">

                <div className="text-sm font-medium text-gray-500 w-24 md:w-auto mr-auto md:mr-2">
                    {`${session.timeSlot.day}, ${session.timeSlot.startDate} - ${session.timeSlot.endDate}`}
                </div>

                <div className="flex flex-1 justify-between items-center">
                    <div className="text-lg font-medium">{session.name}</div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 ml-4 mr-2">
                        <img
                            src={session.speaker.profile}
                            alt={session.speaker.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{session.speaker.name}</span>
                    </div>

                </div>

            </div>
        </>
    )
}

export default SessionCard
