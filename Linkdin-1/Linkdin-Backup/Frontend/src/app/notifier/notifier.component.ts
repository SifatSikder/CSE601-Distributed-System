import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {

  constructor(private toastr: ToastrService) { }

  showSuccess() {
    this.toastr.success('Success!');
  }


}
