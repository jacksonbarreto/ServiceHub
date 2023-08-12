import {AppDataSource} from "../datasource/data-source";
import {Automation} from "../entities/Automation";

export const automationRepository = AppDataSource.getRepository(Automation);