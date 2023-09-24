import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(private http: HttpClient, private router: Router) { }

  user = new User();

  onSubmit() {


    console.log(this.user);

    this.http.post<any>('http://localhost:8000/user/register', this.user).subscribe(res => {
      if (res.success) {
        console.log(res.message);
        this.router.navigate(['/login']);
      }
      else {
        console.log(res.message);
      }
    });
  }
}
