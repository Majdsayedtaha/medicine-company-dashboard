import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { User } from 'src/app/interfaces/user.model';
import { ApiService } from 'src/app/services/api.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  companyForm!: FormGroup;
  users!: User[];
  teams!: any[];
  faSquarePlus = faSquarePlus;
  globalFormData = new FormData();
  constructor(private fb: FormBuilder, private api: ApiService, private notify: NotifierService) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getInfoCompany();

    this.companyForm = this.fb.group({
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
      img: [''],
      numOfEmployee: [null, [Validators.required]],
      companyTeams: this.fb.array([]),
    });
  }

  // ! UPLOADER START
  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (this.isFileAllowed(droppedFile.fileEntry.name) == false) {
        this.files = [];
        this.notify.warningNotification('Sorry, You Can Drop Just Images');
        return;
      }
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.globalFormData.append('companyImage', file, droppedFile.relativePath);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bpg'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    // if (isDevMode()) {
    //   console.log('extension du fichier : ', extension);
    // }
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }
  // ! UPLOADER END

  get companyTeams(): FormArray {
    return this.companyForm.get('companyTeams') as FormArray;
  }

  addNewCompanyTeam() {
    this.companyTeams.push(
      this.fb.group({
        id: [17],
        position: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        description: ['', [Validators.required]],
      })
    );
  }

  getAllUsers() {
    this.api.get(environment.base + '/site/get-all-users').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.users = res.users;
      } else {
        this.notify.errorNotification(res.error);
      }
    });
  }

  getInfoCompany() {
    this.api.get(environment.base + '/company/get?id=1').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.teams = res.company.companyTeams;
        console.log(this.teams);
      } else {
        // this.notify.errorNotification(res.error);
      }
    });
  }

  addNewDetails() {
    if (this.companyForm.status === 'INVALID') return;

    const company = {
      description: this.companyForm.get('description')?.value,
      name: this.companyForm.get('name')?.value,
      numOfEmployee: this.companyForm.get('numOfEmployee')?.value,
      companyTeams: this.companyForm.get('companyTeams')?.value,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };

    this.globalFormData.append('name', company.name);
    this.globalFormData.append('description', company.description);
    this.globalFormData.append('numOfEmployee', company.numOfEmployee);
    // for (const cd of this.companyForm.value.companyTeams) {
    this.globalFormData.append('companyTeams[]', this.companyForm.value.companyTeams);
    console.log(this.companyForm.value.companyTeams);
    // }

    this.api
      .post(environment.base + '/company/save-company-info', this.globalFormData, { httpOptions })
      .subscribe((res: any) => {
        console.log(res);
        this.onResetCompanyForm();
      });
    
  }

  processFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.upload(file);
    }
  }
  file!: File;
  upload(fileTest: File) {
    this.file = fileTest;
  }

  onResetCompanyForm() {
    this.companyForm.reset('');
  }
}
