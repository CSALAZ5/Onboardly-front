import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Collaborators } from './collaborators';

describe('Collaborators', () => {
  let component: Collaborators;
  let fixture: ComponentFixture<Collaborators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collaborators]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Collaborators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
