import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  ProjectsService,
  EVENT_BLOCK_CREATED,
  ThemeService,
  IpfsStorageService,
  AuthService,
} from "src/app/shared";
import { take } from "rxjs/operators";
import { ProgressService } from "src/app/shared/services/progress";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { ProgressFormComponent } from "./progress-form/progress-form.component";

@Component({
  selector: "app-block-progress",
  templateUrl: "./block-progress.component.html",
  styleUrls: ["./block-progress.component.scss"],
})
export class BlockProgressComponent implements OnInit {
  data$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    public auth: AuthService,
    private progressService: ProgressService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private ipfsService: IpfsStorageService,
    private modal: ModalController
  ) {}

  ngOnInit(): void {
    this.progressService.change$.subscribe((x) => {
      console.log("change", x);
      let toLoad = false;
      if (x.event == EVENT_BLOCK_CREATED) {
        toLoad = true;
      }

      if (toLoad) this.loadDatas();
    });
  }

  ionViewDidEnter() {
    this.loadDatas();
  }

  async loadDatas() {
    console.log("loadDatas", status);
    let project = await this.loadProject();
    console.log("project", project);
    if (project) {
      let progress: any = await this.progressService.getByProject(project.id);

      console.log("loadDatas - project", project);
      console.log("loadDatas - progress", progress);

      this.data$.next({ project, progress });
    }
  }

  async loadProject() {
    let params = await this.route.params.pipe(take(1)).toPromise();
    console.log(params);

    return await this.projectsService.getProjects(params.projectId);
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
      j.download = `progress_${_data.id}_${Date.now()}.csv`;
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

  async openProgressForm(project) {
    console.log(project);
    const modal = await this.modal.create({
      component: ProgressFormComponent,
      componentProps: {
        projectId: project.id,
        contractorId: project.contractorId,
        quotationId: project.quotationId,
      },
    });

    return modal.present();
  }
}
