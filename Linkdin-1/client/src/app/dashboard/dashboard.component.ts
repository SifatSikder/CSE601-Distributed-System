import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { Post } from '../model/post';
import { Notification } from '../model/notification';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';
// import { DashboardPostConnectorService } from '../dashboard-post-connector.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  post: Post = new Post('', '');
  res: any;
  user: any;
  message: any;
  postList: Post[] = [];
  notifications: Notification[] = [];


  post_url = environment.POST_URL

  ngOnInit(): void {

    let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get(`${this.post_url}`, { headers: headers }).subscribe(res => {

      this.res = res;
      if (this.res.success) {

        this.user = this.res.user
        this.postList = this.res.postList
        this.notifications = this.res.notifications
        console.log(this.notifications);

      }
      else {
        this.router.navigate(['/login'])
      }
    });
  }

  selectImage(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.post.postImageUrl = file;
    }
  }

  onSubmit() {

    console.log(this.user);


    const formData = new FormData();
    formData.append('postText', this.post.postText);
    formData.append('postImage', this.post.postImageUrl);
    this.http.post<any>(`${this.post_url}/${this.user._id}`, formData).subscribe(res => {
      console.log(res);
    });
  }

  onNotificationClick(notificationID: string) {
    // this.postConnector.storeNotificationID(notificationID);
    this.router.navigate(['/post'])
  }

}
