import { Component } from '@angular/core';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = new User();

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.http.post<any>('http://localhost:8000/user/login', this.user).subscribe(res => {
      if (res.success) {
        localStorage.setItem('token', res.message);
        this.router.navigate(['/dashboard']);
      }
      else {
        console.log(res.message);
      }
    });
  }

}
