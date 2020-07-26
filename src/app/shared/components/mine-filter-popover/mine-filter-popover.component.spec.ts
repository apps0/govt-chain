import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineFilterPopoverComponent } from './mine-filter-popover.component';

describe('MineFilterPopoverComponent', () => {
  let component: MineFilterPopoverComponent;
  let fixture: ComponentFixture<MineFilterPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineFilterPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineFilterPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
