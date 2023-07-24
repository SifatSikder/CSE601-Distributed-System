import { Component } from '@angular/core';
import { DashboardPostConnectorService } from '../dashboard-post-connector.service';
import { Post } from '../post';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent {

  constructor(public postConnector: DashboardPostConnectorService) { }

  post: Post = new Post('', '', '', '');

  ngOnInit() {
    // this.post = this.postConnector.showPost();
    console.log(this.postConnector.showPost());
  }
}
