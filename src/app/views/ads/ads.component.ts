import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit {
  adForm!: FormGroup;
  ads!: any[];
  activeAd: any;
  faTrashAlt = faTrashAlt;
  globalFormData: any = new FormData();
  constructor(private fb: FormBuilder, private http: ApiService, private notify: NotifierService) {}
  ngOnInit(): void {
    this.getAllAd();
    this.adForm = this.fb.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  getAllAd() {
    this.http
      .post(environment.base + '/activity/get-all', {
        type: 3,
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
          this.ads = res.activities;
        } else if (res.status == 'error') {
          this.ads = [];
          console.log(res);
        }
      });
  }

  getAdDetails(id: number) {
    this.http.get(environment.base + '/activity/get?id=' + id).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.activeAd = res.activity;
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
    this.globalFormData.append('type', 3);
    this.globalFormData.append('title', this.adForm.get('name')?.value);
    this.globalFormData.append('content', this.adForm.get('content')?.value);
    this.globalFormData.append('id', id);
    this.http
      .post(environment.base + '/activity/update', this.globalFormData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllAd();
          this.adForm.reset();
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
          this.getAllAd();
        } else {
          console.log(res);
        }
      });
  }

  addNewAd() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    this.globalFormData.append('type', 3);
    this.globalFormData.append('title', this.adForm.get('name')?.value);
    this.globalFormData.append('content', this.adForm.get('content')?.value);
    this.http
      .post(environment.base + '/activity/add', this.globalFormData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllAd();
          this.adForm.reset();
        } else {
          console.log(res);
        }
      });
  }
}
