import {createClient} from 'redis';
import {ITokenBlacklistService} from "../interfaces/ITokenBlacklistService";

export class TokenBlacklistService implements ITokenBlacklistService {
    private client: ReturnType<typeof createClient>;

    constructor() {
        this.client = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,

        });
        this.client.connect();
    }

    async addToBlacklist(token: string, expiry: number): Promise<void> {
        await this.client.set(token, 'blacklisted', {EX: expiry});
    }


    async isBlacklisted(token: string): Promise<boolean> {
        const reply = await this.client.get(token);
        return reply !== null;
    }

}
