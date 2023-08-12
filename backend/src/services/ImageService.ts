import {IImageService} from "../interfaces/IImageService";
import path from "path";
import * as fs from "fs";

export class ImageService implements IImageService {

    private readonly uploadFolder: string = 'uploads';

    async create(image: Express.Multer.File): Promise<string> {
        const imageName = image.filename;
        return path.join(this.uploadFolder, imageName);
    }

    async read(imagePath: string): Promise<Buffer> {
        return fs.readFileSync(path.join(this.uploadFolder, imagePath));
    }
}