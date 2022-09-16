import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
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
  constructor(private fb: FormBuilder, private http: ApiService) {}

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
    this.http
      .post(environment.base + '/activity/update', {
        type: 1,
        title: this.articleForm.get('name')?.value,
        content: this.articleForm.get('content')?.value,
        id: id,
        // activityImages: '',
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
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
    this.http
      .post(environment.base + '/activity/add', {
        type: 1,
        title: this.articleForm.get('name')?.value,
        content: this.articleForm.get('content')?.value,
        // activityImages: '',
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.getAllArticles();
        } else {
          console.log(res);
        }
      });
  }
}
