import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { IonicModule } from "@ionic/angular";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MineFilterPopoverComponent } from "./components/mine-filter-popover/mine-filter-popover.component";

@NgModule({
  declarations: [TableViewComponent, MineFilterPopoverComponent],
  imports: [CommonModule, IonicModule, NgxDatatableModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    TableViewComponent,
    MineFilterPopoverComponent,
  ],
})
export class SharedModule {}
