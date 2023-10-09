import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../model/post';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardPostConnectorService {

    constructor(private http: HttpClient) { }

    post: Post = new Post('', '');
    notificationID: any;
    post_url = environment.POST_URL


    storeNotificationID(notificationID: string) {
        this.notificationID = notificationID;
    }

    showPost(): any {
        console.log(this.notificationID);
        return this.http.get<any>(`${this.post_url}/${this.notificationID}/singlePost`)
    }
}
