import dotenv from "dotenv"
import path from "path"
dotenv.config({
    path: path.join(process.cwd(), '.env')
})

export const config = {
    port: process.env.PORT || 4000,
    database_url: process.env.DATABASE_URL as string,
    app_url: process.env.APP_URL,
    app_user : process.env.APP_USER,
    app_pass: process.env.APP_PASS
}

export default config