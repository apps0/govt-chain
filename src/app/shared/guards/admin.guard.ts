import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.validation(next.routeConfig.path);
  }
  validation(path: string) {
    return this.auth.isAdmin$.pipe(
      take(1),
      map((x) => {
        console.log("user", x);
        if (x) {
          // LoggedIn
          if (path === "login") {
            this.router.navigate(["/"]);
            return false;
          }
          return true;
        } else if (path !== "login") {
          // LoggedOut
          this.router.navigate(["/login"]);
          return false;
        }
        return true;
      })
    );
  }
}
