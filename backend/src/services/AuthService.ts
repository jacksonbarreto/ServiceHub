import {Repository} from 'typeorm';
import {User} from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {IAuthService} from "../interfaces/IAuthService";
import {BadRequestError, UnauthorizedError} from "../helpers/api-errors";
import validator from "validator";
import {IJWTPayload} from "../interfaces/IJWTPayload";
import {ITokenBlacklistService} from "../interfaces/ITokenBlacklistService";

export class AuthService implements IAuthService {
    constructor(private userRepository: Repository<User>,
                private tokenBlacklistService: ITokenBlacklistService) {
    }

    async login(email: string, password: string): Promise<{ token: string; refreshToken: string }> {
        if (!email || !password) {
            throw new BadRequestError('Missing email or password');
        }

        if (!validator.isEmail(email)) {
            throw new BadRequestError('Invalid email');
        }

        const user = await this.userRepository.findOneBy({email});
        if (!user) {
            throw new BadRequestError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError('Invalid email or password');
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string,
            {expiresIn: process.env.JWT_EXPIRATION ?? '4h'});
        const refreshToken = jwt.sign({id: user.id}, process.env.JWT_SECRET as string,
            {expiresIn: process.env.JWT_REFRESH_EXPIRATION ?? '2d'});

        return {token, refreshToken};
    }

    async refresh(refreshToken: string) {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as IJWTPayload;

        if (await this.tokenBlacklistService.isBlacklisted(refreshToken)) {
            throw new UnauthorizedError('Refresh token has been revoked');
        }

        return jwt.sign({id: payload.id}, process.env.JWT_SECRET as string,
            {expiresIn: process.env.JWT_EXPIRATION ?? '4h'});
    }

    async logout(token: string): Promise<void> {
        const decodedAccess = jwt.decode(token);
        if (typeof decodedAccess !== 'string' && decodedAccess?.exp) {
            const accessExpiry = decodedAccess.exp - Math.floor(Date.now() / 1000);
            await this.tokenBlacklistService.addToBlacklist(token, accessExpiry);
        }
    }

    async isAuthenticated(token: string): Promise<boolean> {
        if (await this.tokenBlacklistService.isBlacklisted(token)) {
            return false;
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;
        const user = await this.userRepository.findOneBy({id: payload.id});
        return !!user;
    }



}
