import { NgModule } from "@angular/core";
import { SharedModule, AdminGuard } from "src/app/shared";
import { Routes, RouterModule } from "@angular/router";
import { BlockProjectsComponent } from "./block-projects.component";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { ViewProjectsComponent } from "./view-projects/view-projects.component";
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
  {
    path: "",
    component: BlockProjectsComponent,
    children: [
      {
        path: "form",
        component: CreateProjectComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "view",
        component: ViewProjectsComponent,
      },
      {
        path: "progress/:projectId",
        loadChildren: () =>
          import("../block-progress/block-progress.module").then(
            (m) => m.BlockProgressModule
          ),
      },
      {
        path: "comments/:projectId",
        loadChildren: () =>
          import("../block-comments/block-comments.module").then(
            (m) => m.BlockCommentsModule
          ),
      },
      {
        path: "",
        redirectTo: "view",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  declarations: [
    BlockProjectsComponent,
    CreateProjectComponent,
    ViewProjectsComponent,
  ],
  imports: [SharedModule, IonicModule, RouterModule.forChild(routes)],
})
export class BlockProjectsModule {}
