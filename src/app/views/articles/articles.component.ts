import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ApiService } from 'src/app/services/api.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  articleForm!: FormGroup;
  articles!: any[];
  activeArticle: any;
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
          this.globalFormData.append('medicineImages[]', file, droppedFile.relativePath);
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
    this.getAllArticles();
    this.articleForm = this.fb.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  getAllArticles() {
    this.http
      .post(environment.base + '/activity/get-all', {
        type: 1,
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
          this.articles = res.activities;
        } else if (res.status == 'error') {
          this.articles = [];
          console.log(res);
        }
      });
  }

  getArticleDetails(id: number) {
    this.http.get(environment.base + '/activity/get?id=' + id).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.activeArticle = res.activity;
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
    this.globalFormData.append('type', 1);
    this.globalFormData.append('title', this.articleForm.get('name')?.value);
    this.globalFormData.append('content', this.articleForm.get('content')?.value);
    this.globalFormData.append('id', id);
    this.http
      .post(environment.base + '/activity/update', this.globalFormData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.restFormData();
          this.getAllArticles();
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
          this.getAllArticles();
        } else {
          console.log(res);
        }
      });
  }

  addNewArticles() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    this.globalFormData.append('type', 1);
    this.globalFormData.append('title', this.articleForm.get('name')?.value);
    this.globalFormData.append('content', this.articleForm.get('content')?.value);
    this.http
      .post(environment.base + '/activity/add', this.globalFormData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.restFormData();
          this.getAllArticles();
        } else {
          console.log(res);
        }
      });
  }
  restFormData() {
    // this.globalFormData. .forEach((val: any, key: any, fD: any) => {
    //   console.log(key, val, fD);
    //   this.globalFormData.delete(key);
    // });
    this.globalFormData = new FormData();
    this.files = [];
  }
}
