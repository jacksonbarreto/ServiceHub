import {User} from "../entities/User";
import {Automation} from "../entities/Automation";
import {AutomationUpdate} from "../interfaces/IAutomationUpdate";

declare global {
    namespace Express {
        export interface Request {
            user: Omit<User, 'password'> & Partial<Pick<User, 'password'>>;
            automation: Partial<Automation>;
            automationUpdate: AutomationUpdate;
        }
    }
}