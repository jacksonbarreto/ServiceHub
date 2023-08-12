import {IAutomationService} from "../interfaces/IAutomationService";
import {Request, Response} from "express";
export class AutomationController{
    constructor(private automationService: IAutomationService) {
    }

    async create(req: Request, res: Response) {
        const {name, image, host, port} = req.body;
        const newAutomation = this.automationService.create(name, image, host, port);
        return res.status(201).json(newAutomation);
    }

    async update(req: Request, res: Response) {
        const updatedAutomation = this.automationService.update(req.automationUpdate.id, req.automationUpdate);
        if (!updatedAutomation) {
            return res.status(404).json({message: 'Automation not found'});
        }
        return res.status(204).json(updatedAutomation);
    }

    async delete(req: Request, res: Response) {
        const {id} = req.body;
        const deletedAutomation = this.automationService.delete(id);
        return res.status(204).json(deletedAutomation);
    }

    async read(req: Request, res: Response) {
        const rawId = req.params.id;
        if (!rawId.match(/^\d+$/)) {
            return res.status(400).json({message: 'Invalid id'});
        }
        const id = parseInt(req.params.id, 10);
        const readAutomation = this.automationService.read(id);
        return res.status(204).json(readAutomation);
    }

    async readAll(req: Request, res: Response) {
        const readAllAutomation = this.automationService.readAll();
        return res.status(204).json(readAllAutomation);
    }

    async swapPosition(req: Request, res: Response) {
        const {id1, id2} = req.body;
        const swapPositionAutomation = this.automationService.swapPosition(id1, id2);
        return res.status(204).json(swapPositionAutomation);
    }
}