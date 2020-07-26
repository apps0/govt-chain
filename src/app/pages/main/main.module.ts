import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "contractors",
        loadChildren: () =>
          import("./block-contractors/block-contractors.module").then(
            (m) => m.BlockContractorsModule
          ),
      },
      {
        path: "projects",
        loadChildren: () =>
          import("./block-projects/block-projects.module").then(
            (m) => m.BlockProjectsModule
          ),
      },
      {
        path: "quotations",
        loadChildren: () =>
          import("./block-quotations/block-quotations.module").then(
            (m) => m.BlockQuotationsModule
          ),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: "",
        redirectTo: "settings",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [IonicModule, RouterModule.forChild(routes), SharedModule],
})
export class MainModule {}
