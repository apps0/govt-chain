import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemeService, ContractorsService, UsersService } from "src/app/shared";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  uid;
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private contractorsService: ContractorsService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log(param);
      if (param.uid) {
        this.initForm(param.uid);
      }
    });
  }

  initForm(uid) {
    this.createForm = this.fb.group({
      uid: [uid, Validators.required],
      name: ["", Validators.required],
      email: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      addressLines: ["", Validators.required],
      licenseNo: ["", Validators.required],
      contractor: [false],
    });
    this.initContractorFields(false);
    this.createForm.get("contractor").valueChanges.subscribe((value) => {
      this.initContractorFields(value);
    });
  }
  initContractorFields(value) {
    const inputs = ["addressLines", "licenseNo"];
    inputs.forEach((input) => {
      const control = this.createForm.get(input);
      if (value) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }
  prepareData() {
    const formModel = this.createForm.value;

    let data: any = {
      uid: formModel.uid,
      name: formModel.name,
      email: formModel.email,
      phoneNumber: formModel.phoneNumber,
    };

    if (formModel.contractor) {
      data = {
        ...data,
        licenseNo: formModel.licenseNo,
        addressLines: formModel.addressLines,
      };
    }
    return data;
  }

  async onSubmit() {
    if (this.createForm.valid) {
      await this.themeService.progress(true);
      let data = this.prepareData();

      try {
        if (this.createForm.value.contractor) {
          await this.contractorsService.save(data);
        } else {
          await this.usersService.save(data);
        }
        this.createForm.reset();
        this.themeService.alert("Success", "Registration added successfully");
        this.router.navigate(["login"]);
      } catch (err) {
        console.error(err);
        this.themeService.alert("Error", "Sorry something went wrong .");
      }
      await this.themeService.progress(false);
    } else {
      await this.themeService.alert(
        "Fields Missing",
        "All Fields are necessary."
      );
    }
  }
}
