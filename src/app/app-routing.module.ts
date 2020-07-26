import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./shared";
import { RegisterComponent } from "./pages/register/register.component";
import { AdminLoginComponent } from "./pages/admin-login/admin-login.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "main",
    loadChildren: () =>
      import("./pages/main/main.module").then((m) => m.MainModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "register/:uid",
    component: RegisterComponent,
  },
  {
    path: "admin",
    component: AdminLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
