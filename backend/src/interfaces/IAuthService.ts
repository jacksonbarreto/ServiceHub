
export interface IAuthService {

    login(email: string, password: string): Promise<{ token: string; refreshToken: string }>;
    refresh(refreshToken: string): Promise<string>;
    logout(token: string): Promise<void>;
    isAuthenticated(token: string): Promise<boolean>;
}