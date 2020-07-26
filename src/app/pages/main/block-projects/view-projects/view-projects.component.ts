import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { ProjectsService, AuthService } from "src/app/shared";
import { map, tap, take } from "rxjs/operators";
import {
  EVENT_BLOCK_CREATED,
  EVENT_BLOCK_UPDATED,
} from "src/app/shared/services/blocks";
import { PopoverController } from "@ionic/angular";
import { MineFilterPopoverComponent } from "src/app/shared/components/mine-filter-popover/mine-filter-popover.component";

@Component({
  selector: "app-view-projects",
  templateUrl: "./view-projects.component.html",
  styleUrls: ["./view-projects.component.scss"],
})
export class ViewProjectsComponent implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject([]);
  activeStatus: string = "new";
  activeFilter = "all";

  constructor(
    public router: Router,
    private projectsService: ProjectsService,
    public auth: AuthService,
    public popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    this.projectsService.change$.subscribe((x) => {
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
    let datas: any = await this.projectsService.projects$
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

  openProjectForm() {
    this.router.navigate(["/main/projects/form"]);
  }

  onCreateQuotation(data) {
    this.router.navigate([`/main/quotations/form/${data.id}/${data.name}`]);
  }
  onProgressUpdate(data) {
    this.router.navigate([`/main/projects/progress/${data.id}`]);
  }
  onComments(projectId) {
    this.router.navigate([`/main/projects/comments/${projectId}`]);
  }
  async onComplete(data) {
    await this.projectsService.complete(data.id);
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
