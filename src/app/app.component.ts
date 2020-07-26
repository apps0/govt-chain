import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "./shared";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = "govt-chains";

  constructor(private auth: AuthService) {
    this.auth.initAuth$.subscribe((x) => console.log("[User Validated]",x));
  }

  ngOnInit(): void {}
}
