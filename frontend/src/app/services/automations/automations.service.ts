import { Injectable } from '@angular/core';
import { IAutomationsService } from '../automations.service.interface';
import {IAutomationModel} from "../../models/automation.model.interface";
import {AutomationModel} from "../../models/automation.model";
import {delay, Observable, of} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AutomationsService implements IAutomationsService{
  private http: any;

  constructor() { }

  getAutomations(): Observable<IAutomationModel[]> {
    // return this.http.get<IAutomationModel[]>('your-api-url');
    return of([
      new AutomationModel('Web Server', '', 'webserver', 80, 0),
      new AutomationModel('Secure Web Server', 'image2.png', 'securewebserver', 443, 1),
      new AutomationModel('FTP Server', 'image3.png', 'ftpserver', 21, 2),
      new AutomationModel('Secure FTP Server', 'image4.png', 'sftpserver', 22, 3),
      new AutomationModel('SMTP Server', 'image5.png', 'smtpserver', 25, 4),
      new AutomationModel('DNS Server', 'image6.png', 'dnsserver', 53, 5),
      new AutomationModel('DHCP Server', 'image7.png', 'dhcpserver', 67, 6),
      new AutomationModel('POP3 Server', 'image8.png', 'pop3server', 110, 7),
      new AutomationModel('IMAP Server', 'image9.png', 'imapserver', 143, 8),
      new AutomationModel('LDAP Server', 'image10.png', 'ldapserver', 389, 9),
      new AutomationModel('Secure LDAP Server', 'image11.png', 'sldapserver', 636, 10),
      new AutomationModel('SQL Server', 'image12.png', 'sqlserver', 1433, 11),
      new AutomationModel('Document Scanner', 'image13.png', 'docscanner', 8080, 12),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Media Server', 'image14.png', 'mediaserver', 9000, 13),
      new AutomationModel('Home Automation', 'image15.png', 'homeauto', 8008, 14)
    ]).pipe(delay(1000)); // delay of 2 seconds
  }

  addAutomation(automation: IAutomationModel): Observable<any> {
    // return this.http.post('your-api-url', automation);
    return of({ success: true }).pipe(delay(1000)); // Simula uma resposta bem-sucedida após 1 segundo
  }

  deleteAutomation(name: string): Observable<any> {
    // return this.http.delete(`your-api-url/${name}`);
    return of({ success: true }).pipe(delay(1000)); // Simula uma resposta bem-sucedida após 1 segundo
  }

  getAutomation(name: string): Observable<IAutomationModel> {
    // return this.http.get<IAutomationModel>(`your-api-url/${name}`);
    return of(new AutomationModel('Web Server', 'image1.png', 'webserver', 80, 0)).pipe(delay(1000)); // Simula uma resposta após 1 segundo
  }

  updateAutomation(automation: IAutomationModel): Observable<any> {
    // return this.http.put(`your-api-url/${automation.name}`, automation);
    return of({ success: true }).pipe(delay(1000)); // Simula uma resposta bem-sucedida após 1 segundo
  }

    swapAutomations(automation1: IAutomationModel, automation2: IAutomationModel): Observable<any> {
      return this.http.patch(`your-api-url/swap`, automation1, automation2);
    }


}
