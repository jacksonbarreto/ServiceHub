import {Automation} from "../entities/Automation";
import {AutomationUpdate} from "./IAutomationUpdate";


export interface IAutomationService {
    create(name: string, image: string, host: string, port: number): Promise<Automation>;
    read(id: number): Promise<Automation>;
    readAll(): Promise<Automation[]>;
    update(id: number, automation: AutomationUpdate): Promise<Automation>;
    swapPosition(id1: number, id2: number): Promise<void>;
    delete(id: number): Promise<void>;
}