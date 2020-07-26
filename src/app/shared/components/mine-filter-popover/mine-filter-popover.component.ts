import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-mine-filter-popover",
  templateUrl: "./mine-filter-popover.component.html",
  styleUrls: ["./mine-filter-popover.component.scss"],
})
export class MineFilterPopoverComponent implements OnInit {
  activeFilter;
  constructor(public popoverController: PopoverController) {}

  ngOnInit(): void {}

  onOptions(data) {
    this.popoverController.dismiss(data);
  }
}
