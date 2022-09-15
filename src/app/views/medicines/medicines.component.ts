import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faDownload, faImages, faUpload, faBookMedical } from '@fortawesome/free-solid-svg-icons';
import { AgGridAngular } from 'ag-grid-angular';
import { GetRowIdParams, GridOptions, GridReadyEvent } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/interfaces/user.model';
import { ApiService } from 'src/app/services/api.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss'],
})
export class MedicinesComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  faImages = faImages;
  faDownload = faDownload;
  faUpload = faUpload;
  faBookMedical = faBookMedical;

  medicineForm!: FormGroup;
  images: any = [];
  userModel?: User;
  categories: { id: number; name: string }[] = [];
  pharmaceuticalForms: { id: number; name: string }[] = [];
  medicines: any[] = [];
  rowData: any[] = [];

  columnDefs = [
    // { headerName: 'medicineImages', field: 'medicineImages', sortable: true, filter: true },
    { headerName: 'productName', field: 'productName', sortable: true, filter: true, editable: true },
    { headerName: 'categoryId', field: 'categoryId', sortable: true, filter: true, editable: true },
    { headerName: 'pharmaceuticalFormId', field: 'pharmaceuticalFormId', sortable: true, editable: true },
    { headerName: 'netPrice', field: 'netPrice', sortable: true, editable: true },
    { headerName: 'price', field: 'price', sortable: true, editable: true },
    { headerName: 'expiredDate', field: 'expiredDate', sortable: true, editable: true },
    { headerName: 'composition', field: 'composition', sortable: true, editable: true },
    { headerName: 'packing', field: 'packing', sortable: true, editable: true },
    { headerName: 'indications', field: 'indications', sortable: true, editable: true },
  ];

  gridApi: any;
  gridOption: GridOptions = {
    defaultColDef: {
      resizable: false,
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

  constructor(private http: ApiService, private fb: FormBuilder, private notify: NotifierService) {}

  ngOnInit(): void {
    this.getAllMedicines();
    this.getAllCategories();
    this.getAllPharmaceuticalForms();

    const fb = this.fb;
    this.medicineForm = fb.group({
      productName: ['', [Validators.required]],
      indications: ['', [Validators.required]],
      packing: ['', [Validators.required]],
      composition: ['', [Validators.required]],
      expiredDate: ['', [Validators.required]],
      price: ['', [Validators.required]],
      netPrice: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      pharmaceuticalFormId: ['', [Validators.required]],
    });
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => `${node.firstName} ${node.lastName}`).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  deleteMedicine() {
    const selectedData = this.agGrid.api.getSelectedRows();
    const id = parseInt(selectedData.map(medicine => medicine.id).toString());
    this.agGrid.api.updateRowData({ remove: selectedData });

    this.http.post(environment.base + '/medicine/delete', { id }).subscribe((res: any) => {
      if (res.status == 'ok') {
        this.notify.successNotification('Delete User Successfully');
      }
    });
  }

  updateMedicine() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.getAllMedicines();
    // convert array of object to one object
    selectedData.map((data: any) => {
      console.log(data);
      const medicine = {
        productName: data.productName,
        id: data.id,
        indications: data.indications,
        packing: parseInt(data.packing),
        composition: data.composition,
        expiredDate: parseInt(data.expiredDate),
        price: parseInt(data.price),
        netPrice: parseInt(data.netPrice),
        pharmaceuticalFormId: parseInt(data.pharmaceuticalForms.map((resId: any) => resId.id).toString()),
        categoryId: parseInt(data.categories.map((resId: any) => resId.id).toString()),
        medicineImages: this.images,
      };
      console.log(medicine);
      this.http.post(environment.base + '/medicine/update', medicine).subscribe((res: any) => {
        if (res.status == 'ok') {
          this.notify.successNotification('Update Medicine Successfully');
        }
      });
    });
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    let colApi = params.columnApi;
    this.http
      .post(environment.base + '/medicine/get-all', {
        searchFilters: {
          filters: [
            { name: 'productName', status: false },
            { name: 'indications', status: false },
            { name: 'composition', status: false },
          ],
          searchText: '',
        },
      })
      .subscribe((response: any) => {
        this.rowData = response.medicines;
        this.gridApi.setRowData(this.rowData);
      });
    colApi.autoSizeAllColumns();
  }

  addCategory(categoryName: string) {
    this.http
      .post(environment.base + '/category/add', {
        deletedCategories: [],
        categories: [{ id: '', name: categoryName }],
      })
      .subscribe((res: any) => {
        if (res.status === 'ok') {
          this.getAllCategories();
        } else {
          console.log(res);
        }
      });
  }

  addPharmaceuticalForm(pharmaceuticalFormName: string) {
    this.http
      .post(environment.base + '/pharmaceutical-form/add', {
        deletedPharmaceuticalForms: [],
        pharmaceuticalForms: [{ id: '', name: pharmaceuticalFormName }],
      })
      .subscribe((res: any) => {
        if (res.status === 'ok') {
          this.getAllPharmaceuticalForms();
        } else {
          console.log(res);
        }
      });
  }

  addMedicine() {
    const medicine = {
      productName: this.medicineForm.get('productName')?.value,
      indications: this.medicineForm.get('indications')?.value,
      packing: this.medicineForm.get('packing')?.value,
      composition: this.medicineForm.get('composition')?.value,
      expiredDate: this.medicineForm.get('expiredDate')?.value,
      price: this.medicineForm.get('price')?.value,
      netPrice: this.medicineForm.get('netPrice')?.value,
      pharmaceuticalFormId: this.medicineForm.get('categoryId')?.value,
      categoryId: this.medicineForm.get('pharmaceuticalFormId')?.value,
      medicineImages: this.images,
    };
    this.http.post(environment.base + '/medicine/add', medicine).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.getAllMedicines();
        this.getAllCategories();
        this.getAllPharmaceuticalForms();

        // Update Table
        const res = this.gridOption.api!.applyTransaction({
          add: [medicine],
          addIndex: this.medicines.length,
        })!;
      } else {
        console.log(res);
      }
    });
  }

  processFile(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadImages(event.target.files[i]);
    }
  }

  uploadImages(file: any) {
    const formData = new FormData();
    formData.append(file.name, file);
    this.images.push(formData.get(file.name));
  }

  // Handling Import Excel Template For Adding New Users
  importingExcel(event: any) {
    this.upload(event.target.files[0]).subscribe((data: any) => {
      if (data.status == 'ok') {
        this.getAllMedicines();
        this.getAllCategories();
        this.getAllPharmaceuticalForms();
        const res = this.gridOption.api!.applyTransaction({
          add: this.medicines,
          addIndex: this.medicines.length,
        })!;
        if (data.errorDetails.length > 0) {
          //Handle ERROR
          let tx = '';
          data.errorDetails.forEach((d: any) => {
            console.log(d);
            tx = tx + '<li>' + d.error + '</li>' + '</br>';
            this.notify.errorNotification(tx, 'Errors');
            //Handle ERROR Email if Found
            // if (d.details?.email) {
            //   tx = tx + '<li>' + d.details?.email + '</li>';
            // }
          });
        } else {
          this.notify.successNotification('Upload File successfully');
        }
      }
      ((<HTMLInputElement>document.getElementById('input_file_medicine')) as any).value = null;
    });
  }

  importTemplateToEXCEL() {
    this.import().subscribe(response => {
      this.downloadFile(response);
      this.notify.successNotification('download File successfully');
    });
  }

  import() {
    const headerParams = { Authorization: 'Bearer ' + this.userModel?.getToken() };
    return this.http.get(environment.base + '/medicine/generate-excel-file-template', {
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
    return this.http.post(environment.base + `/medicine/import-excel-file`, formData, {
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

  getAllCategories() {
    this.http.get(environment.base + '/category/get-all').subscribe((res: any) => {
      if (res.status == 'ok') {
        this.categories = res.categories;
      } else {
        console.log(res);
      }
    });
  }

  getAllPharmaceuticalForms() {
    this.http.get(environment.base + '/pharmaceutical-form/get-all').subscribe((res: any) => {
      if (res.status == 'ok') {
        this.pharmaceuticalForms = res.pharmaceuticalForm;
      } else {
        console.log(res);
      }
    });
  }

  getAllMedicines() {
    this.http
      .post(environment.base + '/medicine/get-all', {
        searchFilters: {
          filters: [
            { name: 'productName', status: false },
            { name: 'indications', status: false },
            { name: 'composition', status: false },
          ],
          searchText: '',
        },
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          console.log(res);
          this.medicines = res.medicines;
          console.log(this.medicines);
        } else {
          console.log(res);
        }
      });
  }

  onReset() {
    this.medicineForm.reset();
  }

  onResetPartForm(valueForm:any){
    valueForm.value='';
  }
}
