export type UpcomingSchedule = {
    id: string
    name: string
    phone: string
    send_at: string
    status: "pending" | "processing" | "sent" | "failed"
}

export type DashboardData = {
    appointmentsToday: number
    pendingMessages: number
    sentToday: number
    upcomingSchedules: UpcomingSchedule[]
}