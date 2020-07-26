import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ThemeService, IpfsStorageService } from "src/app/shared";
import { ModalController } from "@ionic/angular";
import { ProgressService } from "src/app/shared/services/progress";

@Component({
  selector: "app-progress-form",
  templateUrl: "./progress-form.component.html",
  styleUrls: ["./progress-form.component.scss"],
})
export class ProgressFormComponent implements OnInit {
  createForm: FormGroup;

  projectId;
  contractorId;
  quotationId;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private modal: ModalController,
    private ipfsStorageService: IpfsStorageService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      projectId: [this.projectId, Validators.required],
      contractorId: [this.contractorId, Validators.required],
      quotationId: [this.quotationId, Validators.required],
      description: ["", Validators.required],
      fileContent: ["", Validators.required],
      file: [null, Validators.required],
    });
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
      projectId: formModel.projectId,
      contractorId: formModel.contractorId,
      quotationId: formModel.quotationId,
      description: formModel.description,
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
        const result = await this.progressService.save(data);
        console.log(result);
        this.themeService.alert("Success", "Progress added successfully");
        this.createForm.reset();

        this.onClose();
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
  onClose() {
    this.modal.dismiss();
  }
}
