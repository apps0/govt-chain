import { Injectable } from "@angular/core";
import { Web3Service } from "./web3";
import {
  switchMap,
  tap,
  filter,
  share,
  shareReplay,
  first,
  takeLast,
  take,
} from "rxjs/operators";
import { Observable, Observer } from "rxjs";
import {
  BlocksService,
  EVENT_BLOCK_CREATED,
  EVENT_BLOCK_UPDATED,
} from "./blocks";

@Injectable({
  providedIn: "root",
})
export class ProgressService extends BlocksService {
  change$: Observable<any>;
  progress$ = this.blocks("blockCount", "blocks", this.blockToObject);

  constructor(web3: Web3Service) {
    super(web3, "ProgressChain");
    this.change$ = this.watchEvents([EVENT_BLOCK_CREATED]);
  }

  protected blockToObject(result) {
    console.log(result);
    return {
      id: result["id"]?.toNumber(),
      projectId: result["projectId"]?.toNumber(),
      contractorId: result["contractorId"]?.toNumber(),
      quotationId: result["quotationId"]?.toNumber(),
      description: result["description"],
      fileHash: result["fileHash"],
    };
  }

  async getByProject(projectId: number) {
    if (!projectId) throw new Error("Invalid Project Id");

    let data: any = await this.progress$.pipe(take(1)).toPromise();
    return data.filter((x) => x.projectId == projectId);
  }

  async save({ projectId, contractorId, quotationId, description, fileHash }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.createBlock(
      projectId,
      contractorId,
      quotationId,
      description,
      fileHash,
      {
        from: this.web3.currentAccount,
      }
    );
  }
}
