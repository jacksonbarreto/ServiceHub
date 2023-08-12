import {Request, Response, NextFunction} from "express";
import {UnauthorizedError} from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import {IJWTPayload} from "../interfaces/IJWTPayload";
import {Repository} from "typeorm";
import {User} from "../entities/User";
import {ITokenBlacklistService} from "../interfaces/ITokenBlacklistService";

export class AuthMiddleware {
    private static instance: AuthMiddleware;
    constructor(private userRepository: Repository<User>,
                private tokenBlacklistService: ITokenBlacklistService) {
    }

    static getInstance(userRepository: Repository<User>, tokenBlacklistService: ITokenBlacklistService) {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware(userRepository, tokenBlacklistService);
        }
        return AuthMiddleware.instance;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new UnauthorizedError('Missing authorization header');

        const [, token] = authHeader.split(' ');

        if (await this.tokenBlacklistService.isBlacklisted(token)) {
            throw new UnauthorizedError('Token has been revoked');
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;
        const {id} = payload;
        const user = await this.userRepository.findOneBy({id});
        if (!user)
            throw new UnauthorizedError('Unauthorized');
        const {password: _, ...userWithoutPassword} = user;
        req.user = userWithoutPassword;
        next();
    }
}