import { Injectable } from "@angular/core";
import { Subject, Observable, Observer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { default as Web3 } from "web3";
declare let require: any;
// const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");

declare let window: any;

@Injectable({
  providedIn: "root"
})
export class Web3Service {
  private web3: any;
  private accounts: string[];
  private currentAccount;
  private govtChain;
  public ready = false;

  public accounts$ = new Subject<string[]>();

  constructor(private http: HttpClient) {
    // window.addEventListener('load', (event) => {
    //   this.bootstrapWeb3();
    // });
  }

  public bootstrapWeb3() {
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
        // new Web3.providers.HttpProvider("http://192.168.101.44:7545")
        new Web3.providers.WebsocketProvider("ws://192.168.101.44:7545")
      );
    }
    setTimeout(() => this.refreshAccounts(), 100);
    //setInterval(() => this.refreshAccounts(), 100);
  }

  public async loadContracts() {
    let json = await this.http
      .get("/assets/contracts/GovtChains.json")
      .toPromise();
    let contract = await this.artifactsToContract(json);
    let govtChain = await contract.deployed();
    this.govtChain = govtChain;
    return govtChain;
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = TruffleContract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  public async createAccount() {
    return await this.web3.eth.accounts.create();
  }

  public async createBlock(_content) {
    return await this.govtChain.createBlock(_content, {
      from: this.currentAccount
    });
  }

  public async privateKeyToAccount(key) {
    return await this.web3.eth.accounts.privateKeyToAccount(key);
  }

  private async refreshAccounts() {
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

    if (
      !this.accounts ||
      this.accounts.length !== accs.length ||
      this.accounts[0] !== accs[0]
    ) {
      console.log("Observed new accounts");

      this.accounts$.next(accs);
      this.accounts = accs;
    }
    this.currentAccount = this.accounts[9];
    this.web3.eth.defaultAccount = this.currentAccount;
    this.ready = true;
  }
  watchEtherTransfers():Observable<any> {
    console.log("watchEtherTransfersx");
    return Observable.create((obs: Observer<any>) => {
      this.govtChain.BlockCreated((err, events) => {
        if (err) obs.error(err);
        else {
          obs.next(events);
        }
      });
    });
  }
}
