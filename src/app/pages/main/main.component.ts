import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { Web3Service } from "src/app/shared";
import { Observable, BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  @ViewChild("download") aDownload: ElementRef;
  @ViewChild("upload") upload: ElementRef;

  readyToDownload = false;
  account$: Subject<any> = new Subject();
  values$: Subject<any> = new Subject();
  constructor(public web3: Web3Service, private renderer: Renderer2) {}

  async ngOnInit() {
    await this.refresh();
    this.web3.watchEtherTransfers().subscribe(res => {
      console.log(res);
      this.refresh();
    });

    // this.renderer.listen(
    //   this.upload.nativeElement,
    //   "change",
    //   this.uploadAccount.bind(this)
    // );
  }

  blockToObject(result) {
    return {
      id: result[0].toNumber(),
      content: result[1],
      completed: result[2]
    };
  }
  async refresh() {
    let chains = await this.web3.loadContracts();
    let counts = await chains.blockCount(),
      values = [];

    for (let i = 1; i <= counts; i++) {
      let block = await chains.blocks(i);
      values.push(this.blockToObject(block));
    }

    this.values$.next(values);
  }

  async createAccount() {
    // let account = { address: "hello", privateKey: "privateKey" };
    let account = await this.web3.createAccount();
    let text = JSON.stringify(account),
      a = this.aDownload.nativeElement;

    var file = new Blob([text], { type: "application/json" });

    console.log(this.aDownload);
    a.href = URL.createObjectURL(file);
    a.download = "govtChainsScrtKey";

    this.account$.next(account);
    this.readyToDownload = true;
  }

  uploadAccount() {
    var file_to_read = this.upload.nativeElement.files[0];
    var fileread = new FileReader();
    let that = this;
    fileread.onload = function(e) {
      let content: any = e.target.result;
      // console.log(content);
      var intern = JSON.parse(content); // Array of Objects.
      that.useExistingAccount(intern);
    };
    fileread.readAsText(file_to_read);
  }

  async useExistingAccount(useAccount) {
    let { privateKey } = useAccount;
    let account = await this.web3.privateKeyToAccount(privateKey);
    this.account$.next(account);
  }

  createBlock(content) {
    if (content && content.trim() !== "") {
      console.log(content);
      this.web3.createBlock(content);
    }
  }
}
