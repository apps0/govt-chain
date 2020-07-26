import { Injectable } from "@angular/core";
import { Web3Service } from "./web3";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { BlocksService } from "./blocks";

@Injectable({
  providedIn: "root",
})
export class UsersService extends BlocksService {
  change$: Observable<any>;

  constructor(web3: Web3Service) {
    super(web3, "ContractorsChain");
  }

  protected blockToObject(result) {
    console.log(result);
    return {
      id: result["id"].toNumber(),
      name: result["name"],
      email: result["email"],
      phoneNumber: result["phoneNumber"],
    };
  }

  async save({ uid, name, phoneNumber, email }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.createUser(uid, name, phoneNumber, email, {
      from: this.web3.currentAccount,
    });
  }

  async getUserData(id) {
    return await this.block(id, "users", this.blockToObject).toPromise();
  }
}
