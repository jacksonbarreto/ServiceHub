import {IAutomationModel} from "../models/automation.model.interface";
import {Observable} from "rxjs";
export interface IAutomationsService {
  getAutomations(): Observable<IAutomationModel[]>;
  getAutomation(name: string): Observable<IAutomationModel>;
  addAutomation(automation: IAutomationModel): Observable<any>;
  updateAutomation(automation: IAutomationModel): Observable<any>;
  deleteAutomation(name: string): Observable<any>;
  swapAutomations(automation1: IAutomationModel, automation2: IAutomationModel): Observable<any>;
}

