import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ThemeService, ProjectsService } from "src/app/shared";
import { Router } from '@angular/router';

@Component({
  selector: "app-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.scss"],
})
export class CreateProjectComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private projectsService: ProjectsService,
    public router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.createForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      fund: ["", Validators.required],
    });
  }

  prepareSaveInfo() {
    const formModel = this.createForm.value;
    let data = {
      name: formModel.name,
      description: formModel.description,
      fund: formModel.fund,
    };
    return data;
  }

  async onSubmit() {
    if (this.createForm.valid) {
      await this.themeService.progress(true);
      let data = this.prepareSaveInfo();

      try {
        const result = await this.projectsService.save(data);
        console.log(result);
        this.themeService.alert("Success", "Project added successfully");
        this.createForm.reset();
        this.router.navigate([`/main/projects/view`]);
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
