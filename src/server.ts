import { prisma } from "../lib/prisma.js"
import app from "./app.js"
import config from "./config/env.js"

const port = config.port

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to database successfully")
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (err) {
        console.error("An error occurred:", err)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()


