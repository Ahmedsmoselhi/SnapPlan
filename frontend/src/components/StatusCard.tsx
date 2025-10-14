
type StatusCardProps = {
    title: string
    info: string
}

const StatusCard = ({ title, info }: StatusCardProps) => {
    return (
        <>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-xl font-medium text-orange-500 mt-2">{info}</p>
            </div>
        </>
    )
}

export default StatusCard
