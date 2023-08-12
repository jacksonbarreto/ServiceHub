
export interface ITokenBlacklistService {
    addToBlacklist(token: string, expiry: number): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
}