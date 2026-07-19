import { Request, Response } from "express"
import dashboardService from "../services/dashboard.service.js"

const dashboardController = {

    async getDashboard(req: Request, res: Response) {
        const response = await dashboardService.getDashboard()
        res.status(200).json(response)
    }

}

export default dashboardController