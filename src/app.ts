import express, { Request, Response } from "express"
import { categoryRoutes } from "./modules/category/category.route.js"
import { medicineRoutes } from "./modules/medicine/medicine.route.js"
import { orderRoutes } from "./modules/order/order.route.js"
import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import { auth } from "./lib/auth.js"
import config from "./config/env.js"

const app = express()

app.use(cors({
    origin: config.app_url || "http://localhost:4000",
    credentials: true

}))

app.use(express.json())

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.status(200).json({ ok: true, message: "Welcome to medistore_server" })
})

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: "Server is healthy" })
})

app.use("/api/v1", categoryRoutes)
app.use("/api/v1", medicineRoutes)
app.use("/api/v1", orderRoutes)

export default app;