import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  postImage: any;

  constructor(private http: HttpClient) { }

  show() {
    console.log(this.postImage);
    this.http.post<any>('http://localhost:8000/user/minio', { postImage: this.postImage }).subscribe(res => {
      console.log(res);
    })
  }






}
