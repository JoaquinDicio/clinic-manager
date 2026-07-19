export interface WhatsappBulkDTO {
    messages: Message[];
}
export type Message = {
    phone: string
    message: string
    scheduleId: string
}

export type SendResult = {
    phone: string
    status: "sent" | "failed"
    scheduleId? : string
    error?: unknown
}

export type BulkItem = {
    phone: string
    message: string
    scheduleId: string
}