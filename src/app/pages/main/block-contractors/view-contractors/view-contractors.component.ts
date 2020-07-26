import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  ContractorsService,
  EVENT_CONTRACTOR_CREATED,
  EVENT_CONTRACTOR_UPDATED,
  AuthService,
} from "src/app/shared";
import { tap, map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-contractors",
  templateUrl: "./view-contractors.component.html",
  styleUrls: ["./view-contractors.component.scss"],
})
export class ViewContractorsComponent implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject([]);
  activeStatus: string = "new";
  constructor(
    public router: Router,
    public auth: AuthService,
    private contractorsService: ContractorsService
  ) {}

  ngOnInit(): void {
    this.contractorsService.change$.subscribe((x) => {
      console.log("change", x);
      let toLoad = false;
      if (x.event == EVENT_CONTRACTOR_CREATED && this.activeStatus == "new") {
        toLoad = true;
      } else if (x.event == EVENT_CONTRACTOR_UPDATED) {
        toLoad = true;
      }

      if (toLoad) this.loadDatas();
    });
  }

  ionViewDidEnter() {
    this.loadDatas();
  }

  onSegment(status) {
    this.activeStatus = status;
    this.loadDatas();
  }

  loadDatas() {
    console.log("loadDatas", status);
    this.contractorsService.contractors$
      .pipe(
        tap((x) => console.log("loadDatas", x)),
        map((blocks: any) =>
          blocks.filter((x) => x.status === this.activeStatus)
        )
      )
      .subscribe((x) => this.data$.next(x));
  }

  onCreateContractor() {
    this.router.navigate([`/main/contractors/form`]);
  }

  async onApprove(id: number) {
    await this.contractorsService.approve(id);
  }
  async onReject(id: number) {
    await this.contractorsService.reject(id);
  }
}
