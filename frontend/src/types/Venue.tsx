import type {Room} from "./Room"
export interface Venue {
    id?: string  | number
    name : string
    address: string 
    location : string
    rooms : Room[]
}