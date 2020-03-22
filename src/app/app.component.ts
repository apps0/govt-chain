import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Web3Service } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'govt-chains';

  constructor(private web3:Web3Service){}

  ngOnInit(): void {
    this.web3.bootstrapWeb3();
  }
}
