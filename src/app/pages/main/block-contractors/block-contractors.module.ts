import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewContractorsComponent } from "./view-contractors/view-contractors.component";
import { SharedModule } from "src/app/shared";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { BlockContractorsComponent } from "./block-contractors.component";

const routes: Routes = [
  {
    path: "",
    component: BlockContractorsComponent,
    children: [
      {
        path: "view",
        component: ViewContractorsComponent,
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
  declarations: [BlockContractorsComponent, ViewContractorsComponent],
  imports: [IonicModule, RouterModule.forChild(routes), SharedModule],
})
export class BlockContractorsModule {}
