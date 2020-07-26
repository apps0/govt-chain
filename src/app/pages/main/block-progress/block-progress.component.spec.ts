import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProgressComponent } from './block-progress.component';

describe('BlockProgressComponent', () => {
  let component: BlockProgressComponent;
  let fixture: ComponentFixture<BlockProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
