import {IAutomationService} from "../interfaces/IAutomationService";
import {Repository} from "typeorm";
import {Automation} from "../entities/Automation";
import {BadRequestError} from "../helpers/api-errors";
import {AutomationUpdate} from "../interfaces/IAutomationUpdate";

export class AutomationService implements IAutomationService {
    constructor(private automationRepository: Repository<Automation>) {
    }

    async create(name: string, image: string, host: string, port: number) {
        if (!name || !image || !host || !port) {
            throw new BadRequestError('Missing name or image or host or port');
        }
        const maxPositionPlusOne = await this.automationRepository
            .createQueryBuilder('automation')
            .select('MAX(automation.position)', 'maxPosition')
            .getRawOne() as number;

        const newAutomation = this.automationRepository
            .create({name, image, host, port, position: maxPositionPlusOne + 1});

        await this.automationRepository.save(newAutomation);
        return newAutomation;
    }

    async delete(id: number): Promise<void> {
        const automation = await this.automationRepository.findOneBy({id});
        if (!automation) {
            throw new BadRequestError('Automation not found');
        }
        await this.automationRepository.delete(automation);
    }

    async readAll(): Promise<Automation[]> {
        return await this.automationRepository.find();
    }

    async read(id: number): Promise<Automation> {
        const automation = await this.automationRepository.findOneBy({id});
        if (!automation) {
            throw new BadRequestError('Automation not found');
        }
        return automation;
    }

    async update(id: number, automation: AutomationUpdate) {
        const automationToUpdate = await this.automationRepository.findOneBy({id});
        if (!automationToUpdate) {
            throw new BadRequestError('Automation not found');
        }

        if (automation.name) {
            if (automation.name.length > 50) {
                throw new BadRequestError('Name too long');
            }
            automationToUpdate.name = automation.name;
        }

        if (automation.port !== undefined) {
            if (automation.port < 0 || automation.port > 65535) {
                throw new BadRequestError('Port out of range');
            }
            automationToUpdate.port = automation.port;
        }

        if (automation.host) {
            if (automation.host.length > 50) {
                throw new BadRequestError('Host too long');
            }
            automationToUpdate.host = automation.host;
        }

        if (automation.image) {
            if (automation.image.length > 255) {
                throw new BadRequestError('Image too long');
            }
            automationToUpdate.image = automation.image;
        }

        await this.automationRepository.save(automationToUpdate);
        return automationToUpdate;
    }

    async swapPosition(id1: number, id2: number): Promise<void> {
        const automation1 = await this.automationRepository.findOneBy({id: id1});
        const automation2 = await this.automationRepository.findOneBy({id: id2});

        if (!automation1 || !automation2) {
            throw new BadRequestError('Automation not found');
        }

        const position1 = automation1.position;
        automation1.position = automation2.position;
        automation2.position = position1;

        await this.automationRepository.save(automation1);
        await this.automationRepository.save(automation2);
    }


}