// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { FIREBASE_CONFIG } from '../../firebase';
import { networks } from "../../truffle/truffle-config";

export const environment = {
  production: false,
  firebase: FIREBASE_CONFIG,
  blockchain: `${networks.development.host}:${networks.development.port}`,
  // blockchain:"8f45932ae5ab.ngrok.io"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
