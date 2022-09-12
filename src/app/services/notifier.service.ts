import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private toastr: ToastrService) {}

  public errorNotification(
    message: string,
    title: string = "",
    showProgressBar: boolean = false,
    timeout: number = 7000
  ) {
    this.toastr.error(message, title, {
      timeOut: timeout,
      positionClass: 'toast-top-right',
      enableHtml:true,
    });
  }

  public successNotification(
    message: string,
    title: string ="",
    showProgressBar: boolean = false,
    timeOut: number = 7000
  ) {
    this.toastr.success(message, title, {
      timeOut: timeOut,
      positionClass: 'toast-top-right',
    });
  }

  public warningNotification(
    message: string,
    title: string = "",
    showProgressBar: boolean = false,
    timeOut: number = 7000
  ) {
    this.toastr.warning(message, title, {
      timeOut: timeOut,
      positionClass: 'toast-top-right',
    });
  }
}
