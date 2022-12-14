import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faSquarePlus, faTrashAlt, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  offerForm!: FormGroup;
  medicines!: any[];
  offers!: any[];
  activeOffer: any;
  activeOfferDetails!: any[];
  faSquarePlus = faSquarePlus;
  faTrashAlt = faTrashAlt;
  faTrashCan = faTrashCan;
  constructor(private fb: FormBuilder, private http: ApiService) {}

  get offerDetails(): FormArray {
    return this.offerForm.get('offerDetails') as FormArray;
  }
  ngOnInit(): void {
    this.getAllMedicines();
    this.getAllOffers();

    const fb = this.fb;
    this.offerForm = fb.group({
      name: [this.activeOffer?.name, [Validators.required]],
      offerDetails: fb.array([]),
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
          platform: 0,
        },
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.medicines = res.medicines;
        } else {
          console.log(res);
        }
      });
  }

  addNewMedicineOffer() {
    this.offerDetails.push(
      this.fb.group({
        medicineId: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        extraMedicineId: ['', [Validators.required]],
        extraQuantity: ['', [Validators.required]],
      })
    );
  }

  addNewOffer() {
    this.http.post(environment.base + '/offer/add', JSON.stringify(this.offerForm.value)).subscribe((res: any) => {
      if (res.status === 'ok') {
        console.log(res);
        this.getAllOffers();
      } else {
        console.log(res);
      }
    });
  }
  updateOffer(id: number) {
    let offerUp = this.offerForm.value;
    offerUp.id = id;
    this.http.post(environment.base + '/offer/update', offerUp).subscribe((res: any) => {
      if (res.status === 'ok') {
        console.log('wow');
        this.getAllOffers();
      } else {
        console.log(res);
      }
    });
  }
  getAllOffers() {
    this.http.get(environment.base + '/offer/get-all').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.offers = res.offers;
      } else if (res.status == 'error') {
        this.offers = [];
        console.log(res);
      }
    });
  }

  getOfferDetails(id: number) {
    this.offerDetails.clear();
    this.http.get(environment.base + '/offer/get?id=' + id).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.activeOffer = res.offer;
        this.activeOfferDetails = res.offerDetails;
        this.offerForm.get('name')?.patchValue(this.activeOffer.name);
        console.log(this.activeOffer);
        this.activeOfferDetails.forEach(offer => {
          this.offerDetails.push(
            this.fb.group({
              medicineId: [offer.medicineId, [Validators.required]],
              quantity: [offer.quantity, [Validators.required]],
              extraMedicineId: [offer.extraMedicineId, [Validators.required]],
              extraQuantity: [offer.extraQuantity, [Validators.required]],
            })
          );
        });
      } else {
        console.log(res);
      }
    });
  }

  changeOfferStatus(e: any, id: number) {
    e.target.value == 'on' ? (e.target.value = 'off') : (e.target.value = 'on');
    let status = e.target.value == 'on' ? 1 : 0;
    this.http.get(environment.base + '/offer/change-status?id=' + id + '&status=' + status).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.getAllOffers();
      } else {
        console.log(res);
      }
    });
  }

  deleteOffer(id: number) {
    console.log(id);
    this.http.post(environment.base + '/offer/delete', { id }).subscribe((res: any) => {
      if (res.status === 'ok') {
        this.getAllOffers();
        console.log(res);
      } else {
        console.log(res);
      }
    });
  }

  shortDate(value: string): string {
    return value.substring(0, 10);
  }

  onResetOfferForm() {
    this.offerForm.reset();
  }
}
