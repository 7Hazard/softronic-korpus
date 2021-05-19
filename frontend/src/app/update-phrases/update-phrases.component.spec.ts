import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhrasesComponent } from './update-phrases.component';

describe('UpdatePhrasesComponent', () => {
  let component: UpdatePhrasesComponent;
  let fixture: ComponentFixture<UpdatePhrasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePhrasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
