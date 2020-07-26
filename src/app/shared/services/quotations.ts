import { Injectable } from "@angular/core";
import { Web3Service } from "./web3";
import { take } from "rxjs/operators";
import { Observable, Observer } from "rxjs";
import {
  BlocksService,
  EVENT_BLOCK_CREATED,
  EVENT_BLOCK_UPDATED,
} from "./blocks";

@Injectable({
  providedIn: "root",
})
export class QuotationsService extends BlocksService {
  change$: Observable<any>;
  quotations$ = this.blocks("blockCount", "blocks", this.blockToObject);

  constructor(web3: Web3Service) {
    super(web3, "QuotationsChain");
    this.change$ = this.watchEvents([EVENT_BLOCK_CREATED, EVENT_BLOCK_UPDATED]);
  }

  protected blockToObject(result) {
    console.log(result);
    return {
      id: result["id"].toNumber(),
      projectName: result["projectName"],
      projectId: result["projectId"].toNumber(),
      status: result["status"],
      contractorId: result["contractorId"].toNumber(),
      contractorName: result["contractorName"],
      fileHash: result["fileHash"],
    };
  }

  async save({
    projectId,
    projectName,
    contractorId,
    contractorName,
    fileHash,
  }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.createBlock(
      projectId,
      projectName,
      contractorId,
      contractorName,
      fileHash,
      {
        from: this.web3.currentAccount,
      }
    );
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
