import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log("canActivate");
    return this.validation(next.routeConfig.path);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log("canLoad");
    return this.validation(route.path);
  }

  validation(path: string) {
    return this.auth.initAuth$.pipe(
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
