import {Request, Response} from "express";
import bcrypt from "bcrypt";
import {IUserService} from "../interfaces/IUserService";

export class UserController {

    constructor(private userService: IUserService) {
    }

    async create(req: Request, res: Response) {
        const {email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = this.userService.createUser(email, passwordHash);
        return res.status(201).json(newUser);
    }

    async update(req: Request, res: Response) {
        const {email, password} = req.body;
        const user = req.user;

        const updatedUser = await this.userService.updateUser(user.id, email, password);
        return res.status(204).json(updatedUser);
    }
}