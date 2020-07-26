import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SortType,ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit {
  title = "Table View";
  tableData;
  sortType = SortType.single;
  columnMode = ColumnMode.force;
  rows = [];
  columns = [];

  constructor(public modalController: ModalController) {}

  ngOnInit(): void {
    console.log(this.tableData);
    this.rows = this.tableData.data;
    this.columns = this.tableData.meta.fields.map((field) => {
      return { prop: field };
    });
  }
  onClose() {
    this.modalController.dismiss();
  }
}
