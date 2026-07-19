export interface ScheduleDTO {
    templateId: string
    clientId: string
    sendAt: string
    variables?: Record<string, string>
}