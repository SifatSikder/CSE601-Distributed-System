import { Component } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = new User();
  user_url = environment.USER_URL

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.http.post<any>(`${this.user_url}/login`, this.user).subscribe(res => {
      if (res.success) {
        console.log(res.message);
        localStorage.setItem('token', res.message);
        this.router.navigate(['/dashboard']);
      }
      else {
        console.log(res.message);
      }
    });
  }

}
