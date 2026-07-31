export type Client = {
    id: string
    name: string
    phone: string
    createdAt: string
}

export type Template = {
    id: string
    name: string
    body: string
    variables: string[]
    createdAt: string
}

export type Schedule = {
    id: string
    clientId: string
    templateId: string | null
    sendAt: string
    variables?: Record<string, string>
    status: "pending" | "processing" | "sent" | "failed"
    createdAt: string
}

export type Appointment = {
    id: string
    clientId: string
    date: string
    time: string
    slots: number
    reminder: boolean
    templateId?: string | null
    createdAt: string
}

export type DBSchema = {
    clients: Client[]
    templates: Template[]
    schedules: Schedule[]
    appointments: Appointment[]
}