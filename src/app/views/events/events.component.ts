import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ApiService } from 'src/app/services/api.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  eventForm!: FormGroup;
  events!: any[];
  activeEvent: any;
  faTrashAlt = faTrashAlt;
  globalFormData: any = new FormData();
  constructor(private fb: FormBuilder, private http: ApiService, private notify: NotifierService) {}

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
          this.globalFormData.append('activityImages[]', file, droppedFile.relativePath);
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
  ngOnInit(): void {
    this.getAllEvents();
    this.eventForm = this.fb.group({
      name: [this.activeEvent?.title, [Validators.required]],
      content: [this.activeEvent?.content, [Validators.required]],
    });
  }
  getAllEvents() {
    this.http
      .post(environment.base + '/activity/get-all', {
        type: 2,
        searchFilters: {
          filters: [
            { name: 'title', status: false },
            { name: 'content', status: false },
          ],
          searchText: '',
          platform: 0,
        },
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.events = res.activities;
        } else if (res.status == 'error') {
          this.events = [];
          console.log(res);
        }
      });
  }

  getEventDetails(id: number) {
    this.http.get(environment.base + '/activity/get?id=' + id).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.activeEvent = res.activity;
      } else {
        console.log(res);
      }
    });
  }

  shortDate(value: string): string {
    return value.substring(0, 10);
  }
  updateEvent(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    this.globalFormData.append('type', 2);
    this.globalFormData.append('title', this.eventForm.get('name')?.value);
    this.globalFormData.append('content', this.eventForm.get('content')?.value);
    this.globalFormData.append('id', id);
    this.http
      .post(environment.base + '/activity/update', this.globalFormData, { httpOptions })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.restFormData();
          this.getAllEvents();
          this.eventForm.reset();
        } else {
          console.log(res);
        }
      });
  }

  deleteEvent(id: number) {
    this.http
      .post(environment.base + '/activity/delete', {
        id: id,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllEvents();
        } else {
          console.log(res);
        }
      });
  }

  addNewEvent() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    this.globalFormData.append('type', 2);
    this.globalFormData.append('title', this.eventForm.get('name')?.value);
    this.globalFormData.append('content', this.eventForm.get('content')?.value);

    this.http.post(environment.base + '/activity/add', this.globalFormData, { httpOptions }).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.restFormData();
        this.getAllEvents();
        this.eventForm.reset();
      } else {
        console.log(res);
      }
    });
  }

  onReset() {
    this.eventForm.reset();
  }
  restFormData() {
    this.globalFormData = new FormData();
    this.files = [];
  }
}
