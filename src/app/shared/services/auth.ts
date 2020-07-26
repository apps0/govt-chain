import { Injectable } from "@angular/core";
import { Observable, of, Observer, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import {
  switchMap,
  shareReplay,
  filter,
  map,
  tap,
  share,
  publish,
  takeLast,
  take,
} from "rxjs/operators";
import { User, UserMap, UserType } from "../models";
import { FirebaseService } from "./firebase";
import { BlocksService } from "./blocks";
import { Web3Service } from "./web3";
import { UsersService } from "./users";
import { ContractorsService } from "./contractors";

@Injectable({
  providedIn: "root",
})
export class AuthService extends BlocksService {
  private userMapSubject$: BehaviorSubject<UserMap> = new BehaviorSubject(null);
  user$: Observable<User>;
  isAdmin$: Observable<boolean>;
  isContractor$: Observable<boolean>;
  isApprovedContractor$: Observable<boolean>;
  initAuth$: Observable<any>;
  googleCred;
  constructor(
    private firebase: FirebaseService,
    private usersService: UsersService,
    private contractorsService: ContractorsService,
    private router: Router,
    web3: Web3Service
  ) {
    super(web3, "ContractorsChain");
    this.user$ = this.userMapSubject$.asObservable().pipe(
      switchMap(
        (x): Observable<User> =>
          x ? this.getUserData(x.id, x.userType) : of(null)
      ),
      shareReplay(1)
    ) as any;

    this.initAuth$ = this.initAuth().pipe(shareReplay(1));

    this.isAdmin$ = this.user$.pipe(
      map((x) => {
        return x ? x.type == "admin" : false;
      })
    );
    this.isContractor$ = this.user$.pipe(
      map((x) => {
        return x ? x.type == "contractor" : false;
      })
    );
    this.isApprovedContractor$ = this.user$.pipe(
      map((x) => {
        return x ? x.type == "contractor" && x.status == "approved" : false;
      })
    );
  }

  private initAuth() {
    return this.uid$.pipe(
      switchMap((uid) => (uid ? this.getUserMap(uid) : of(null))),
      map((x) => {
        if (x && x.id && x.id > 0) {
          this.userMapSubject$.next(x);
          return true;
        } else {
          const userMap = this.userMapSubject$.value;

          if (userMap && userMap.userType !== "admin") {
            this.userMapSubject$.next(null);
          }
        }
      })
    );
  }

  adminLogin(userName, password) {
    if (userName === "admin" && password === "admin") {
      this.userMapSubject$.next({ userType: "admin" });
      return true;
    }
    return false;
  }
  async getCurrentUser(): Promise<User> {
    return this.user$
      .pipe(
        take(1),
        map((x) => {
          return {
            ...(x ?? {}),
            ...(this.googleCred ? { photoURL: this.googleCred.photoURL } : {}),
          };
        })
      )
      .toPromise() as Promise<User>;
  }
  get uid$(): Observable<any> {
    const self = this;
    return this.firebase.init$.pipe(
      switchMap(({ firebase, app }) => {
        return Observable.create((obs: Observer<string>) => {
          app.auth().onAuthStateChanged(
            (u) => {
              console.count("onAuthStateChanged");
              if (u) {
                self.googleCred = u;
                obs.next(u.uid);
              } else {
                self.googleCred = null;
                obs.next(null);
              }
            },
            (err) => {
              obs.error(err);
            },
            () => {
              obs.complete();
            }
          );
        });
      })
    );
  }

  async googleSignIn() {
    try {
      const { firebase, app } = await this.firebase.init$.toPromise();

      const provider = new (firebase.auth as any).GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });
      // const provider = new (app.auth() as any).GoogleAuthProvider();
      const credential = await app.auth().signInWithPopup(provider);
      // const credential = await firebase.auth().signInWithPopup(provider);
      console.log(credential);
      //return this.updateUserData(credential.user);
      return credential;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async save(data, type: UserType) {
    switch (type) {
      case "user":
        return await this.usersService.save(data);
      case "contractor":
        return await this.contractorsService.save(data);
      default:
        break;
    }
  }

  getUserData(ubid: number, type: UserType): Observable<User> {
    return Observable.create(async (obs: Observer<User>) => {
      let data;
      switch (type) {
        case "user":
          data = await this.usersService.getUserData(ubid);
          break;
        case "contractor":
          data = await this.contractorsService.getContractorData(ubid);
          break;
        case "admin":
          data = {
            name: "Admin",
            email: "govtchain@gov.in",
            phoneNumber: "1048",
          };
          break;
      }
      obs.next({
        ...data,
        type: type,
      });
      obs.complete();
    });
  }

  getUserMap(uid): Observable<UserMap> {
    return this.block(uid, "userMap", (result) => {
      const id = result["id"].toNumber();
      if (id && id > 0)
        return {
          id: id,
          uid,
          userType: result["userType"],
        };
      else return { uid };
    });
  }

  async signOut() {
    const userMap = this.userMapSubject$.value;
    if (userMap) {
      if (userMap.userType !== "admin") {
        const { app } = await this.firebase.init$.toPromise();
        await app.auth().signOut();
      } else {
        this.userMapSubject$.next(null);
      }

      return this.router.navigate(["login"]);
    }
  }
}
