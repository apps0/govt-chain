import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockCommentsComponent } from './block-comments.component';

describe('BlockCommentsComponent', () => {
  let component: BlockCommentsComponent;
  let fixture: ComponentFixture<BlockCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
