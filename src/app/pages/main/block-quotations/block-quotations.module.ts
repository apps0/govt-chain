import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockQuotationsComponent } from "./block-quotations.component";
import { Routes, RouterModule } from "@angular/router";
import { CreateQuotationComponent } from "./create-quotation/create-quotation.component";
import { IonicModule } from "@ionic/angular";
import { SharedModule, ContractorGuard } from "src/app/shared";
import { ViewQuotationsComponent } from "./view-quotations/view-quotations.component";

const routes: Routes = [
  {
    path: "",
    component: BlockQuotationsComponent,
    children: [
      {
        path: "form/:projectId/:projectName",
        component: CreateQuotationComponent,
        canActivate: [ContractorGuard],
      },
      {
        path: "view",
        component: ViewQuotationsComponent,
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
    BlockQuotationsComponent,
    CreateQuotationComponent,
    ViewQuotationsComponent,
  ],
  imports: [IonicModule, RouterModule.forChild(routes), SharedModule],
})
export class BlockQuotationsModule {}
