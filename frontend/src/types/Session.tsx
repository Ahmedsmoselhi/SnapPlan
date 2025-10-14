import type { Speaker } from "./Speaker"
import type { TimeSlot } from "./TimeSlot"

export interface Session {
    id?: string | number
    name: string
    timeSlot: TimeSlot
    speaker: Speaker
}