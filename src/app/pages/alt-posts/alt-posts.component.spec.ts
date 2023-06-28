import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltPostsComponent } from './alt-posts.component';

describe('AltPostsComponent', () => {
  let component: AltPostsComponent;
  let fixture: ComponentFixture<AltPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AltPostsComponent]
    });
    fixture = TestBed.createComponent(AltPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
