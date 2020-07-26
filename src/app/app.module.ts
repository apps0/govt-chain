import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { FIREBASE_CONFIG, APP_CONFIG, SharedModule } from './shared';
import { environment } from 'src/environments/environment';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SharedModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FIREBASE_CONFIG, useValue: environment.firebase },
    // {
    //   provide: APP_CONFIG,
    //   useFactory: () => {
    //     return {
    //       baseUrl: environment.production
    //         ? environment.baseUrl
    //         : "http://localhost:5000/collab-ionic-dev/us-central1"
    //     };
    //   }
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
