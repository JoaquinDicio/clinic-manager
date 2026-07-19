export interface AppointmentDTO {
    clientId: string,
    date: string,
    time: string,
    reminder: boolean,
    slots: number
}