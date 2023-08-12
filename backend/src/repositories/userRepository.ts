import {AppDataSource} from "../datasource/data-source";
import {User} from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);