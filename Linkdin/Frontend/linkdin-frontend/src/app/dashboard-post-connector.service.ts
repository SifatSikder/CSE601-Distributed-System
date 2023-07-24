import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class DashboardPostConnectorService {

  constructor(private http: HttpClient) { }

  post: Post = new Post('', '');
  notificationID: any;

  // getPost(notificationID: string) {

  // }

  storeNotificationID(notificationID: string) {
    this.notificationID = notificationID;
  }

  showPost(): any {
    console.log(this.notificationID);
    return this.http.get<any>(`http://localhost:8000/user/${this.notificationID}/post`)

  }
}
