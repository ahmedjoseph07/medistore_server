import express, { Request, Response } from "express"
import { categoryRoutes } from "./modules/categories/category.route"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({ ok: true, message: "Welcome to medistore_server" })
})

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: "Server is healthy" })
})

app.use("/api/v1", categoryRoutes)

export default app;