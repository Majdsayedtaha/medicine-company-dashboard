import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

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
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  columnDefs = [
    // { headerName: '#', field: '#', sortable: true, filter: true },
    { headerName: 'firstName', field: 'firstName', sortable: true, filter: true, editable: true },
    { headerName: 'lastName', field: 'lastName', sortable: true },
    { headerName: 'email', field: 'email', sortable: true },
    { headerName: 'role', field: 'role', sortable: true },
    { headerName: 'region', field: 'region', sortable: true },
    { headerName: 'country', field: 'country', sortable: true },
    { headerName: 'city', field: 'city', sortable: true },
    { headerName: 'specialMark', field: 'specialMark', sortable: true },
  ];

  rowData: any[] = [];

  gridApi: any;
  gridOptin: GridOptions = {
    defaultColDef: {
      resizable: false,
      lockPinned: true,
      wrapText: true,
      autoHeight: true,
      suppressMovable: true,
      headerClass: 'headerCell',
    },

    columnDefs: this.columnDefs,

    animateRows: true,
    rowSelection: 'single',
    rowMultiSelectWithClick: true,
    getRowId: (params: GetRowIdParams) => {
      return params.data.id;
    },
  };

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

  faDownload = faDownload;
  faUser = faUser;
  faUpload = faUpload;

  constructor(private http: ApiService, private notify: NotifierService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => `${node.firstName} ${node.lastName}`).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  deleteRowUser() {
    const selectedData = this.agGrid.api.getSelectedRows();
    const id = parseInt(selectedData.map(user => user.id).toString());
    this.agGrid.api.updateRowData({ remove: selectedData });
    this.http.post('http://localhost/aphamea_project/web/index.php/site/delete', { id }).subscribe(user => {
      console.log(user);
    });
  }

  updateUser() {}

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    let colApi = params.columnApi;
    this.http.get(environment.base + 'site/get-all-users').subscribe((response: any) => {
      this.rowData = response.users;
      this.gridApi.setRowData(this.rowData);
    });
    colApi.autoSizeAllColumns();
  }

  loadUsers() {
    this.http.get(environment.base + 'site/get-all-users').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.users = res.users;
      } else {
        this.notify.errorNotification(res.error);
      }
    });
  }

  onSubmit(userForm: NgForm) {
    this.http.post(environment.base + '/site/signup', JSON.stringify(userForm.value)).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.notify.successNotification('user added successfully');
        this.loadUsers();
      } else {
        this.notify.errorNotification('error user added');
      }
    });
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
    });
  }

  importTemplateToEXCEL() {
    this.import().subscribe({
      next: response => {
        this.downloadFile(response);
        this.notify.successNotification('download File successfully');
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
