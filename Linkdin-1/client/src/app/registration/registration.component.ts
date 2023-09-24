import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from '../model/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  user = new User();
  base_url = environment.BASE_URL;

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    console.log(this.user);
    console.log(this.base_url);

    this.http.post<any>(`${this.base_url}/user/register`, this.user)
      .subscribe(res => {
        if (res.success) {
          this.router.navigate(['/login']);
        }
        else {
          console.log(res.message);
        }
      });
  }
}
