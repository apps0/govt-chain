import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { AuthService } from "../../shared";
import { BlockContractorsModule } from "../main/block-contractors/block-contractors.module";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  async onLogin() {
    try {
      let credential = await this.auth.googleSignIn();

      console.log(credential);

      let uid = credential.user.uid;

      let userMap = await this.auth.getUserMap(uid).toPromise();

      console.log(userMap);

      if (!userMap || !userMap.id) {
        this.router.navigate([`register/${uid}`]);
      } else this.router.navigateByUrl("/");
    } catch (err) {
      this.presentToast(
        "Sorry something went wrong, please check your connection"
      );
      console.log(err);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
