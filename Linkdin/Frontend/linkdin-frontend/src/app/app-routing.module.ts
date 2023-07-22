import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
