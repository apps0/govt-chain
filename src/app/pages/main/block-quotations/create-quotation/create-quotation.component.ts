import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ThemeService,
  QuotationsService,
  IpfsStorageService,
  AuthService,
  TableViewComponent,
} from "src/app/shared";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import * as Papa from "papaparse";

@Component({
  selector: "app-create-quotation",
  templateUrl: "./create-quotation.component.html",
  styleUrls: ["./create-quotation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateQuotationComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private quotationsService: QuotationsService,
    private ipfsStorageService: IpfsStorageService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private modal: ModalController,
    public router: Router
  ) {
    this.createForm = this.fb.group({
      projectName: ["", Validators.required],
      projectId: ["", Validators.required],
      contractorId: ["", Validators.required],
      contractorName: ["", Validators.required],
      fileContent: ["", Validators.required],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (param) => {
      console.log(param);
      if (param.projectId && param.projectName) {
        const user = await this.auth.getCurrentUser();
        this.patchForm(param.projectId, param.projectName, user.id, user.name);
      }
    });
  }

  patchForm(projectId, projectName, contractorId, contractorName) {
    this.createForm.patchValue({
      projectName: projectName,
      projectId: projectId,
      contractorId: contractorId,
      contractorName: contractorName,
    });
    this.cd.markForCheck();
  }

  setFileData(theFile: File) {
    this.createForm.get("file").setValue(theFile);

    var reader = new FileReader();
    console.log(theFile);
    const that = this;
    reader.onload = function (loadedEvent) {
      // result contains loaded file.
      that.createForm
        .get("fileContent")
        .setValue(new Buffer(loadedEvent.target.result as ArrayBuffer));
    };
    reader.readAsArrayBuffer(theFile);
  }
  prepareSaveData(fileHash) {
    const formModel = this.createForm.value;
    return {
      projectName: formModel.projectName,
      projectId: formModel.projectId,
      contractorId: formModel.contractorId,
      contractorName: formModel.contractorName,
      fileHash: fileHash,
    };
  }
  async onSubmit() {
    if (this.createForm.valid) {
      await this.themeService.progress(true);

      try {
        console.log(this.createForm.value);

        const ipfsResult = await this.ipfsStorageService.upload(
          this.createForm.get("fileContent").value
        );
        const data = this.prepareSaveData(ipfsResult.path);
        console.log(data);
        const result = await this.quotationsService.save(data);
        console.log(result);
        this.themeService.alert("Success", "Quotation added successfully");
        this.createForm.reset();
        this.router.navigate([`/main/quotations/view`]);
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
  async onFileView() {
    if (this.createForm.get("file").invalid) return;

    const modal = await this.modal.create({
      component: TableViewComponent,
      componentProps: {
        tableData: await this.parsedFileData(),
      },
    });

    return modal.present();
  }

  async parsedFileData() {
    return new Promise((res) => {
      Papa.parse(this.createForm.get("file").value, {
        header: true,
        complete: function (results, file) {
          console.log("Parsing complete:", results, file);
          res(results);
        },
      });
    });
  }
}
