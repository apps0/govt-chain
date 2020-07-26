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

export const EVENT_COMMENTS_CREATED = "CommentCreated";
@Injectable({
  providedIn: "root",
})
export class ProjectsService extends BlocksService {
  change$: Observable<any>;
  projects$ = this.blocks("blockCount", "blocks", this.blockToObject);

  constructor(web3: Web3Service) {
    super(web3, "ProjectsChain");
    this.change$ = this.watchEvents([
      EVENT_BLOCK_CREATED,
      EVENT_BLOCK_UPDATED,
      EVENT_COMMENTS_CREATED,
    ]);
  }

  protected blockToObject(result) {
    return {
      id: result["id"].toNumber(),
      name: result["name"],
      description: result["description"],
      fund: result["fund"],
      status: result["status"],
      quotationId: result["quotationId"]?.toNumber(),
      contractorId: result["contractorId"]?.toNumber(),
      commentCount: result["commentCount"]?.toNumber(),
    };
  }

  protected commentToObject(result) {
    return {
      id: result["id"].toNumber(),
      projectId: result["projectId"]?.toNumber(),
      message: result["message"],
      userId: result["userId"]?.toNumber(),
      displayName: result["displayName"],
      userType: result["userType"],
      timestamp: result["timestamp"]?.toNumber(),
      photoURL: result["photoURL"],
    };
  }

  async getProjects(id?: number) {
    let data: any = await this.projects$.pipe(take(1)).toPromise();
    return id ? data.filter((x) => x.id == id).pop() : data;
  }

  async save({ name, description, fund }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.createBlock(name, description, fund, {
      from: this.web3.currentAccount,
    });
  }

  async getComments(projectId, counts) {
    return this.chain$
      .pipe(
        switchMap((chain) =>
          this.getMapOfMap(
            chain,
            projectId,
            counts,
            "comments",
            this.commentToObject
          )
        ),
        take(1)
      )
      .toPromise();
  }
  async addComment({
    projectId,
    userId,
    displayName,
    photoURL,
    userType,
    message,
  }) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.addComment(
      projectId,
      userId,
      displayName,
      photoURL,
      userType,
      message,
      {
        from: this.web3.currentAccount,
      }
    );
  }

  async assignQuotation(
    projectId: number,
    quotationId: number,
    contractorId: number
  ) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.assignQuotation(projectId, quotationId, contractorId, {
      from: this.web3.currentAccount,
    });
  }
  async complete(projectId: number) {
    const chain = await this.chain$.pipe(take(1)).toPromise();
    return await chain.complete(projectId, {
      from: this.web3.currentAccount,
    });
  }
}
