import {Request, Response} from 'express';
import {IAuthService} from "../interfaces/IAuthService";
import {BadRequestError, UnauthorizedError} from "../helpers/api-errors";

export class AuthController {

    constructor(private authService: IAuthService) {
    }

    async login(req: Request, res: Response) {
        const {email, password} = req.body;
        const {token, refreshToken} = await this.authService.login(email, password);
        return res.json({token, refreshToken});
    }

    async refresh(req: Request, res: Response) {
        const {refreshToken} = req.body;

        if (!refreshToken) throw new BadRequestError('Missing refresh token')

        const newJwt = await this.authService.refresh(refreshToken);

        return res.json({token: newJwt});
    }

    async logout(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new UnauthorizedError('Missing authorization header');

        const [, token] = authHeader.split(' ');
        await this.authService.logout(token);

        const {refreshToken} = req.body;
        if (!refreshToken) throw new BadRequestError('Missing refresh token')
        await this.authService.logout(refreshToken);

        return res.status(204).send();
    }

    async isAuthenticated(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new UnauthorizedError('Missing authorization header');

        const [, token] = authHeader.split(' ');
        const authenticated = await this.authService.isAuthenticated(token);

        return res.status(200).json({authenticated});
    }

}
