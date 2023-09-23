import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierComponent } from './notifier/notifier.component';
import { HeaderComponent } from './header/header.component';
import { SinglePostComponent } from './single-post/single-post.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RegistrationComponent,
    LoginComponent,
    PostComponent,
    NotifierComponent,
    HeaderComponent,
    SinglePostComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
