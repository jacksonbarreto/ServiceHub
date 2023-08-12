export interface IImageService {
    create(image: Express.Multer.File): Promise<string>;

    read(imagePath: string): Promise<Buffer>;
}