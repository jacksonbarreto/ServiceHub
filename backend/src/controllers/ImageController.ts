import {Request, Response} from "express";
import {IImageService} from "../interfaces/IImageService";

export class ImageController {
    constructor(private imageService: IImageService) {}

    async create(req: Request, res: Response) {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'File is required' });
        }
        const imageSize = Number(process.env.IMAGE_SIZE_LIMIT) || 5;
        if (file.size > imageSize * 1024 * 1024) {
            return res.status(400).json({ message: 'File size must be less than ${imageSize} MB' });
        }
        const imagePath = await this.imageService.create(file);
        return res.status(201).json({ imagePath });
    }

    async read(req: Request, res: Response) {
        const imagePath = req.params.path;
        const file = await this.imageService.read(imagePath);
        return res.status(200).send(file);
    }
}