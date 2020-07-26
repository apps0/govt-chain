import { Component, OnInit } from "@angular/core";
import { AuthService, ThemeService } from "src/app/shared";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"],
})
export class AdminLoginComponent implements OnInit {
  createForm: FormGroup;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.createForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit(): void {}

  async onLogin() {
    if (this.createForm.valid) {
      const { username, password } = this.createForm.value;
      this.createForm.reset();
      if (this.auth.adminLogin(username, password))
        this.router.navigate(["main"]);
    } else {
      await this.themeService.alert(
        "Fields Missing",
        "All Fields are necessary."
      );
    }
  }
}
