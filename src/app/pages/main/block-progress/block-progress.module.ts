import { NgModule } from "@angular/core";
import { BlockProgressComponent } from "./block-progress.component";
import { SharedModule } from "src/app/shared";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { ProgressFormComponent } from "./progress-form/progress-form.component";

const routes: Routes = [
  {
    path: "",
    component: BlockProgressComponent,
  },
];

@NgModule({
  declarations: [BlockProgressComponent, ProgressFormComponent],
  imports: [SharedModule, IonicModule, RouterModule.forChild(routes)],
})
export class BlockProgressModule {}
