import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/shared";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  constructor(public auth: AuthService, public router: Router) {}

  ngOnInit(): void {}

  onLogin() {
    this.router.navigate(["/login"]);
  }

  onLogout() {
    this.auth.signOut();
  }
}
