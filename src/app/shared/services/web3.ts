import { Injectable } from "@angular/core";
import { Subject, Observable, Observer, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { default as Web3 } from "web3";
import { shareReplay, share, switchMap, filter, tap } from "rxjs/operators";
import { async } from "@angular/core/testing";
import { environment } from "src/environments/environment";
declare let require: any;
const TruffleContract = require("@truffle/contract");

declare let window: any;

@Injectable({
  providedIn: "root",
})
export class Web3Service {
  private web3: any;
  private accounts: string[];
  private accounts$ = new Subject<string[]>();
  currentAccount: string;

  constructor(private http: HttpClient) {}

  initChain(chainName) {
    return this.onInit()
      .pipe(switchMap((x) => this.loadContract(chainName)))
      .pipe(
        tap((x) => {
          console.log(x);
        }),
        filter((x) => !!x),
        share()
      );
  }

  private onInit() {
    console.count("Web3 service `/onInit`/ method");
    return Observable.create(async (obs: Observer<any>) => {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof window.ethereum !== "undefined") {
        // Use Mist/MetaMask's provider
        window.ethereum.enable().then(() => {
          this.web3 = new Web3(window.ethereum);
        });
      } else {
        console.log("No web3? You should consider trying MetaMask!");

        // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
        Web3.providers.HttpProvider.prototype.sendAsync =
          Web3.providers.HttpProvider.prototype.send;
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        this.web3 = new Web3(
          // new Web3.providers.HttpProvider(`https://${environment.blockchain}`)
          new Web3.providers.WebsocketProvider(`ws://${environment.blockchain}`)
        );
      }
      setTimeout(async () => {
        this.currentAccount = await this.refreshAccounts();
        obs.next(true);
      }, 100);
      //setInterval(() => this.refreshAccounts(), 100);
    });
  }

  private async loadContractJson(contractName) {
    return await this.http
      .get(`/assets/contracts/${contractName}.json`)
      .toPromise();
  }

  private loadContract(contractName) {
    return Observable.create(async (obs: Observer<any>) => {
      let json = await this.loadContractJson(contractName);
      let contract = await this.artifactsToContract(json);
      let chain = await contract.deployed();
      obs.next(chain);
    });
  }

  private async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise((resolve) => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = TruffleContract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  private async createAccount() {
    return await this.web3.eth.accounts.create();
  }

  private async privateKeyToAccount(key) {
    return await this.web3.eth.accounts.privateKeyToAccount(key);
  }

  private async refreshAccounts() {
    console.count("Web3 service `/refreshAccounts`/ method");
    const accs = await this.web3.eth.getAccounts();
    console.log(accs);
    // console.log('Refreshing accounts');

    // Get the initial account balance so it can be displayed.
    if (accs.length === 0) {
      console.warn(
        "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
      );
      return;
    }
    this.web3.eth.defaultAccount = accs[0];
    if (
      !this.accounts ||
      this.accounts.length !== accs.length ||
      this.accounts[0] !== accs[0]
    ) {
      console.log("Observed new accounts");

      this.accounts$.next(accs);
      this.accounts = accs;
    }
    return this.accounts[0];
  }
}
