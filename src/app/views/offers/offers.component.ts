import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
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
  faSquarePlus = faSquarePlus;
  constructor(private fb: FormBuilder, private http: ApiService) {}

  get offerDetails(): FormArray {
    return this.offerForm.get('offerDetails') as FormArray;
  }
  ngOnInit(): void {
    this.getAllMedicines();

    const fb = this.fb;
    this.offerForm = fb.group({
      name: ['', [Validators.required]],
      offerDetails: fb.array([
        this.fb.group({
          medicineId: ['', [Validators.required]],
          quantity: ['', [Validators.required]],
          extraMedicineId: ['', [Validators.required]],
          extraQuantity: ['', [Validators.required]],
        }),
      ]),
    });
  }
  getAllMedicines() {
    this.http.get(environment.base + '/medicine/get-all').subscribe((res: any) => {
      if (res.status == 'ok') {
        console.log(res);
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
  getAllOffers() {
    this.http.get(environment.base + '/offer/get-all').subscribe((res: any) => {
      if (res.status === 'ok') {
        console.log(res);
      } else {
        console.log(res);
      }
    });
  }
}
