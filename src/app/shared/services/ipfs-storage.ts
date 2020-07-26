import { Injectable } from "@angular/core";
import * as IPFS from "ipfs-http-client";
import { HttpClient } from "@angular/common/http";
import * as Papa from "papaparse";
@Injectable({
  providedIn: "root",
})
export class IpfsStorageService {
  ipfs;
  constructor(private http: HttpClient) {
    this.ipfs = new IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
  }
  async upload(fileBytes) {
    for await (const file of this.ipfs.add(fileBytes)) {
      return file;
    }
  }

  async fetch(path) {
    return this.http
      .get(`https://ipfs.io/ipfs/${path}`, { responseType: "arraybuffer" })
      .toPromise();
  }
  async parse(path) {
    return new Promise((res) => {
      Papa.parse(`https://ipfs.io/ipfs/${path}`, {
        download: true,
        header: true,
        complete: function (results, file) {
          console.log("Parsing complete:", results, file);
          res(results);
        },
      });
    });
  }
}
