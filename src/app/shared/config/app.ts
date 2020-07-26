import { InjectionToken } from "@angular/core";

export interface AppConfig {
  baseUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

// export const APP_CONFIG = new InjectionToken<AppConfig>("app.config", {
//   providedIn: "root",
//   factory: () => {
//     return { baseUrl: "https://us-central1-collab-ionic-beta.cloudfunctions.net" };
//   }
// });
