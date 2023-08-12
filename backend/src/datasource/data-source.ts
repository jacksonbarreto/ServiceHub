import 'reflect-metadata'
import { DataSource } from "typeorm";
import path from "path";

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: ["dist/entities/*{.js,.ts}"],
    migrations: ["dist/migrations/*.{ts,js}"],
})