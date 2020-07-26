import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import {
  QuotationsService,
  EVENT_BLOCK_CREATED,
  IpfsStorageService,
  ThemeService,
  TableViewComponent,
  ProjectsService,
  EVENT_BLOCK_UPDATED,
  AuthService,
} from "src/app/shared";
import { map, tap, take } from "rxjs/operators";
import { ModalController, PopoverController } from "@ionic/angular";
import { MineFilterPopoverComponent } from "src/app/shared/components/mine-filter-popover/mine-filter-popover.component";

@Component({
  selector: "app-view-quotations",
  templateUrl: "./view-quotations.component.html",
  styleUrls: ["./view-quotations.component.scss"],
})
export class ViewQuotationsComponent implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject([]);
  activeStatus: string = "new";
  activeFilter = "all";
  constructor(
    public router: Router,
    private quotationsService: QuotationsService,
    private projectsService: ProjectsService,
    private ipfsService: IpfsStorageService,
    private themeService: ThemeService,
    private modal: ModalController,
    public auth: AuthService,
    public popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    this.quotationsService.change$.subscribe((x) => {
      console.log("change", x);
      let toLoad = false;
      if (x.event == EVENT_BLOCK_CREATED || x.event == EVENT_BLOCK_UPDATED) {
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

  async loadDatas() {
    console.log("loadDatas", status);
    let datas: any = await this.quotationsService.quotations$
      .pipe(take(1))
      .toPromise();
    console.log("loadDatas", datas);

    // filter data by segment
    datas = datas.filter((x) => x.status === this.activeStatus);

    // filter by user
    if (this.activeFilter == "mine") {
      let user = await this.auth.user$.pipe(take(1)).toPromise();
      datas = datas.filter((x) => x.contractorId === user.id);
    }

    this.data$.next(datas);
  }

  async onDownload(_data) {
    if (!_data.fileHash || _data.fileHash == "") {
      this.themeService.alert("Error", "Invalid File");
      return;
    }

    await this.themeService.progress(true);
    try {
      let j = document.createElement("a");
      j.id = "download";
      j.download = `quotation_${_data.id}_${Date.now()}.csv`;
      j.href = URL.createObjectURL(
        new Blob([await this.ipfsService.fetch(_data.fileHash)], {
          type: "text/csv",
        })
      );
      j.click();
    } catch (err) {
      console.error(err);
    }
    await this.themeService.progress(false);
  }

  async onView(_data) {
    if (!_data.fileHash || _data.fileHash == "") {
      this.themeService.alert("Error", "Invalid File");
      return;
    }

    await this.themeService.progress(true);

    try {
      const data = await this.ipfsService.parse(_data.fileHash);
      // const decodedString = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
      console.log(data);
      this.openTableModal(data);
    } catch (err) {
      console.error(err);
    }
    await this.themeService.progress(false);
  }

  async openTableModal(data) {
    const modal = await this.modal.create({
      component: TableViewComponent,
      componentProps: {
        tableData: data,
      },
    });

    return modal.present();
  }

  async onApprove(data) {
    console.log(data);

    let transaction = await this.projectsService.assignQuotation(
      data.projectId,
      data.id,
      data.contractorId
    );
    console.log("onApprove", transaction);
    if (transaction.logs.length > 0) {
      await this.quotationsService.approve(data.id);
    } else {
      this.themeService.toast("Invalid request");
    }
  }
  async onReject(id: number) {
    await this.quotationsService.reject(id);
  }
  async onMineFilter(ev) {
    const popover = await this.popoverController.create({
      component: MineFilterPopoverComponent,
      componentProps: {
        activeFilter: this.activeFilter,
      },
      event: ev,
      translucent: true,
    });

    await popover.present();

    const event = await popover.onDidDismiss();
    console.log(event);

    if (event && event.data) {
      this.activeFilter = event.data;
      this.loadDatas();
    }
  }
}
