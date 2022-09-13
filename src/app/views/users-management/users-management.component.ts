import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { faDownload, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/interfaces/user.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NotifierService } from 'src/app/services/notifier.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GetRowIdParams, GridOptions, GridReadyEvent } from 'ag-grid-community';

interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: number;
  region?: string;
  country?: string;
  city?: string;
  specialMark?: string;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
  user: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 5,
    region: '',
    country: '',
    city: '',
    specialMark: '',
  };
  userModel?: User;
  users: IUser[] = [];
  roles = ['Doctor', 'Pharmacist', ' Sales Representative', 'Scientific Representative', 'Agent', 'Company Manager'];
  constructor(private http: ApiService, private router: Router, private notify: NotifierService) {}
  faDownload = faDownload;
  faUser = faUser;
  faUpload = faUpload;
  ngOnInit(): void {
    this.loadUsers();
  }



  
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  columnDefs = [
    // { headerName: '#', field: '#', sortable: true, filter: true, checkboxSelection: true },
    { headerName: 'FirstName', field: 'FirstName', sortable: true, filter: true },
    { headerName: 'LastName', field: 'LastName', sortable: true },
    { headerName: 'Email', field: 'Email', sortable: true },
    { headerName: 'Role', field: 'Role', sortable: true },
    { headerName: 'Region', field: 'Region', sortable: true },
    { headerName: 'Country', field: 'Country', sortable: true },
    { headerName: 'City', field: 'City', sortable: true },
    { headerName: 'SpecialMark', field: 'SpecialMark', sortable: true },
  ];

  rowData: any[] = [];

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => `${node.make} ${node.model}`).join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
  delete() {
    const selectedData = this.agGrid.api.getSelectedRows();
    this.agGrid.api.updateRowData({ remove: selectedData });
    // http://localhost/aphamea_project/web/index.php/site/delete
    console.log(selectedData);
  }
   gridApi:any
 gridOptin:GridOptions = {
  defaultColDef: {
    resizable: false,
    lockPinned: true,
    wrapText: true,
    autoHeight: true,
    suppressMovable: true,
    headerClass: 'headerCell',
  },

  columnDefs: this.columnDefs,

  rowData: [],
  animateRows: true,
  pinnedBottomRowData: [
    {
      month: 'Total',
      holidays: 27,
      working: 30,
      business_trip: 6,
      direction: 21,
      total_break: '60:00',
      total_work: '480:00',
      bonus: '04:30',
      bonus_count: 3,
      leave_type: '15:00',
      overtime: '60:00',
      after_mid: '60:00',
    },
  ],
  rowSelection: 'single',
  rowMultiSelectWithClick: true,
  onSelectionChanged: () => {
    let rows = this.gridApi.getSelectedRows();
  },
  getRowId: (params: GetRowIdParams) => {
    return params.data.id;
  },
};
  gridReady(params:GridReadyEvent) {
     this.gridApi=params.api;
     let colApi=params.columnApi;
    this.http.get(environment.base + 'site/get-all-users').subscribe((response: any) => {
      this.rowData=response.users;
      console.log(this.rowData);
      this.gridApi.setRowData(this.rowData);
    });
    this.gridApi?.refreshHeader();
    colApi.autoSizeAllColumns();
  }



  loadUsers() {
    this.http.get(environment.base + 'site/get-all-users').subscribe(
      (res: any) => {
        if (res.status === 'ok') {
          this.users = res.users;
        } else {
          this.notify.errorNotification(res.error);
        }
      },
      error => {
        this.notify.errorNotification(error);
      }
    );
  }
  onSubmit(userForm: NgForm) {
    this.http.post(environment.base + '/site/signup', JSON.stringify(userForm.value)).subscribe(
      (res: any) => {
        if (res.status === 'ok') {
          this.notify.successNotification('user added successfully');
          this.loadUsers();
        } else {
          this.notify.errorNotification('error user added');
        }
      },
      error => {
        this.notify.errorNotification(error);
      }
    );
  }

  // Handling Import Excel Template For Adding New Users
  importingExcel(event: any) {
    this.upload(event.target.files[0]).subscribe({
      next: (data: any) => {
        if (data.status == 'ok') {
          this.loadUsers();
          if (data.errorDetails.length > 0) {
            //Handle ERROR
            let tx = '';
            data.errorDetails.forEach((d: any) => {
              tx = tx + '<li>' + d.error + '</li>' + '</br>';
              this.notify.errorNotification(tx, 'Errors');
              //Handle ERROR Email if Found
              if (d.details?.email.length > 0) {
                tx = tx + '<li>' + d.details?.email + '</li>';
              }
            });
          } else {
            this.notify.successNotification('Upload File successfully');
          }
        }
        ((<HTMLInputElement>document.getElementById('input_file')) as any).value = null;
      },
      error: (error: any) => {
        this.notify.errorNotification(error);
      },
    });
  }
  importTemplateToEXCEL() {
    this.import().subscribe({
      next: response => {
        this.downloadFile(response);
        this.notify.successNotification('download File successfully');
      },
      error: (error: any) => {
        this.notify.errorNotification(error);
      },
    });
  }
  import() {
    const headerParams = { Authorization: 'Bearer ' + this.userModel?.getToken() };
    return this.http.get(environment.base + 'site/generate-excel-file-template', {
      headers: new HttpHeaders(headerParams),
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }

  upload(file: any): Observable<any> {
    const accessToken = this.userModel?.getToken;
    const headerParams = { Authorization: 'Bearer ' + accessToken };
    const formData = new FormData();
    formData.append('sheet', file, file.name);
    return this.http.post(environment.base + `site/import-excel-file`, formData, {
      headers: new HttpHeaders(headerParams),
    });
  }

  public downloadFile(data: any) {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const file = new File([blob], data.headers.get('file-name'), {
      type: data.headers.get('content-type'),
    });
    saveAs(file);
  }
}
