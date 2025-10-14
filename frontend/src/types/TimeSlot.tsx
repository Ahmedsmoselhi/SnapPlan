export interface TimeSlot {
    id?: string | number
    day: 'Sunday' | 'Monday'
    | 'Tuesday' | 'Wednesday' | 'Thursday' |
    'Friday' | 'Saturday'
    startDate: string
    endDate: string
}