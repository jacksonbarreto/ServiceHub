import bcrypt from 'bcrypt';
import {Repository} from "typeorm";
import {User} from "../entities/User";
import validator from 'validator';
import {BadRequestError} from "../helpers/api-errors";
import {IUserService} from "../interfaces/IUserService";


export class UserService implements IUserService {
    constructor(private userRepository: Repository<User>) {
    }

    async createUser(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestError('Missing email or password');
        }

        if (!validator.isEmail(email)) {
            throw new BadRequestError('Invalid email');
        }

        const userExist = await this.userRepository.findOneBy({email});
        if (userExist) {
            throw new BadRequestError('User already exists')
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({email, password: passwordHash});
        await this.userRepository.save(newUser);
        const {password: _, ...userWithoutPassword} = newUser;
        return userWithoutPassword;
    }

    async updateUser(id: number, email?: string, password?: string) {
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new BadRequestError('Invalid request');
        }

        if (email) {
            if (!validator.isEmail(email)) {
                throw new BadRequestError('Invalid email');
            }
            user.email = email;
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await this.userRepository.save(user);
        const {password: _, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }
}
