/// <reference types="firebase" />

import { Injectable, Inject } from "@angular/core";
import { Observable, from, combineLatest } from "rxjs";
import { map, mergeMap, shareReplay, catchError } from "rxjs/operators";
import { FirebaseConfig, FIREBASE_CONFIG } from "../config/firebase";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  init$: Observable<{ app: firebase.app.App; firebase: any }>;
  messaging$: Observable<firebase.messaging.Messaging>;

  constructor(@Inject(FIREBASE_CONFIG) private config: FirebaseConfig) {
    this.init$ = this.init();
    this.messaging$ = this.initMessaging();
  }

  private init(): Observable<{ app: firebase.app.App; firebase: any }> {
    const app$ = from(import("firebase/app"));
    const auth$ = from(import("firebase/auth"));

    return combineLatest(app$, auth$).pipe(
      map(([firebase, auth]) => {
        const app = firebase.apps[0] || firebase.initializeApp(this.config);
        return { firebase, app };
      }),
      shareReplay(1)
    );
  }

  private initMessaging(): Observable<firebase.messaging.Messaging> {
    const messaging$ = from(import("firebase/messaging"));

    return combineLatest(this.init$, messaging$).pipe(
      map(([{ app, firebase }]) => {
        console.count("[initMessaging] loaded");
        const messaging = app.messaging();
        // const messaging = firebase.messaging();
        // messaging.usePublicVapidKey(FIREBASE_CONFIG.vapidKey);
        return messaging;
      }),
      shareReplay(1)
    );
  }

  notifications$: Observable<any> = combineLatest(this.init$).pipe(
    map(([{ app, firebase }]) => {
      console.count("[initMessaging] loaded");
      // const messaging = app.messaging();
      const messaging = firebase.notifications();
      return messaging;
    }),
    shareReplay(1)
  );
}
