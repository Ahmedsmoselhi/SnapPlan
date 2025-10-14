export interface Ticket {
    id?: string | number
    type: 'Standard' | 'Premium' | 'VIP'
    price?: number
    quantityAvailable?: number
}