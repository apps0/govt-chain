import { Observable } from "rxjs/internal/Observable";
import { Web3Service } from "./web3";
import { tap, filter, shareReplay, switchMap, take } from "rxjs/operators";
import { Observer } from "rxjs";

export const EVENT_BLOCK_CREATED = "BlockCreated";
export const EVENT_BLOCK_UPDATED = "BlockUpdated";

export abstract class BlocksService {
  chain$: Observable<any>;

  constructor(protected web3: Web3Service, chainName: string) {
    this.chain$ = this.web3.initChain(chainName).pipe(
      tap((x) => {
        console.log(x);
      }),
      filter((x) => !!x),
      shareReplay(1)
    );
  }

  blocks(countField, blockField, resultMap: Function) {
    return this.chain$.pipe(
      switchMap((chain) => this.get(chain, countField, blockField, resultMap)),
      take(1)
    );
  }

  block(blockId, blockField, resultMap: Function): Observable<any> {
    return this.chain$.pipe(
      switchMap((chain) => this.getOne(chain, blockId, blockField, resultMap)),
      take(1)
    );
  }

  protected watchEvents(eventNames: string[]): Observable<any> {
    return this.chain$.pipe(
      switchMap((chain) =>
        Observable.create((obs: Observer<any>) => {
          eventNames.forEach((eventName) => {
            chain[eventName]((err, event) => {
              if (err) obs.error(err);
              else {
                obs.next(event);
              }
            });
          });
        })
      )
    );
  }
  private get(chain, countField, blockField, resultMap) {
    return Observable.create(async (obs: Observer<any>) => {
      let counts = await chain[countField](),
        values = [];

      for (let i = 1; i <= counts; i++) {
        let block = await chain[blockField](i);
        values.push(resultMap(block));
      }

      obs.next(values);
      obs.complete();
    });
  }
  private getOne(chain, blockId, blockField, resultMap) {
    return Observable.create(async (obs: Observer<any>) => {
      let data = await chain[blockField](blockId);
      if (data) data = resultMap(data);
      obs.next(data);
      obs.complete();
    });
  }
  public getMapOfMap(chain, blockId, counts, blockField, resultMap) {
    return Observable.create(async (obs: Observer<any>) => {
      let values = [];

      for (let i = 1; i <= counts; i++) {
        let block = await chain[blockField](blockId, i);
        values.push(resultMap(block));
      }
      obs.next(values);
      obs.complete();
    });
  }
}
