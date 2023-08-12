//import 'express-async-errors';
import {AppDataSource} from './datasource/data-source';
import app from './app';
import fs from 'fs';
import path from 'path';
import bcrypt from "bcrypt";


const imagePath = process.env.IMAGE_UPLOAD_PATH || 'uploads';
export const uploadFolder = path.join(__dirname, imagePath);

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {recursive: true});
}

const serverPort = Number(process.env.BACKEND_PORT) || 3333;

async function printPassword() {
    try {
        const hash = await bcrypt.hash('1234', 10);
        console.log('password:' + hash);
    } catch (error) {
        console.error('Erro ao criar hash:', error);
    }
}

printPassword();

AppDataSource.initialize().then(() => {
    console.log('Server running on port ' + serverPort);
    return app.listen(serverPort);
});