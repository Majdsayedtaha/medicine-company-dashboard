import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  eventForm!: FormGroup;
  constructor(private fb: FormBuilder, private http: ApiService) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }
  addNewEvent() {
    this.http
      .post(environment.base + '/activity/add', {
        type: '1',
        name: this.eventForm.get('name')?.value,
        content: this.eventForm.get('content')?.value,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          console.log(res);
        } else {
          console.log(res);
        }
      });
  }

  onReset() {
    this.eventForm.reset();
  }
}
