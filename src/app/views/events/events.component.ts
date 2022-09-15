import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
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

  constructor(private fb: FormBuilder, private http: ApiService) {}

  ngOnInit(): void {
    this.getAllEvents();
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
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
    this.http
      .post(environment.base + '/activity/update', {
        type: 2,
        title: this.eventForm.get('name')?.value,
        content: this.eventForm.get('content')?.value,
        id: id,
        // activityImages: '',
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllEvents();
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
    this.http
      .post(environment.base + '/activity/add', {
        type: 2,
        title: this.eventForm.get('name')?.value,
        content: this.eventForm.get('content')?.value,
        // activityImages: '',
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllEvents();
        } else {
          console.log(res);
        }
      });
  }
}
