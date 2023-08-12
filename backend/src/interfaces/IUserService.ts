import {User} from "../entities/User";

export interface IUserService {
    createUser(email: string, password: string): Promise<Omit<User, 'password'>>;
    updateUser(id: number, email?: string, password?: string): Promise<Omit<User, 'password'>>;
}

