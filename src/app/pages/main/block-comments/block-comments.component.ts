import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, Observable, pipe } from "rxjs";
import {
  ProjectsService,
  AuthService,
  EVENT_COMMENTS_CREATED,
  ThemeService,
} from "src/app/shared";
import { take, map, switchMap, shareReplay, takeWhile } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-block-comments",
  templateUrl: "./block-comments.component.html",
  styleUrls: ["./block-comments.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockCommentsComponent implements OnDestroy {
  isAlive = true;
  projectId$: Observable<any>;
  chatInput: FormControl = new FormControl("", Validators.required);

  projectId;
  data$: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
    private projectsService: ProjectsService,
    public auth: AuthService,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.route.params.subscribe((params) => {
      console.log("params", params);
      const { projectId } = params;
      this.projectId = projectId;
    });
    this.projectsService.change$
      // .pipe(takeWhile(() => this.isAlive))
      .subscribe((change) => {
        console.log("change", change);
        let toLoad = false;
        if (change && change.event == EVENT_COMMENTS_CREATED) {
          toLoad = true;
        }
        if (toLoad && this.projectId) {
          if (change["returnValues"].projectId == this.projectId) {
            this.themeService.toast("New Comment");
          }
          setTimeout(() => {
            this.loadDatas();
          }, 100);
        }
      });
  }
  ngOnDestroy(): void {
    this.isAlive = false;
  }

  ionViewWillEnter() {
    console.count("ionViewWillEnter");
    this.loadDatas();
  }

  async loadDatas() {
    console.count("loadDatas");
    let project = await this.projectsService.projects$
      .pipe(
        map((x: any) => x.filter((p) => p.id == this.projectId).pop()),
        take(1)
      )
      .toPromise();

    console.log("projectId", project);
    let datas: any = await this.projectsService.getComments(
      project.id,
      project.commentCount
    );
    console.log("loadDatas", datas);

    this.data$.next(datas);
    this.cd.markForCheck();
  }

  async sendMessage() {
    let user: any = await this.auth.getCurrentUser();
    let project = await this.projectsService.projects$
      .pipe(
        map((x: any) => x.filter((p) => p.id == this.projectId).pop()),
        take(1)
      )
      .toPromise();

    console.log("user", user);

    if (user && user.type == "admin") {
      user = {
        ...user,
        id: 0,
      };
    }
    if (this.chatInput.valid && user && project) {
      const data = {
        message: this.chatInput.value,
        displayName: user.name,
        photoURL: user.photoURL ? user.photoURL : "",
        projectId: project.id,
        userId: user.id,
        userType: user.type,
      };

      console.log(data);

      await this.themeService.progress(true);

      try {
        const result = await this.projectsService.addComment(data);
        console.log(result);
        this.chatInput.reset();
      } catch (err) {
        console.error(err);
        this.themeService.alert("Error", "Sorry something went wrong .");
      }
      await this.themeService.progress(false);
    } else {
      await this.themeService.alert(
        "Fields Missing",
        "All Fields are necessary."
      );
    }
  }
  isMyMessage$(msg) {
    return this.auth.user$.pipe(
      map((x) => {
        return (
          (x && x.id == msg.userId && x.type == msg.userType) ||
          (x && x.type == "admin" && msg.userId == 0)
        );
      })
    );
  }
}
