import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockCommentsComponent } from "./block-comments.component";
import { SharedModule } from "src/app/shared";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: BlockCommentsComponent,
  },
];

@NgModule({
  declarations: [BlockCommentsComponent],
  imports: [SharedModule, IonicModule, RouterModule.forChild(routes)],
})
export class BlockCommentsModule {}
