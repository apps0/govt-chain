import { Injectable } from "@angular/core";
import { Web3Service } from "./web3";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { BlocksService } from "./blocks";

export const EVENT_CONTRACTOR_CREATED = "ContractorCreated";
export const EVENT_CONTRACTOR_UPDATED = "ContractorUpdated";
@Injectable({
  providedIn: "root",
})
export class ContractorsService extends BlocksService {
  change$: Observable<any>;
  contractors$ = this.blocks(
    "contractorCount",
    "contractors",
    this.blockToObject
  );

  constructor(web3: Web3Service) {
    super(web3, "ContractorsChain");
    this.change$ = this.watchEvents([
      EVENT_CONTRACTOR_CREATED,
      EVENT_CONTRACTOR_UPDATED,
    ]);
  }

  protected blockToObject(result) {
    console.log(result);
    return {
      id: result["id"].toNumber(),
      name: result["name"],
      email: result["email"],
      phoneNumber: result["phoneNumber"],
      licenseNo: result["licenseNo"],
      addressLines: result["addressLines"],
      status: result["status"],
    };
  }

  async save({ uid, name, phoneNumber, email, licenseNo, addressLines }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.createContractor(
      uid,
      name,
      phoneNumber,
      email,
      licenseNo,
      addressLines,
      {
        from: this.web3.currentAccount,
      }
    );
  }

  async getContractorData(id) {
    return await this.block(id, "contractors", this.blockToObject).toPromise();
  }

  async approve(id: number) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.approve(id, {
      from: this.web3.currentAccount,
    });
  }
  async reject(id: number) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.reject(id, {
      from: this.web3.currentAccount,
    });
  }
}
