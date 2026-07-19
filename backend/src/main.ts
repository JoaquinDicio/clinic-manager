import express from 'express'
import whatsappRouter from './routes/whatsapp.routes.js'
import clientsRouter from './routes/clients.routes.js'
import { checkWhatsappReady } from './middlewares/checkWhatsappReady.js'
import { connectToWhatsapp } from './config/whatsapp.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import templatesRouter from './routes/templates.routes.js'
import { startDispatcher } from './jobs/dispatcher.js'
import appointmentsRouter from './routes/appointments.routes.js'
import schedulesRouter from './routes/schedules.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173"
}))

const PORT = process.env.PORT || 8080

async function main() {

    app.use("/wpp", checkWhatsappReady, whatsappRouter)

    await connectToWhatsapp()

    app.listen(PORT, () => console.log("App is launched at:", PORT))

    app.use("/clients", clientsRouter) // stablish endpoints for clients after db is ready to use

    app.use("/templates", templatesRouter)

    app.use("/schedules", schedulesRouter)

    app.use("/appointments", appointmentsRouter)

    app.use("/dashboard", dashboardRouter)

    startDispatcher()

    app.use(errorMiddleware)

}

main()  