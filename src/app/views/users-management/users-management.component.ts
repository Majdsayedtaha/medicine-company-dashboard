import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { faDownload, faUser, faUpload, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/interfaces/user.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NotifierService } from 'src/app/services/notifier.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GetRowIdParams, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

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
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    { headerName: 'First Name', field: 'firstName', sortable: true, filter: true, editable: true },
    { headerName: 'Last Name', field: 'lastName', sortable: true, editable: true },
    { headerName: 'Email', field: 'email', sortable: true, editable: true },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: (params: any) => {
        return this.roles[params.value];
      },
      sortable: true,
      editable: true,
    },
    {
      headerName: 'Region',
      field: 'region',
      cellRenderer: (params: any) => {
        console.log(params);
        if (params.value == null) return `not set yet`;
        else return params.value.regionAr;
      },
      sortable: true,
      editable: true,
    },
    {
      headerName: 'Country',
      field: 'country',
      cellRenderer: (params: any) => {
        if (params.value == null) return `not set yet`;
        else return params.value.nameAr;
      },
      sortable: true,
      editable: true,
    },
    {
      headerName: 'City',
      field: 'city',
      cellRenderer: (params: any) => {
        if (params.value == null) return `not set yet`;
        else return params.value.nameAr;
      },
      sortable: true,
      editable: true,
    },
    { headerName: 'Special Mark', field: 'specialMark', sortable: true, editable: true },
  ];

  rowData: any[] = [];

  gridApi: any;
  gridOption: GridOptions = {
    defaultColDef: {
      resizable: true,
      lockPinned: true,
      wrapText: true,
      autoHeight: true,
      suppressMovable: false,
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
  faDeleteLeft = faDeleteLeft;

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
    const ids = selectedData.map(user => user.id);

    this.http.post(environment.base + '/site/delete', { ids: ids }).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.agGrid.api.applyTransaction({ remove: selectedData });
        this.notify.successNotification('Delete User Successfully');
      } else if (res.details == 'The array of ids is empty') {
        this.notify.warningNotification('Please,select the user you want to delete');
      } else {
        this.notify.warningNotification("Sorry, You Can't Complete This Action, This User Related To An Order");
      }
    });
  }

  updateUser() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);

    // convert array of object to one object
    const obj = selectedData.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }));

    this.http.post(environment.base + '/site/update-user-info', obj).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.notify.successNotification('Update User Successfully');
      }
    });
  }

  onQuickFilterChanged(txt: any) {
    this.gridApi.setQuickFilter(txt.value);
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    let colApi = params.columnApi;
    this.http.get(environment.base + '/site/get-all-users').subscribe((response: any) => {
      this.rowData = response.users;
      this.gridApi.setRowData(this.rowData);
    });
    colApi.autoSizeAllColumns();
  }

  loadUsers() {
    this.http.get(environment.base + '/site/get-all-users').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.users = res.users;
      } else {
        this.notify.errorNotification(res.error);
      }
    });
  }

  onSubmit(userForm: NgForm) {
    this.http.post(environment.base + '/site/signup', JSON.stringify(userForm.value)).subscribe((res: any) => {
      let newOne = userForm.value;
      newOne.id = res.user.id;
      if (res.status === 'ok') {
        this.http.post(environment.base + '/site/update-user-info', newOne).subscribe((res: any) => {});
        this.loadUsers();
        this.gridOption.api?.setRowData([]);
        this.gridOption.api!.applyTransaction({
          add: this.users,
          addIndex: this.gridApi.getLastDisplayedRow() + 1,
        })!;
        this.gridApi.setRowData(this.rowData);
        this.notify.successNotification('user added successfully');
        userForm.reset();
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
          }
          const newUsers = data.newAddedUser;
          this.gridOption.api!.applyTransaction({
            add: newUsers,
            addIndex: this.gridApi.getLastDisplayedRow() + 1,
          })!;
          // this.notify.successNotification('Upload File successfully');
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
    return this.http.get(environment.base + '/site/generate-excel-file-template', {
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
    return this.http.post(environment.base + `/site/import-excel-file`, formData, {
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

  // START countries - cities - regions
  countries = { id: '', nameAr: '', nameEn: '' };
  cities: any = [];
  regions: any = [];
  getCountries() {
    this.http.get(environment.base + `/area/get-countries`).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.countries = res.countries;
      } else {
        console.log(res);
      }
    });
  }
  getCities() {
    this.http.get(environment.base + `/area/get-cities`).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.cities = res.cities;
      } else {
        console.log(res);
      }
    });
  }
  getRegions(id: number) {
    this.http.get(environment.base + `/area/get-regions?cityId=` + id).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.regions = res.regions;
      } else {
        console.log(res);
      }
    });
  }
  log(x: any) {
    console.log(x);
  }

  // DONE countries - cities - regions
  onReset(userForm: any) {
    userForm.reset();
  }
}
