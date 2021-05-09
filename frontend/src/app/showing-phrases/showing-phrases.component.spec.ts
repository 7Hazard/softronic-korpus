import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowingPhrasesComponent } from './showing-phrases.component';

describe('ShowingPhrasesComponent', () => {
  let component: ShowingPhrasesComponent;
  let fixture: ComponentFixture<ShowingPhrasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowingPhrasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowingPhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
