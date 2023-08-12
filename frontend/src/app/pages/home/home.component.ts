import {Component, Inject, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl} from '@angular/forms';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";
import {AUTOMATIONS_SERVICE_TOKEN} from "../../services/automations/automations.service.token";
import {IAutomationsService} from "../../services/automations.service.interface";
import {IAutomationModel} from "../../models/automation.model.interface";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {AUTH_SERVICE_TOKEN} from "../../services/auth/auth.service.token";
import {IAuthService} from "../../services/auth.service.interface";
import {TOKEN_KEY, TOKEN_KEY_REFRESH} from "../../constants";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAutomationModalVisible = false;
  automationForm: FormGroup = this.fb.group({});
  isProfileVisible = false;
  profileForm: FormGroup = this.fb.group({});
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;

  automations: IAutomationModel[] = [];
  private automationImageReference: any;

  constructor(private fb: FormBuilder, private notification: NzNotificationService,
              @Inject(AUTOMATIONS_SERVICE_TOKEN) private automationsService: IAutomationsService,
              @Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService, private router: Router) {
  }

  ngOnInit() {
    this.automationForm = this.fb.group({
      automationName: ['', {validators: [Validators.required, Validators.maxLength(50)]}],
      automationHost: ['', {validators: [Validators.required, Validators.maxLength(50)]}],
      automationPort: ['', {validators: [Validators.required, Validators.min(1), Validators.max(65535)]}],
      //automationImage: ['', {validators: [this.imageValidator]}]
    });

    this.profileForm = this.fb.group({
      email: new FormControl('', {updateOn: 'blur', validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {updateOn: 'blur', validators: [Validators.required]}),
      confirmPassword: new FormControl('', {updateOn: 'blur', validators: [Validators.required]})
    }, {validators: this.checkPasswords});

    this.loadAutomations()

  }


  logout() {
    this.authService.logout().pipe(
      tap(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY_REFRESH);
        this.router.navigate(['/login']);
      })
    ).subscribe({
      error: (error) => {
        console.error('Error in logout:', error);
      }
    });
  }

  drop(event
         :
         CdkDragDrop<string[]>
  ) {
    moveItemInArray(this.automations, event.previousIndex, event.currentIndex);
    console.log(event.previousIndex, event.currentIndex, event.previousContainer, event.container);
    /*     if (event.previousContainer === event.container) {
           moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
         } else {
           transferArrayItem(event.previousContainer.data,
             event.container.data,
             event.previousIndex,
             event.currentIndex);
         }*/
    // Aqui você pode fazer uma chamada ao back-end para atualizar a ordem dos serviços
    this.automations.forEach((service, index) => {
      //service.position = index;
    });
    // Call the back-end to update the services
    //this.serviceService.updateServices(this.services).subscribe();
  }

  handleImageUpload({file, fileList}: NzUploadChangeParam): void {
    console.log(file);
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.notification.create(
        'success',
        'Upload Successful',
        `${file.name} image uploaded successfully.`
      );
      this.automationImageReference = file.response.imagePath;
    } else if (status === 'error') {
      this.notification.create(
        'error',
        'Upload Failed',
        `${file.name} image upload failed.`
      );
    }
  }


  showAutomationModal(): void {
    this.isAutomationModalVisible = true;
  }

  showProfileModal(): void {
    this.isProfileVisible = true;
  }

  onAutomationSubmit()
    :
    void {
    if (!
      this.automationForm.valid
    ) {
      for (const i in this.automationForm.controls) {
        this.automationForm.controls[i].markAsDirty();
        this.automationForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    console.log(this.automationForm.value);

    const automation: IAutomationModel = this.automationForm.value;
    this.automationsService.addAutomation(automation).subscribe({
      next: (response) => {
        console.log('Automation added successfully', response);
        this.notification.success('Success', 'Automation added successfully');
        this.automations.push(automation);
        this.isAutomationModalVisible = false;
        this.automationForm.reset();
      },
      error: (error) => {
        console.error('Error adding automation', error);
        this.notification.error('Error', 'Error adding automation');
      }
    });

  }

  onProfileSubmit()
    :
    void {
    if (!
      this.profileForm.valid
    ) {
      for (const i in this.profileForm.controls) {
        this.profileForm.controls[i].markAsDirty();
        this.profileForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    console.log('Profile form submit', this.profileForm.value);
    this.isProfileVisible = false;
    this.profileForm.reset();
  }

  handleAutomationCancel()
    :
    void {
    console.log('Button cancel clicked!');
    this.isAutomationModalVisible = false;
    this.automationForm.reset();
  }

  handleProfileCancel()
    :
    void {
    console.log('Profile form cancel');
    this.isProfileVisible = false;
    this.profileForm.reset();
  }

  checkPasswords(group:FormGroup) {
    // @ts-ignore
    let pass = group.get('password').value;
    // @ts-ignore
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : {notSame: true}
  }




  loadAutomations() {
    this.automationsService.getAutomations().subscribe({
      next: (automations: IAutomationModel[]) => {
        this.automations = automations;
      },
      error: (error) => {
        // registry a log
        console.error('Error fetching automations', error);
        this.notification.create(
          'error',
          'Error',
          'There was an error fetching the automations.'
        );
      }
    });
  }

}
