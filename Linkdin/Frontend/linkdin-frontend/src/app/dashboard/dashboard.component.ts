import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { Post } from '../post';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  post: Post = new Post('', '');

  picurl = 'http://localhost:9000/linkdin-post-images/1690062090271-Sifat.jpg'
  selectImage(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.post.postImageUrl = file;
    }
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('postText', this.post.postText);
    formData.append('postImage', this.post.postImageUrl);
    this.http.post<any>(`http://localhost:8000/user/${this.user._id}/upload-post`, formData).subscribe(res => {
      console.log(res);
    });
  }

  constructor(private http: HttpClient, private router: Router) { }

  res: any;
  user: any;
  message: any;
  postList: Post[] = [];

  ngOnInit(): void {

    let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.get('http://localhost:8000/user/dashboard', { headers: headers }).subscribe(res => {

      this.res = res;

      if (this.res.success) {
        this.user = this.res.user
        this.postList = this.res.postList
        console.log(res);

        console.log(this.postList);
      }
      else {
        this.router.navigate(['/login'])
      }
    });

  }


}
